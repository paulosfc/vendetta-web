/* =========================================================
   MENU / NAVEGAÇÃO ENTRE PÁGINAS
========================================================= */

function mostrarPagina(pagina, botao) {
    const paginaSelecionada = document.getElementById(`pagina-${pagina}`);

    if (!paginaSelecionada) {
        console.error("Página não encontrada:", `pagina-${pagina}`);
        return;
    }

    // Esconde todas as páginas e mostra a escolhida
    document.querySelectorAll(".pagina").forEach(secao => secao.classList.add("hidden"));
    paginaSelecionada.classList.remove("hidden");

    // Marca o botão ativo
    document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("active"));
    if (botao) botao.classList.add("active");

    // Ações específicas de cada página
    if (pagina === "encomendas") {
        carregarProdutosEncomenda();
        carregarFiltroProdutosEncomenda();
        carregarEncomendas(); // busca de novo no banco: outras pessoas podem ter alterado
    }

    if (pagina === "perimetros") {
        carregarPerimetros();
    }

    if (pagina === "crafts") {
        mostrarCrafts();
    }

    if (pagina === "rotas") {
        carregarRotas();
    }

    if (pagina === "investigativa") {
        carregarInvestigativa();
    }

    if (pagina === "horario") {
        atualizarHorarioPista();
    }
}
