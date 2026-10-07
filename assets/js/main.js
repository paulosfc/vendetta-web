/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    carregarItens();
    carregarProdutosEncomenda();
    carregarFiltroProdutosEncomenda();
    carregarEncomendas();
    carregarPerimetros();
    iniciarHorarioPista();
    carregarCategoriasCrafts();
    mostrarCrafts();
    carregarRotas();
    carregarPerfil().then(verificarMigracao);
});
