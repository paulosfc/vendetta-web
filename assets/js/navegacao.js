/* =========================================================
   MENU
========================================================= */
function mostrarPagina(pagina, botao) {
    // Esconde todas as páginas
    document
        .querySelectorAll(".pagina")
        .forEach(secao => {
        secao.classList.add("hidden");
    });
    // Procura a página selecionada
    const paginaSelecionada = document.getElementById(`pagina-${pagina}`);
    if (!paginaSelecionada) {
        console.error("Página não encontrada:", `pagina-${pagina}`);
        return;
    }
    // Mostra a página
    paginaSelecionada.classList.remove("hidden");
    // Remove active dos botões
    document
        .querySelectorAll(".menu-btn")
        .forEach(btn => {
        btn.classList.remove("active");
    });
    // Ativa o botão clicado
    if (botao) {
        botao.classList.add("active");
    }
    // Funções específicas
    if (pagina === "calculadora") {
        carregarItens();
    }
    if (pagina === "encomendas") {
        if (typeof carregarProdutosEncomenda === "function") {
            carregarProdutosEncomenda();
        }
        if (typeof carregarFiltroProdutosEncomenda === "function") {
            carregarFiltroProdutosEncomenda();
        }
        if (typeof mostrarEncomendas === "function") {
            mostrarEncomendas();
        }
    }
    if (pagina === "perimetros") {
        if (typeof carregarPerimetros === "function") {
            carregarPerimetros();
        }
    }
    if (pagina === "horario") {
        if (typeof atualizarHorarioPista === "function") {
            atualizarHorarioPista();
        }
    }
}
