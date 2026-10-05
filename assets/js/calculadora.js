/* =========================================================
   CARREGAR ITENS
========================================================= */
function carregarItens() {
    const select = document.getElementById("item");
    if (!select) {
        return;
    }
    select.innerHTML = `

        <option value="">
            Selecione um item
        </option>

    `;
    for (const chave in receitas) {
        const option = document.createElement("option");
        option.value =
            chave;
        option.textContent =
            receitas[chave].nome;
        select.appendChild(option);
    }
}

/* =========================================================
   CALCULAR CRAFT
========================================================= */
function calcularCraft() {
    const itemElement = document.getElementById("item");
    const quantidadeElement = document.getElementById("quantity");
    if (!itemElement || !quantidadeElement) {
        console.error("Campo de item ou quantidade não encontrado.");
        return;
    }
    const item = itemElement.value;
    const quantidadeDesejada = Number(quantidadeElement.value);
    if (!item) {
        alert("Selecione um item.");
        return;
    }
    if (!Number.isFinite(quantidadeDesejada) ||
        quantidadeDesejada <= 0) {
        alert("Digite uma quantidade válida.");
        return;
    }
    const receita = receitas[item];
    if (!receita) {
        alert("A receita desse item não foi encontrada.");
        return;
    }
    // PRODUÇÃO POR CRAFT
    const quantidadePorCraft = Number(receita.produz) || 1;
    // CRAFTS NECESSÁRIOS
    // Exemplo:
    // 500 munições
    // 250 por craft
    // 500 / 250 = 2 crafts
    const craftsNecessarios = Math.ceil(quantidadeDesejada /
        quantidadePorCraft);
    // OBJETOS DO CÁLCULO
    const materiasPrimas = {};
    const intermediarios = [];
    // IMPORTANTE
    // Aqui passamos os CRAFTS diretamente.
    // Não passamos novamente a quantidade
    // desejada para não dividir por 250 duas vezes.
    calcularMateriaisDiretos(item, craftsNecessarios, materiasPrimas, intermediarios);
    // MOSTRAR RESULTADO
    mostrarResultadoCompleto(item, quantidadeDesejada, craftsNecessarios, quantidadePorCraft, intermediarios, materiasPrimas);
    // VALORES
    mostrarValores(item, quantidadeDesejada);
}

/* =========================================================
   CALCULAR MATERIAIS
========================================================= */
function calcularMateriaisDiretos(item, craftsNecessarios, materiasPrimas, intermediarios) {
    const receita = receitas[item];
    if (!receita) {
        console.error("Receita não encontrada:", item);
        return;
    }
    // GARANTE QUE CRAFTS É UM NÚMERO
    craftsNecessarios =
        Number(craftsNecessarios) || 0;
    if (craftsNecessarios <= 0) {
        return;
    }
    // PERCORRE OS MATERIAIS
    for (const material in receita.materiais) {
        const quantidadePorCraft = Number(receita.materiais[material]) || 0;
        // MATERIAL TOTAL
        // material por craft
        // ×
        // crafts necessários
        const quantidadeTotal = quantidadePorCraft *
            craftsNecessarios;
        // VERIFICA SE É INTERMEDIÁRIO
        const receitaMaterial = encontrarReceita(material);
        if (receitaMaterial) {
            /*
            O material precisa de uma receita.

            Exemplo:

            Munição precisa de:

            250 Estojos × 2 crafts
            =
            500 Estojos

            Então mandamos 500 para
            adicionarIntermediario().
            */
            adicionarIntermediario(receitaMaterial.chave, quantidadeTotal, materiasPrimas, intermediarios);
        }
        else {
            // MATÉRIA-PRIMA
            adicionarMateriaPrima(material, quantidadeTotal, materiasPrimas);
        }
    }
}

/* =========================================================
   ADICIONAR INTERMEDIÁRIO
========================================================= */
function adicionarIntermediario(nome, quantidadeNecessaria, materiasPrimas, intermediarios) {
    // ENCONTRA A RECEITA
    const encontrado = encontrarReceita(nome);
    if (!encontrado) {
        console.error("Intermediário não encontrado:", nome);
        return;
    }
    const chave = encontrado.chave;
    const receita = encontrado.receita;
    // QUANTIDADE NECESSÁRIA
    quantidadeNecessaria =
        Number(quantidadeNecessaria) || 0;
    if (quantidadeNecessaria <= 0) {
        return;
    }
    // PRODUÇÃO DO INTERMEDIÁRIO
    const produzPorCraft = Number(receita.produz) || 1;
    // CRAFTS NECESSÁRIOS DO INTERMEDIÁRIO
    // Exemplo:
    // Precisa de 500 estojos.
    // Estojo produz 250.
    // 500 / 250 = 2 crafts.
    const craftsNecessarios = Math.ceil(quantidadeNecessaria /
        produzPorCraft);
    // PROCURA INTERMEDIÁRIO EXISTENTE
    let intermediario = intermediarios.find(item => item.chave === chave);
    // CRIA INTERMEDIÁRIO
    if (!intermediario) {
        intermediario = {
            chave: chave,
            nome: receita.nome || nome,
            quantidade: 0,
            crafts: 0,
            produz: produzPorCraft,
            materiais: {}
        };
        intermediarios.push(intermediario);
    }
    // ACUMULA
    intermediario.quantidade +=
        quantidadeNecessaria;
    intermediario.crafts +=
        craftsNecessarios;
    // CALCULA OS MATERIAIS DO INTERMEDIÁRIO
    for (const material in receita.materiais) {
        const quantidadePorCraft = Number(receita.materiais[material]) || 0;
        // AQUI ESTÁ A REGRA IMPORTANTE
        // MATERIAL × CRAFTS DO INTERMEDIÁRIO
        const quantidadeTotal = quantidadePorCraft *
            craftsNecessarios;
        // GUARDA PARA EXIBIÇÃO
        if (!intermediario.materiais[material]) {
            intermediario.materiais[material] = {
                quantidade: 0,
                quantidadePorCraft: quantidadePorCraft,
                crafts: 0
            };
        }
        intermediario.materiais[material].quantidade +=
            quantidadeTotal;
        intermediario.materiais[material].crafts +=
            craftsNecessarios;
        // VERIFICA SE O MATERIAL É INTERMEDIÁRIO
        const receitaMaterial = encontrarReceita(material);
        if (receitaMaterial) {
            /*
            Exemplo:

            Estojo precisa de outro produto.

            Calculamos a quantidade necessária
            e deixamos a função calcular os
            crafts desse novo intermediário.
            */
            adicionarIntermediario(receitaMaterial.chave, quantidadeTotal, materiasPrimas, intermediarios);
        }
        else {
            // MATÉRIA-PRIMA
            adicionarMateriaPrima(material, quantidadeTotal, materiasPrimas);
        }
    }
}

function encontrarReceita(nomeProduto) {
    if (!nomeProduto) {
        return null;
    }
    // Primeiro tenta encontrar pela chave
    if (receitas[nomeProduto]) {
        return {
            chave: nomeProduto,
            receita: receitas[nomeProduto]
        };
    }
    // Depois procura pelo campo "nome"
    for (const chave in receitas) {
        const receita = receitas[chave];
        if (receita.nome &&
            receita.nome.trim().toLowerCase() ===
                nomeProduto.trim().toLowerCase()) {
            return {
                chave: chave,
                receita: receita
            };
        }
    }
    return null;
}

/* =========================================================
   ADICIONAR MATÉRIA-PRIMA
========================================================= */
function adicionarMateriaPrima(nome, quantidade, materiasPrimas) {
    if (!materiasPrimas[nome]) {
        materiasPrimas[nome] = 0;
    }
    /*
    Aqui está a soma dos materiais.

    Se o mesmo material aparecer em vários
    lugares da árvore, ele será acumulado.
    */
    materiasPrimas[nome] +=
        quantidade;
}

/* =========================================================
   MOSTRAR RESULTADO
========================================================= */
function mostrarResultadoCompleto(item, quantidadeDesejada, craftsNecessarios, quantidadePorCraft, intermediarios, materiasPrimas) {
    const resultado = document.getElementById("resultado");
    const titulo = document.getElementById("resultadoTitulo");
    const lista = document.getElementById("listaMateriais");
    const listaTotalMateriais = document.getElementById("listaTotalMateriais");
    const totalMateriaisContainer = document.getElementById("totalMateriaisContainer");
    if (!resultado || !titulo || !lista) {
        console.error("Elementos do resultado não encontrados.");
        return;
    }
    // LIMPA RESULTADO ANTERIOR
    lista.innerHTML = "";
    if (listaTotalMateriais) {
        listaTotalMateriais.innerHTML = "";
    }
    // INFORMAÇÕES PRINCIPAIS
    titulo.innerHTML = `

        Quantidade desejada:
        ${formatarNumero(quantidadeDesejada)}

        <br>

        <span class="crafts-info">

            Produção por craft:
            ${formatarNumero(quantidadePorCraft)}

            <br>

            Crafts necessários:
            ${formatarNumero(craftsNecessarios)}

            <br>

            Produção final:
            ${formatarNumero(craftsNecessarios *
        quantidadePorCraft)}

        </span>

    `;
    // 1 — MATERIAIS DIRETOS
    const tituloDiretos = document.createElement("div");
    tituloDiretos.className =
        "resultado-subtitulo";
    tituloDiretos.innerHTML = `
        📦 Materiais Diretos
        (${receitas[item].nome})
    `;
    lista.appendChild(tituloDiretos);
    // PERCORRE OS MATERIAIS DIRETOS
    const materiaisDiretos = receitas[item].materiais || {};
    for (const material in materiaisDiretos) {
        const quantidadePorCraftMaterial = Number(materiaisDiretos[material]) || 0;
        /*
        MATERIAL × CRAFTS
        */
        const quantidadeTotal = quantidadePorCraftMaterial *
            craftsNecessarios;
        adicionarLinhaResultado(lista, material, quantidadeTotal, quantidadePorCraftMaterial, craftsNecessarios);
    }
    // 2 — INTERMEDIÁRIOS
    intermediarios.forEach(intermediario => {
        const tituloIntermediario = document.createElement("div");
        tituloIntermediario.className =
            "resultado-subtitulo intermediario";
        tituloIntermediario.innerHTML = `

                🔧 Intermediário —
                ${intermediario.nome}

                ×
                ${formatarNumero(intermediario.quantidade)}

                <span class="crafts-info">

                    (
                    ${formatarNumero(intermediario.crafts)}
                    crafts)

                </span>

            `;
        lista.appendChild(tituloIntermediario);
        // MATERIAIS DO INTERMEDIÁRIO
        for (const material in intermediario.materiais) {
            const dados = intermediario.materiais[material];
            adicionarLinhaResultado(lista, material, dados.quantidade, dados.quantidadePorCraft, dados.crafts);
        }
    });
    // 3 — TOTAL DAS MATÉRIAS-PRIMAS
    if (listaTotalMateriais &&
        materiasPrimas) {
        for (const material in materiasPrimas) {
            const quantidade = Number(materiasPrimas[material]) || 0;
            const linha = document.createElement("div");
            linha.className =
                "total-material-linha";
            linha.innerHTML = `

                <span>
                    • ${material}:
                </span>

                <strong>
                    ${formatarNumero(quantidade)}
                </strong>

            `;
            listaTotalMateriais.appendChild(linha);
        }
    }
    // MOSTRA TOTAL
    if (totalMateriaisContainer) {
        totalMateriaisContainer.classList.remove("hidden");
    }
    // MOSTRA RESULTADO
    resultado.classList.remove("hidden");
    resultado.scrollIntoView({
        behavior: "smooth"
    });
}

/* =========================================================
   LINHA DO RESULTADO
========================================================= */
function adicionarLinhaResultado(container, nome, quantidadeTotal, quantidadePorCraft, quantidadeCraft) {
    const div = document.createElement("div");
    div.className =
        "resultado-linha";
    div.innerHTML = `

        <span>

            • ${nome}:

            <strong>
                ${formatarNumero(quantidadeTotal)}
            </strong>

            <span class="formula">

                (
                ${formatarNumero(quantidadePorCraft)}

                ×

                ${formatarNumero(quantidadeCraft)}
                )

            </span>

        </span>

    `;
    container.appendChild(div);
}

/* =========================================================
   CALCULAR VALORES
========================================================= */
function calcularValores(item, quantidade) {
    /*
    Procura o preço pelo código do produto.

    Não procura dentro da receita.
    */
    const precos = valoresPorProduto[item];
    /*
    Produto sem preço
    */
    if (!precos) {
        return [];
    }
    const resultado = [];
    /*
    CNPJ
    */
    if (Number(precos.CNPJ) > 0) {
        resultado.push({
            nome: "CNPJ",
            valorUnitario: Number(precos.CNPJ),
            quantidade: quantidade,
            valorTotal: Number(precos.CNPJ) *
                quantidade
        });
    }
    /*
    CPF
    */
    if (Number(precos.CPF) > 0) {
        resultado.push({
            nome: "CPF",
            valorUnitario: Number(precos.CPF),
            quantidade: quantidade,
            valorTotal: Number(precos.CPF) *
                quantidade
        });
    }
    /*
    PARCERIA
    */
    if (Number(precos.Parceria) > 0) {
        resultado.push({
            nome: "Parceria",
            valorUnitario: Number(precos.Parceria),
            quantidade: quantidade,
            valorTotal: Number(precos.Parceria) *
                quantidade
        });
    }
    /*
    ALIADO
    */
    if (Number(precos.Aliado) > 0) {
        resultado.push({
            nome: "Aliado",
            valorUnitario: Number(precos.Aliado),
            quantidade: quantidade,
            valorTotal: Number(precos.Aliado) *
                quantidade
        });
    }
    return resultado;
}

/* =========================================================
   MOSTRAR VALORES
========================================================= */
function mostrarValores(item, quantidade) {
    const container = document.getElementById("resultadoValores");
    const lista = document.getElementById("listaValores");
    if (!container ||
        !lista) {
        return;
    }
    lista.innerHTML = "";
    const resultado = calcularValores(item, quantidade);
    /*
    Se não houver preço,
    não mostra a seção.
    */
    if (resultado.length === 0) {
        container.classList.add("hidden");
        return;
    }
    /*
    Mostra preços
    */
    resultado.forEach(dados => {
        const div = document.createElement("div");
        div.className =
            "valor-linha";
        div.innerHTML = `

                <span>

                    <strong>
                        ${dados.nome}:
                    </strong>

                    ${formatarDinheiro(dados.valorTotal)}

                    <small>

                        (
                        ${formatarDinheiro(dados.valorUnitario)}

                        ×

                        ${formatarNumero(dados.quantidade)}
                        )

                    </small>

                </span>

            `;
        lista.appendChild(div);
    });
    container.classList.remove("hidden");
}

/* =========================================================
   LIMPAR CÁLCULO
========================================================= */
function limparCalculo() {
    const item = document.getElementById("item");
    const quantity = document.getElementById("quantity");
    const resultado = document.getElementById("resultado");
    const resultadoValores = document.getElementById("resultadoValores");
    const listaMateriais = document.getElementById("listaMateriais");
    const listaTotalMateriais = document.getElementById("listaTotalMateriais");
    const listaValores = document.getElementById("listaValores");
    if (item) {
        item.value = "";
    }
    if (quantity) {
        quantity.value = 1;
    }
    if (resultado) {
        resultado.classList.add("hidden");
    }
    if (resultadoValores) {
        resultadoValores.classList.add("hidden");
    }
    if (listaMateriais) {
        listaMateriais.innerHTML = "";
    }
    if (listaTotalMateriais) {
        listaTotalMateriais.innerHTML = "";
    }
    if (listaValores) {
        listaValores.innerHTML = "";
    }
}
