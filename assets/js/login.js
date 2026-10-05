/* =========================================================
   LOGIN (tela index.html)

   Depende de: config.js, auth.js
========================================================= */

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS = 30000;

if (estaLogado()) window.location.replace(AUTH.paginaApp);

const form = document.getElementById("loginForm");
const erro = document.getElementById("loginErro");
const botao = document.getElementById("btnEntrar");
const campoEmail = document.getElementById("email") || document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
let tentativas = 0;

function mostrarErro(mensagem) {
    erro.textContent = mensagem;
    erro.classList.remove("hidden");

    const cartao = document.querySelector(".login-card");
    cartao.classList.remove("erro");
    void cartao.offsetWidth; // reinicia a animação
    cartao.classList.add("erro");
}

function segundosBloqueado() {
    return Math.ceil((Number(localStorage.getItem("loginBloqueadoAte")) - Date.now()) / 1000);
}

form.addEventListener("submit", async evento => {
    evento.preventDefault();
    erro.classList.add("hidden");

    if (!campoEmail || !campoSenha) {
        return mostrarErro("A página de login está desatualizada. Atualize o index.html e recarregue com Ctrl+F5.");
    }

    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (segundosBloqueado() > 0) {
        return mostrarErro(`Muitas tentativas. Aguarde ${segundosBloqueado()}s.`);
    }

    if (!email || !senha) {
        return mostrarErro("Preencha e-mail e senha.");
    }

    botao.disabled = true;
    botao.textContent = "Entrando...";

    try {
        await entrarNoSupabase(email, senha, document.getElementById("manterConectado").checked);
        window.location.replace(AUTH.paginaApp);
    } catch (e) {
        tentativas++;

        if (tentativas >= MAX_TENTATIVAS) {
            localStorage.setItem("loginBloqueadoAte", Date.now() + BLOQUEIO_MS);
            tentativas = 0;
            mostrarErro("Muitas tentativas. Aguarde 30s.");
        } else {
            mostrarErro(e.message || "Não foi possível entrar.");
        }
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
