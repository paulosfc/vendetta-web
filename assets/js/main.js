/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
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
