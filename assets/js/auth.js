/* =========================================================
   AUTENTICAÇÃO (compartilhado entre login e app)
========================================================= */

const AUTH = {
    chaveLogin: "craftLogged",
    chaveUsuario: "craftUser",
    paginaLogin: "index.html",
    paginaApp: "app.html"
};

function estaLogado() {
    return localStorage.getItem(AUTH.chaveLogin) === "true" ||
        sessionStorage.getItem(AUTH.chaveLogin) === "true";
}

function protegerPagina() {
    if (!estaLogado()) window.location.replace(AUTH.paginaLogin);
}

function iniciarSessao(nome, manterConectado) {
    (manterConectado ? localStorage : sessionStorage).setItem(AUTH.chaveLogin, "true");
    localStorage.setItem(AUTH.chaveUsuario, nome);
}

function logout() {
    localStorage.removeItem(AUTH.chaveLogin);
    localStorage.removeItem(AUTH.chaveUsuario);
    sessionStorage.removeItem(AUTH.chaveLogin);
    window.location.href = AUTH.paginaLogin;
}

function mostrarUsuarioLogado() {
    const el = document.getElementById("usuarioLogado");
    if (el) el.textContent = localStorage.getItem(AUTH.chaveUsuario) || "Usuário";
}
