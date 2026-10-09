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
    carregarInvestigativa();
    carregarPerfil().then(verificarMigracao);
});
