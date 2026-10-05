/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioLogado();
    carregarItens();
    carregarProdutosEncomenda();
    carregarFiltroProdutosEncomenda();
    carregarEncomendas();
    carregarPerimetros();
    iniciarHorarioPista();
    verificarMigracao();
});
