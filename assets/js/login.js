/* =========================================================
   LOGIN
========================================================= */

/*
   Usuários: para adicionar um, gere o SHA-256 da senha e inclua aqui.
   Padrão: admin / vendetta123  (TROQUE antes de usar).
   Atenção: a validação roda no navegador; serve para controle de acesso
   simples, não substitui autenticação em servidor.
*/
const USUARIOS = [
    { usuario: "admin", nome: "Administrador", hash: "f2a4515c2589b0c15688d5587ad4d5cc0d0e652a9215376eae60f6d22a727353" }
];
const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS = 30000;

if (estaLogado()) window.location.replace(AUTH.paginaApp);

const form = document.getElementById("loginForm");
const erro = document.getElementById("loginErro");
const botao = document.getElementById("btnEntrar");
const campoSenha = document.getElementById("senha");
let tentativas = 0;

async function sha256(texto) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function mostrarErro(msg) {
    erro.textContent = msg;
    erro.classList.remove("hidden");
    const card = document.querySelector(".login-card");
    card.classList.remove("erro");
    void card.offsetWidth;
    card.classList.add("erro");
}

function segundosBloqueado() {
    return Math.ceil((Number(localStorage.getItem("loginBloqueadoAte")) - Date.now()) / 1000);
}

form.addEventListener("submit", async e => {
    e.preventDefault();
    erro.classList.add("hidden");
    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (segundosBloqueado() > 0) return mostrarErro(`Muitas tentativas. Aguarde ${segundosBloqueado()}s.`);
    if (!usuario || !senha) return mostrarErro("Preencha usuário e senha.");

    botao.disabled = true;
    botao.textContent = "Entrando...";
    try {
        const h = await sha256(senha);
        const conta = USUARIOS.find(u => u.usuario === usuario && u.hash === h);
        if (!conta) {
            tentativas++;
            if (tentativas >= MAX_TENTATIVAS) {
                localStorage.setItem("loginBloqueadoAte", Date.now() + BLOQUEIO_MS);
                tentativas = 0;
                return mostrarErro("Muitas tentativas. Aguarde 30s.");
            }
            return mostrarErro("Usuário ou senha incorretos.");
        }
        iniciarSessao(conta.nome, document.getElementById("manterConectado").checked);
        window.location.replace(AUTH.paginaApp);
    } catch {
        mostrarErro("Não foi possível validar o login neste navegador.");
    } finally {
        botao.disabled = false;
        botao.textContent = "Entrar";
    }
});

document.getElementById("toggleSenha").addEventListener("click", () => {
    const oculto = campoSenha.type === "password";
    campoSenha.type = oculto ? "text" : "password";
    document.getElementById("toggleSenha").setAttribute("aria-label", oculto ? "Ocultar senha" : "Mostrar senha");
});
