/* =========================================================
   FORMATAR DINHEIRO
========================================================= */
function formatarDinheiro(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/* =========================================================
   FORMATAR NÚMERO
========================================================= */
function formatarNumero(numero) {
    return Number(numero).toLocaleString("pt-BR");
}

/* =========================================================
   ESCAPAR TEXTO
========================================================= */
function escaparTexto(texto) {
    return texto
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

/* =========================================================
   ESCAPAR HTML (evita injetar HTML em textos digitados)
========================================================= */
function escaparHtml(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
