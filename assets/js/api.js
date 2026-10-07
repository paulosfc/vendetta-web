/* =========================================================
   API DO SUPABASE (banco de dados)

   Usa apenas fetch, sem bibliotecas externas.
   Depende de: config.js, auth.js
========================================================= */

class ErroApi extends Error {
    constructor(mensagem, status, codigo) {
        super(mensagem);
        this.status = status;
        this.codigo = codigo;
    }
}

async function criarErroApi(resposta) {
    let corpo = {};

    try {
        corpo = await resposta.json();
    } catch {
        // resposta sem JSON
    }

    let mensagem = corpo.message || corpo.msg || corpo.error_description || corpo.error || `Erro ${resposta.status}`;
    const codigo = corpo.code || corpo.error_code;
    const texto = String(mensagem).toLowerCase();

    // Erros de permissão: explica a causa e a solução
    if (texto.includes("permission denied for table") || texto.includes("permission denied for schema")) {
        mensagem += " — faltam permissões no banco. No Supabase (SQL Editor), rode o arquivo banco.sql atualizado.";
    } else if (texto.includes("row-level security")) {
        mensagem += " — sem permissão para esta ação. Sua conta pode ser somente leitura. Se você deveria poder editar, o administrador precisa rodar o SQL de permissões (hierarquia.sql) no Supabase.";
    } else if (texto.includes("could not find the table") || texto.includes("does not exist")) {
        mensagem += " — a tabela não existe. No Supabase (SQL Editor), rode o arquivo banco.sql.";
    }

    return new ErroApi(mensagem, resposta.status, codigo);
}

async function fazerRequisicao(caminho, opcoes, token) {
    try {
        return await fetch(SUPABASE_URL + caminho, {
            ...opcoes,
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${token}`,
                ...(opcoes.headers || {})
            }
        });
    } catch {
        throw new ErroApi("Sem conexão com o servidor. Verifique a internet.", 0);
    }
}

// Faz a chamada já autenticada. Se o token foi recusado (401),
// tenta renovar uma vez; se ainda assim falhar, volta ao login.
async function apiFetch(caminho, opcoes = {}) {
    let token = await obterTokenValido();

    if (!token) {
        irParaLogin();
        throw new ErroApi("Sessão expirada. Entre novamente.", 401);
    }

    let resposta = await fazerRequisicao(caminho, opcoes, token);

    if (resposta.status === 401) {
        const renovada = await renovarSessao().catch(() => null);

        if (!renovada) {
            limparSessao();
            irParaLogin();
            throw new ErroApi("Sessão expirada. Entre novamente.", 401);
        }

        resposta = await fazerRequisicao(caminho, opcoes, renovada.access_token);

        if (resposta.status === 401) {
            limparSessao();
            irParaLogin();
            throw new ErroApi("Sessão expirada. Entre novamente.", 401);
        }
    }

    return resposta;
}

/* =========================================================
   BANCO DE DADOS (PostgREST)
========================================================= */

// Quando uma conta SEM permissão tenta alterar/excluir, o banco não dá erro:
// responde "0 linhas afetadas". Tratamos isso como falta de permissão.
const MENSAGEM_SEM_LINHAS =
    "Sem permissão para alterar este registro (conta somente leitura?) ou ele já não existe.";

const banco = {
    async listar(tabela, consulta = "select=*") {
        const resposta = await apiFetch(`/rest/v1/${tabela}?${consulta}`);
        if (!resposta.ok) throw await criarErroApi(resposta);
        return resposta.json();
    },

    // Aceita um objeto ou uma lista de objetos. Devolve as linhas criadas.
    async inserir(tabela, linhas) {
        const resposta = await apiFetch(`/rest/v1/${tabela}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Prefer: "return=representation" },
            body: JSON.stringify(linhas)
        });
        if (!resposta.ok) throw await criarErroApi(resposta);
        return resposta.json();
    },

    async atualizar(tabela, id, dados) {
        const resposta = await apiFetch(`/rest/v1/${tabela}?id=eq.${encodeURIComponent(id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Prefer: "return=representation" },
            body: JSON.stringify(dados)
        });
        if (!resposta.ok) throw await criarErroApi(resposta);

        const linhas = await resposta.json();
        if (!linhas.length) throw new ErroApi(MENSAGEM_SEM_LINHAS, 403);
        return linhas[0];
    },

    async excluir(tabela, id) {
        const resposta = await apiFetch(`/rest/v1/${tabela}?id=eq.${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Prefer: "return=representation" }
        });
        if (!resposta.ok) throw await criarErroApi(resposta);

        const linhas = await resposta.json();
        if (!linhas.length) throw new ErroApi(MENSAGEM_SEM_LINHAS, 403);
    }
};

/* =========================================================
   PERFIL (função da pessoa logada)

   Funções: administrador, hierarquia e membro.
   ADMINISTRADOR e HIERARQUIA podem criar, editar e excluir.
   MEMBRO apenas visualiza.

   A regra de verdade fica no banco (RLS). Aqui só mostramos o
   nome da função e escondemos os botões que a pessoa não
   conseguiria usar.
========================================================= */

const ROTULOS_PAPEL = {
    administrador: "Administrador",
    hierarquia: "Hierarquia",
    membro: "Membro da Vendetta"
};

const PAPEIS_QUE_EDITAM = ["administrador", "hierarquia"];

// papel null = não deu para descobrir (banco antigo ou sem conexão)
const perfilUsuario = { papel: null, podeEditar: true };

async function chamarFuncaoDoBanco(nome) {
    const resposta = await apiFetch(`/rest/v1/rpc/${nome}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
    });

    return resposta.ok ? resposta.json() : undefined;
}

function aplicarPerfil() {
    document.body.classList.toggle("somente-leitura", !perfilUsuario.podeEditar);
    document.body.dataset.papel = perfilUsuario.papel || "";

    const nome = document.getElementById("usuarioLogado");
    if (nome) nome.textContent = perfilUsuario.papel ? ROTULOS_PAPEL[perfilUsuario.papel] : "Usuário";
}

async function carregarPerfil() {
    try {
        const papel = await chamarFuncaoDoBanco("meu_papel");

        if (typeof papel === "string") {
            perfilUsuario.papel = ROTULOS_PAPEL[papel] ? papel : "membro";
            perfilUsuario.podeEditar = PAPEIS_QUE_EDITAM.includes(perfilUsuario.papel);
        } else {
            // Banco ainda na versão anterior (só sabe se é administrador;
            // nesse caso a hierarquia aparece como membro)
            const administrador = await chamarFuncaoDoBanco("eh_administrador");

            if (typeof administrador === "boolean") {
                perfilUsuario.podeEditar = administrador;
                perfilUsuario.papel = administrador ? "administrador" : "membro";
            }
        }
    } catch (erro) {
        console.warn("Não foi possível verificar a função do usuário:", erro);
    }

    aplicarPerfil();
}
