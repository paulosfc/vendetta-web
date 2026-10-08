/* =========================================================
   ABA CRAFTS

   Os dados ficam em dados-crafts.js. Este arquivo desenha a
   tela e faz a conta de quantos materiais cada craft precisa,
   não precisa mexer aqui.

   Ao clicar num craft abre uma janela: a pessoa digita a
   quantidade desejada e o site mostra os materiais necessários.

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
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Calcular materiais de ${craft.nome}`);
    card.addEventListener("click", () => abrirCraft(craft));
    card.addEventListener("keydown", evento => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirCraft(craft);
        }
    });

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

    const dica = document.createElement("p");
    dica.className = "craft-dica";
    dica.textContent = "Clique para calcular a quantidade";
    card.appendChild(dica);

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

/* =========================================================
   CÁLCULO

   quantidade = unidades que a pessoa quer do item final.
   Cada craft produz "produz" unidades, então o número de crafts
   é a quantidade dividida por "produz", arredondada para CIMA.

   Material com o mesmo nome de outro craft é "craftável": além
   da lista direta, calculamos também tudo até a matéria-prima.
========================================================= */

const QUANTIDADE_MAXIMA_CRAFT = 1000000000;

const unidadesPorCraft = craft => Math.max(1, Number(craft.produz) || 1);

function mapaDeCrafts() {
    const mapa = new Map();

    craftsValidos().forEach(craft => {
        const chave = craft.nome.toLowerCase();
        if (!mapa.has(chave)) mapa.set(chave, craft);
    });

    return mapa;
}

// Ordem em que os crafts devem ser resolvidos: quem usa vem antes de quem
// é usado. Assim somamos toda a demanda de um item antes de arredondar.
// Se houver receitas que se referenciam em círculo, a volta é tratada
// como matéria-prima (evita laço infinito).
function ordenarCrafts(raiz, mapa) {
    const ordem = [];
    const visitados = new Set();
    const noCaminho = new Set();

    function visitar(craft) {
        visitados.add(craft);
        noCaminho.add(craft);

        Object.keys(craft.materiais).forEach(material => {
            const sub = mapa.get(material.toLowerCase());
            if (sub && !noCaminho.has(sub) && !visitados.has(sub)) visitar(sub);
        });

        noCaminho.delete(craft);
        ordem.push(craft);
    }

    visitar(raiz);
    return ordem.reverse();
}

function calcularMateriaisDoCraft(craft, quantidade) {
    const mapa = mapaDeCrafts();
    const ordem = ordenarCrafts(craft, mapa);
    const posicao = new Map(ordem.map((c, i) => [c, i]));

    const demanda = new Map([[craft, quantidade]]);
    const materiaPrima = new Map();
    const intermediarios = [];
    let resumo = null;

    ordem.forEach(atual => {
        const precisa = demanda.get(atual) || 0;
        const crafts = Math.ceil(precisa / unidadesPorCraft(atual));
        const produzidas = crafts * unidadesPorCraft(atual);

        if (atual === craft) {
            resumo = { crafts, produzidas, sobra: produzidas - precisa };
        } else {
            intermediarios.push({ nome: atual.nome, precisa, crafts, produzidas });
        }

        Object.entries(atual.materiais).forEach(([material, porCraft]) => {
            const necessario = Number(porCraft) * crafts;
            const sub = mapa.get(material.toLowerCase());

            // só expande se o sub-craft vem DEPOIS na ordem (não é volta de ciclo)
            if (sub && posicao.has(sub) && posicao.get(sub) > posicao.get(atual)) {
                demanda.set(sub, (demanda.get(sub) || 0) + necessario);
            } else {
                materiaPrima.set(material, (materiaPrima.get(material) || 0) + necessario);
            }
        });
    });

    // Lista direta: o que ESTE craft pede, já multiplicado
    const nomesDosCrafts = mapa;
    const diretos = Object.entries(craft.materiais).map(([nome, porCraft]) => ({
        nome,
        quantidade: Number(porCraft) * resumo.crafts,
        craftavel: nomesDosCrafts.has(nome.toLowerCase())
    }));

    return {
        ...resumo,
        diretos,
        intermediarios,
        totais: [...materiaPrima].map(([nome, quantidade]) => ({ nome, quantidade }))
    };
}

/* =========================================================
   JANELA DO CRAFT
========================================================= */

let craftAberto = null;

function criarElemento(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
}

function criarLinhaCraft(nome, valor, craftavel) {
    const item = criarElemento("li");
    const esquerda = criarElemento("span", "", nome);

    if (craftavel) esquerda.appendChild(criarElemento("em", "", "craftável"));

    item.append(esquerda, criarElemento("strong", "", valor));
    return item;
}

function criarSecaoCraft(titulo, linhas) {
    const secao = criarElemento("div", "craft-secao");
    secao.appendChild(criarElemento("h4", "craft-secao-titulo", titulo));

    const lista = criarElemento("ul", "craft-materiais");
    linhas.forEach(linha => lista.appendChild(linha));
    secao.appendChild(lista);

    return secao;
}

function abrirCraft(craft) {
    const modal = document.getElementById("craftModal");
    if (!modal) return;

    craftAberto = craft;

    const categoria = document.getElementById("craftModalCategoria");
    categoria.textContent = craft.categoria || "";
    categoria.classList.toggle("hidden", !craft.categoria);

    document.getElementById("craftModalTitulo").textContent = craft.nome;
    document.getElementById("craftModalProduz").textContent =
        `Cada craft produz ${formatarNumero(unidadesPorCraft(craft))} unidade${unidadesPorCraft(craft) > 1 ? "s" : ""}.`;

    const campo = document.getElementById("craftQuantidade");
    campo.value = unidadesPorCraft(craft);

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    calcularCraftSelecionado();
    campo.focus();
    campo.select();
}

function fecharCraft(evento) {
    // Clique no fundo escuro fecha; clique dentro da janela não
    if (evento && evento.target !== evento.currentTarget) return;

    const modal = document.getElementById("craftModal");
    if (modal) modal.classList.add("hidden");

    document.body.style.overflow = "";
    craftAberto = null;
}

function calcularCraftSelecionado() {
    const resultado = document.getElementById("craftResultado");
    if (!resultado || !craftAberto) return;

    const quantidade = Number(document.getElementById("craftQuantidade").value);
    resultado.innerHTML = "";

    const valida = Number.isInteger(quantidade) && quantidade >= 1 && quantidade <= QUANTIDADE_MAXIMA_CRAFT;

    if (!valida) {
        resultado.appendChild(criarElemento(
            "p", "craft-aviso",
            `Digite uma quantidade válida (número inteiro de 1 a ${formatarNumero(QUANTIDADE_MAXIMA_CRAFT)}).`
        ));
        return;
    }

    const calculo = calcularMateriaisDoCraft(craftAberto, quantidade);

    // Resumo
    const resumo = criarElemento("div", "craft-resumo");
    [
        ["Crafts necessários", formatarNumero(calculo.crafts)],
        ["Unidades produzidas", formatarNumero(calculo.produzidas)],
        ["Sobra", formatarNumero(calculo.sobra)]
    ].forEach(([rotulo, valor]) => {
        const caixa = criarElemento("div", "craft-resumo-item");
        caixa.append(criarElemento("span", "", rotulo), criarElemento("strong", "", valor));
        resumo.appendChild(caixa);
    });
    resultado.appendChild(resumo);

    // Materiais que este craft pede
    resultado.appendChild(criarSecaoCraft(
        "Materiais necessários",
        calculo.diretos.map(m => criarLinhaCraft(m.nome, formatarNumero(m.quantidade), m.craftavel))
    ));

    // Só mostra o detalhamento quando há algo craftável dentro
    if (calculo.intermediarios.length > 0) {
        resultado.appendChild(criarSecaoCraft(
            "Crafts intermediários (produza antes)",
            calculo.intermediarios.map(i => criarLinhaCraft(
                i.nome,
                `${formatarNumero(i.crafts)} craft${i.crafts > 1 ? "s" : ""} (gera ${formatarNumero(i.produzidas)})`
            ))
        ));

        resultado.appendChild(criarSecaoCraft(
            "Total em matérias-primas",
            calculo.totais.map(m => criarLinhaCraft(m.nome, formatarNumero(m.quantidade)))
        ));
    }
}

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") fecharCraft();
});
