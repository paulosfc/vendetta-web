/* =========================================================
   API DO SUPABASE (banco de dados e armazenamento de fotos)

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

    const mensagem = corpo.message || corpo.msg || corpo.error_description || corpo.error || `Erro ${resposta.status}`;
    return new ErroApi(mensagem, resposta.status, corpo.code || corpo.error_code);
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
        if (!linhas.length) throw new ErroApi("Registro não encontrado (talvez já tenha sido excluído).", 404);
        return linhas[0];
    },

    async excluir(tabela, id) {
        const resposta = await apiFetch(`/rest/v1/${tabela}?id=eq.${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Prefer: "return=representation" }
        });
        if (!resposta.ok) throw await criarErroApi(resposta);
    }
};

/* =========================================================
   ARMAZENAMENTO DE ARQUIVOS (Storage)
========================================================= */

const caminhoStorage = (bucket, caminho) =>
    `/storage/v1/object/${bucket}/${caminho.split("/").map(encodeURIComponent).join("/")}`;

const armazenamento = {
    async enviar(bucket, caminho, arquivo) {
        const resposta = await apiFetch(caminhoStorage(bucket, caminho), {
            method: "POST",
            headers: {
                "Content-Type": arquivo.type || "application/octet-stream",
                "x-upsert": "false"
            },
            body: arquivo
        });
        if (!resposta.ok) throw await criarErroApi(resposta);
    },

    async baixar(bucket, caminho) {
        const resposta = await apiFetch(
            caminhoStorage(bucket, caminho).replace("/object/", "/object/authenticated/")
        );
        if (!resposta.ok) throw await criarErroApi(resposta);
        return resposta.blob();
    },

    async remover(bucket, caminhos) {
        const resposta = await apiFetch(`/storage/v1/object/${bucket}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prefixes: caminhos })
        });
        if (!resposta.ok) throw await criarErroApi(resposta);
    }
};

const EXTENSAO_POR_TIPO = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/heic": "heic"
};

// Nome do arquivo no Storage: sem acentos nem espaços, e sempre único
function nomeArquivoSeguro(arquivo) {
    let extensao = EXTENSAO_POR_TIPO[arquivo.type] || "";

    if (!extensao && arquivo.name.includes(".")) {
        extensao = arquivo.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
    }

    const aleatorio = Math.random().toString(36).slice(2, 8);
    return `${Date.now()}-${aleatorio}${extensao ? "." + extensao : ""}`;
}