/* =========================================================
   AUTENTICAÇÃO (Supabase Auth, e-mail + senha)

   Compartilhado entre a tela de login e o app.
   Depende de: config.js
========================================================= */

const AUTH = {
    chaveSessao: "vendettaSessao",
    paginaLogin: "index.html",
    paginaApp: "app.html",
    margemRenovacaoSeg: 60
};

class ErroAuth extends Error {}

/* =========================================================
   SESSÃO (fica no localStorage se "Manter conectado",
   senão no sessionStorage)
========================================================= */

function lerSessao() {
    for (const armazenamento of [localStorage, sessionStorage]) {
        try {
            const sessao = JSON.parse(armazenamento.getItem(AUTH.chaveSessao));
            if (sessao && sessao.access_token) return sessao;
        } catch {
            // ignora JSON inválido
        }
    }
    return null;
}

function gravarSessao(sessao) {
    const destino = sessao.persistente ? localStorage : sessionStorage;
    const outro = sessao.persistente ? sessionStorage : localStorage;

    outro.removeItem(AUTH.chaveSessao);
    destino.setItem(AUTH.chaveSessao, JSON.stringify(sessao));
}

function limparSessao() {
    localStorage.removeItem(AUTH.chaveSessao);
    sessionStorage.removeItem(AUTH.chaveSessao);
}

function estaLogado() {
    return lerSessao() !== null;
}

function irParaLogin() {
    window.location.replace(AUTH.paginaLogin);
}

function protegerPagina() {
    if (!estaLogado()) irParaLogin();
}

/* =========================================================
   LOGIN
========================================================= */

function traduzirErroAuth(corpo, status) {
    const codigo = String(corpo.error_code || corpo.code || corpo.error || "").toLowerCase();
    const texto = String(corpo.msg || corpo.message || corpo.error_description || "").toLowerCase();

    if (codigo === "invalid_credentials" || codigo === "invalid_grant" || texto.includes("invalid login")) {
        return "E-mail ou senha incorretos.";
    }
    if (codigo === "validation_failed" || texto.includes("invalid format") || texto.includes("unable to validate email")) {
        return "E-mail inválido. Digite o e-mail cadastrado no Supabase.";
    }
    if (codigo === "email_not_confirmed" || texto.includes("not confirmed")) {
        return "Este e-mail ainda não foi confirmado. No Supabase, confirme o usuário (Auto Confirm).";
    }
    if (status === 429 || codigo.includes("rate_limit")) {
        return "Muitas tentativas. Aguarde um pouco e tente de novo.";
    }
    return corpo.msg || corpo.message || corpo.error_description || `Erro ao entrar (${status}).`;
}

function sessaoDaResposta(dados, emailPadrao, persistente) {
    return {
        access_token: dados.access_token,
        refresh_token: dados.refresh_token,
        expires_at: dados.expires_at || Math.floor(Date.now() / 1000) + (dados.expires_in || 3600),
        email: (dados.user && dados.user.email) || emailPadrao,
        persistente: persistente
    };
}

async function entrarNoSupabase(email, senha, manterConectado) {
    let resposta;

    try {
        resposta = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: "POST",
            headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: senha })
        });
    } catch {
        throw new ErroAuth("Sem conexão com o servidor. Verifique a internet e tente de novo.");
    }

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        console.warn("Login recusado pelo Supabase:", resposta.status, dados);
        throw new ErroAuth(traduzirErroAuth(dados, resposta.status));
    }

    gravarSessao(sessaoDaResposta(dados, email, manterConectado));
}

/* =========================================================
   RENOVAÇÃO DO TOKEN
========================================================= */

let renovacaoEmAndamento = null;

// Devolve a sessão renovada, ou null se o login não vale mais.
// Erro de rede NÃO desloga: lança o erro para quem chamou tratar.
function renovarSessao() {
    if (renovacaoEmAndamento) return renovacaoEmAndamento;

    renovacaoEmAndamento = (async () => {
        const atual = lerSessao();
        if (!atual || !atual.refresh_token) return null;

        const resposta = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
            method: "POST",
            headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: atual.refresh_token })
        });

        if (resposta.status === 400 || resposta.status === 401 || resposta.status === 403) {
            limparSessao();
            return null;
        }

        if (!resposta.ok) {
            throw new ErroAuth(`Não foi possível renovar o login (${resposta.status}).`);
        }

        const dados = await resposta.json();
        const nova = sessaoDaResposta(dados, atual.email, atual.persistente);
        gravarSessao(nova);
        return nova;
    })().finally(() => {
        renovacaoEmAndamento = null;
    });

    return renovacaoEmAndamento;
}

async function obterTokenValido() {
    const sessao = lerSessao();
    if (!sessao) return null;

    const agora = Math.floor(Date.now() / 1000);

    if (sessao.expires_at - AUTH.margemRenovacaoSeg > agora) {
        return sessao.access_token;
    }

    const renovada = await renovarSessao();
    return renovada ? renovada.access_token : null;
}

/* =========================================================
   LOGOUT / USUÁRIO
========================================================= */

async function logout() {
    const sessao = lerSessao();

    if (sessao) {
        try {
            await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                method: "POST",
                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${sessao.access_token}` }
            });
        } catch {
            // sem internet: sai mesmo assim
        }
    }

    limparSessao();
    window.location.href = AUTH.paginaLogin;
}

function mostrarUsuarioLogado() {
    const elemento = document.getElementById("usuarioLogado");
    const sessao = lerSessao();

    if (elemento) elemento.textContent = sessao && sessao.email ? sessao.email : "Usuário";
}
