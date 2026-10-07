/* =========================================================
   ABA CRAFTS (somente visualização)

   Os dados ficam em dados-crafts.js. Este arquivo só desenha
   a tela, não precisa mexer aqui.

   Depende de: dados-crafts.js (CRAFTS)
               utils.js (formatarNumero)
========================================================= */

function craftsValidos() {
    return CRAFTS.filter(craft => {
        const valido = craft && craft.nome && craft.materiais && typeof craft.materiais === "object";
        if (!valido) console.warn("Craft ignorado (faltam dados):", craft);
        return valido;
    });
}

function carregarCategoriasCrafts() {
    const select = document.getElementById("filtroCategoriaCraft");
    if (!select) return;

    const selecionada = select.value;
    select.innerHTML = "";

    const todas = document.createElement("option");
    todas.value = "";
    todas.textContent = "Todas as categorias";
    select.appendChild(todas);

    // Categorias na ordem em que aparecem em dados-crafts.js
    [...new Set(craftsValidos().map(c => c.categoria).filter(Boolean))].forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        select.appendChild(option);
    });

    if (selecionada) select.value = selecionada;
}

function criarCardCraft(craft, nomesDosCrafts) {
    const card = document.createElement("article");
    card.className = "craft-card";

    const cabecalho = document.createElement("div");
    cabecalho.className = "craft-card-header";

    const titulos = document.createElement("div");

    if (craft.categoria) {
        const categoria = document.createElement("span");
        categoria.className = "craft-categoria";
        categoria.textContent = craft.categoria;
        titulos.appendChild(categoria);
    }

    const titulo = document.createElement("h3");
    titulo.textContent = craft.nome;
    titulos.appendChild(titulo);
    cabecalho.appendChild(titulos);

    if (craft.produz) {
        const produz = document.createElement("span");
        produz.className = "craft-produz";
        produz.textContent = `Produz ${formatarNumero(craft.produz)}`;
        cabecalho.appendChild(produz);
    }

    card.appendChild(cabecalho);

    const lista = document.createElement("ul");
    lista.className = "craft-materiais";

    Object.entries(craft.materiais).forEach(([material, quantidade]) => {
        const item = document.createElement("li");

        const nome = document.createElement("span");
        nome.textContent = material;

        // Material que também é um craft desta lista
        if (nomesDosCrafts.has(material.toLowerCase())) {
            const marca = document.createElement("em");
            marca.textContent = "craftável";
            nome.appendChild(marca);
        }

        const qtd = document.createElement("strong");
        qtd.textContent = formatarNumero(quantidade);

        item.append(nome, qtd);
        lista.appendChild(item);
    });

    card.appendChild(lista);

    if (craft.observacao) {
        const observacao = document.createElement("p");
        observacao.className = "craft-observacao";
        observacao.textContent = craft.observacao;
        card.appendChild(observacao);
    }

    return card;
}

function mostrarCrafts() {
    const lista = document.getElementById("listaCrafts");
    const vazio = document.getElementById("craftsVazio");
    if (!lista || !vazio) return;

    const texto = (document.getElementById("pesquisaCraft")?.value || "").trim().toLowerCase();
    const categoria = document.getElementById("filtroCategoriaCraft")?.value || "";

    const todos = craftsValidos();
    const nomesDosCrafts = new Set(todos.map(c => c.nome.toLowerCase()));

    const filtrados = todos.filter(craft => {
        if (categoria && craft.categoria !== categoria) return false;

        if (texto) {
            const alvo = [craft.nome, ...Object.keys(craft.materiais)].join(" ").toLowerCase();
            if (!alvo.includes(texto)) return false;
        }

        return true;
    });

    lista.innerHTML = "";
    filtrados.forEach(craft => lista.appendChild(criarCardCraft(craft, nomesDosCrafts)));

    vazio.textContent = todos.length === 0
        ? "Nenhum craft cadastrado. Adicione em assets/js/dados-crafts.js."
        : "Nenhum craft encontrado para essa busca.";
    vazio.classList.toggle("hidden", filtrados.length > 0);
}
