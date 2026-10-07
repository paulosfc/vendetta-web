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
    carregarCategoriasCrafts();
    mostrarCrafts();
    carregarRotas();
    carregarPerfil().then(verificarMigracao);
});
