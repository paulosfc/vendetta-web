/* Cadastro/listagem de receitas. NÃO é carregado em app.html (as páginas Receitas e
   Cadastrar existiam só no antigo calculadora.html). Reative junto com essas páginas. */
/* =========================================================
   ADICIONAR MATERIAL
========================================================= */
function adicionarMaterial() {
    const container = document.getElementById("materiaisCadastro");
    if (!container) {
        return;
    }
    const div = document.createElement("div");
    div.className =
        "material-row";
    div.innerHTML = `

        <input
            type="text"
            class="material-nome"
            placeholder="Nome do material"
        >

        <input
            type="number"
            class="material-quantidade"
            placeholder="Quantidade"
            min="1"
            value="1"
        >

        <button
            type="button"
            class="remove-material"
            onclick="removerMaterial(this)"
        >
            ×
        </button>

    `;
    container.appendChild(div);
}

/* =========================================================
   REMOVER MATERIAL
========================================================= */
function removerMaterial(botao) {
    if (botao &&
        botao.parentElement) {
        botao.parentElement.remove();
    }
}

/* =========================================================
   SALVAR RECEITA
========================================================= */
function salvarReceita() {
    const nome = document
        .getElementById("novoItem")
        .value
        .trim();
    if (!nome) {
        alert("Digite o nome do item.");
        return;
    }
    /*
    Verifica duplicidade
    */
    if (receitas[nome]) {
        alert(`A receita "${nome}" já existe.`);
        return;
    }
    /*
    Pega materiais
    */
    const linhas = document.querySelectorAll(".material-row");
    if (linhas.length === 0) {
        alert("Adicione pelo menos um material.");
        return;
    }
    const materiais = {};
    /*
    Percorre materiais
    */
    for (const linha of linhas) {
        const nomeMaterial = linha
            .querySelector(".material-nome")
            .value
            .trim();
        const quantidade = Number(linha
            .querySelector(".material-quantidade")
            .value);
        if (!nomeMaterial) {
            alert("Preencha o nome de todos os materiais.");
            return;
        }
        if (!quantidade ||
            quantidade <= 0) {
            alert("Digite uma quantidade válida.");
            return;
        }
        /*
        Se o mesmo material for
        cadastrado duas vezes,
        soma.
        */
        if (!materiais[nomeMaterial]) {
            materiais[nomeMaterial] =
                0;
        }
        materiais[nomeMaterial] +=
            quantidade;
    }
    /*
    Salva somente:

    nome
    materiais

    NÃO salva preços.
    */
    receitas[nome] = {
        nome: nome,
        materiais: materiais
    };
    salvarLocalStorage();
    /*
    Limpa formulário
    */
    document
        .getElementById("novoItem")
        .value = "";
    document
        .getElementById("materiaisCadastro")
        .innerHTML = "";
    /*
    Adiciona uma nova linha
    */
    adicionarMaterial();
    /*
    Atualiza
    */
    carregarItens();
    mostrarReceitas();
    alert(`Receita "${nome}" cadastrada com sucesso!`);
}

/* =========================================================
   MOSTRAR RECEITAS
========================================================= */
function mostrarReceitas() {
    const container = document.getElementById("listaReceitas");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    const nomes = Object.keys(receitas);
    if (nomes.length === 0) {
        container.innerHTML = `

            <div class="card">

                <p>
                    Nenhuma receita cadastrada.
                </p>

            </div>

        `;
        return;
    }
    /*
    Cria cards
    */
    for (const chave of nomes) {
        const receita = receitas[chave];
        const card = document.createElement("div");
        card.className =
            "recipe-card";
        let materiaisHTML = "";
        /*
        Materiais
        */
        for (const material in receita.materiais) {
            const quantidade = receita.materiais[material];
            const possuiReceita = Boolean(receitas[material]);
            materiaisHTML += `

                <div class="recipe-material">

                    <span>

                        ${material}

                        ${possuiReceita
                ? " 🔗"
                : ""}

                    </span>

                    <strong>

                        ${formatarNumero(quantidade)}

                    </strong>

                </div>

            `;
        }
        /*
        Card
        */
        card.innerHTML = `

            <h3>
                ${receita.nome}
            </h3>

            <div class="recipe-materials">

                ${materiaisHTML}

            </div>

            <button
                type="button"
                class="delete-recipe"
                onclick="excluirReceita('${escaparTexto(chave)}')"
            >
                Excluir receita
            </button>

        `;
        container.appendChild(card);
    }
}

/* =========================================================
   EXCLUIR RECEITA
========================================================= */
function excluirReceita(nome) {
    const confirmar = confirm(`Deseja excluir a receita "${nome}"?`);
    if (!confirmar) {
        return;
    }
    delete receitas[nome];
    salvarLocalStorage();
    carregarItens();
    mostrarReceitas();
    alert("Receita excluída.");
}
