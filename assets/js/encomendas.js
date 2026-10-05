/* =========================================================
   ENCOMENDAS

   Depende de: dados.js (receitas, valoresPorProduto)
               utils.js (formatarDinheiro, formatarNumero, escaparHtml)
========================================================= */

const CHAVE_ENCOMENDAS = "encomendasCraft";
const STATUS_PENDENTE = "Pendente";
const STATUS_CONCLUIDA = "Concluída";

let encomendas = lerEncomendas();

/* =========================================================
   ARMAZENAMENTO
========================================================= */

function lerEncomendas() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_ENCOMENDAS));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function salvarEncomendas() {
    localStorage.setItem(CHAVE_ENCOMENDAS, JSON.stringify(encomendas));
}

function proximoIdEncomenda() {
    return encomendas.reduce((maior, e) => Math.max(maior, Number(e.id) || 0), 0) + 1;
}

function buscarEncomenda(id) {
    return encomendas.find(e => e.id === Number(id));
}

/* =========================================================
   PRODUTOS (selects)
========================================================= */

function nomeDoProduto(chave) {
    return receitas[chave] ? receitas[chave].nome : chave;
}

function preencherSelectProdutos(select, textoPadrao) {
    if (!select) return;

    const valorAtual = select.value;
    select.innerHTML = "";

    const padrao = document.createElement("option");
    padrao.value = "";
    padrao.textContent = textoPadrao;
    select.appendChild(padrao);

    Object.keys(receitas).forEach(chave => {
        const option = document.createElement("option");
        option.value = chave;
        option.textContent = receitas[chave].nome;
        select.appendChild(option);
    });

    // Mantém a seleção anterior quando ela ainda existe
    if (valorAtual && receitas[valorAtual]) {
        select.value = valorAtual;
    }
}

function carregarProdutosEncomenda() {
    preencherSelectProdutos(
        document.getElementById("encomendaProduto"),
        "Selecione um produto"
    );
}

function carregarFiltroProdutosEncomenda() {
    preencherSelectProdutos(
        document.getElementById("filtroProdutoEncomenda"),
        "Todos os produtos"
    );
}

/* =========================================================
   VALORES
========================================================= */

function calcularValorEncomenda(produto, tipo, quantidade) {
    const precos = valoresPorProduto[produto];
    const unitario = precos ? Number(precos[tipo]) : 0;

    if (!unitario || unitario <= 0) {
        return null;
    }

    return {
        unitario: unitario,
        total: unitario * Number(quantidade)
    };
}

function atualizarValorEncomenda() {
    const preview = document.getElementById("valorEncomendaPreview");
    if (!preview) return;

    const produto = document.getElementById("encomendaProduto").value;
    const tipo = document.getElementById("encomendaTipo").value;
    const quantidade = Number(document.getElementById("encomendaQuantidade").value);

    if (!produto) {
        preview.textContent = "Selecione um produto";
        return;
    }

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
        preview.textContent = "Informe uma quantidade válida";
        return;
    }

    const valor = calcularValorEncomenda(produto, tipo, quantidade);

    if (!valor) {
        preview.textContent = `Sem valor cadastrado para ${tipo}`;
        return;
    }

    preview.innerHTML = `
        Valor total: <strong>${formatarDinheiro(valor.total)}</strong><br>
        <small>${formatarDinheiro(valor.unitario)} × ${formatarNumero(quantidade)} (${escaparHtml(tipo)})</small>
    `;
}

/* =========================================================
   MODAL
========================================================= */

function abrirModalEncomenda(id) {
    const modal = document.getElementById("modalEncomenda");
    const form = document.getElementById("formEncomenda");
    if (!modal || !form) return;

    carregarProdutosEncomenda();
    form.reset();
    document.getElementById("encomendaId").value = "";
    document.getElementById("modalEncomendaTitulo").textContent = "Nova Encomenda";

    const encomenda = id !== undefined && id !== null ? buscarEncomenda(id) : null;

    if (encomenda) {
        document.getElementById("modalEncomendaTitulo").textContent = `Editar Encomenda #${formatarIdEncomenda(encomenda.id)}`;
        document.getElementById("encomendaId").value = encomenda.id;
        document.getElementById("encomendaProduto").value = encomenda.produto;
        document.getElementById("encomendaQuantidade").value = encomenda.quantidade;
        document.getElementById("encomendaTipo").value = encomenda.tipo;
        document.getElementById("encomendaCliente").value = encomenda.cliente || "";
        document.getElementById("encomendaObservacoes").value = encomenda.observacoes || "";
    }

    atualizarValorEncomenda();
    modal.classList.remove("hidden");
    document.getElementById("encomendaProduto").focus();
}

function fecharModalEncomenda() {
    const modal = document.getElementById("modalEncomenda");
    if (modal) modal.classList.add("hidden");
}

/* =========================================================
   SALVAR / ALTERAR / EXCLUIR
========================================================= */

function salvarEncomenda(event) {
    event.preventDefault();

    const id = document.getElementById("encomendaId").value;
    const produto = document.getElementById("encomendaProduto").value;
    const quantidade = Math.floor(Number(document.getElementById("encomendaQuantidade").value));
    const tipo = document.getElementById("encomendaTipo").value;
    const cliente = document.getElementById("encomendaCliente").value.trim();
    const observacoes = document.getElementById("encomendaObservacoes").value.trim();

    if (!produto || !receitas[produto]) {
        alert("Selecione um produto.");
        return;
    }

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
        alert("Digite uma quantidade válida.");
        return;
    }

    const existente = id ? buscarEncomenda(id) : null;

    if (existente) {
        Object.assign(existente, { produto, quantidade, tipo, cliente, observacoes });
    } else {
        encomendas.push({
            id: proximoIdEncomenda(),
            produto,
            quantidade,
            tipo,
            cliente,
            observacoes,
            status: STATUS_PENDENTE,
            criadaEm: new Date().toISOString(),
            concluidaEm: null
        });
    }

    salvarEncomendas();
    fecharModalEncomenda();
    mostrarEncomendas();
}

function alternarStatusEncomenda(id) {
    const encomenda = buscarEncomenda(id);
    if (!encomenda) return;

    if (encomenda.status === STATUS_CONCLUIDA) {
        encomenda.status = STATUS_PENDENTE;
        encomenda.concluidaEm = null;
    } else {
        encomenda.status = STATUS_CONCLUIDA;
        encomenda.concluidaEm = new Date().toISOString();
    }

    salvarEncomendas();
    mostrarEncomendas();
}

function excluirEncomenda(id) {
    const encomenda = buscarEncomenda(id);
    if (!encomenda) return;

    if (!confirm(`Deseja excluir a encomenda #${formatarIdEncomenda(encomenda.id)}?`)) {
        return;
    }

    encomendas = encomendas.filter(e => e.id !== encomenda.id);
    salvarEncomendas();
    mostrarEncomendas();
}

/* =========================================================
   LISTAGEM
========================================================= */

function formatarIdEncomenda(id) {
    return String(id).padStart(3, "0");
}

function formatarDataEncomenda(iso) {
    if (!iso) return "-";
    const data = new Date(iso);
    return Number.isNaN(data.getTime()) ? "-" : data.toLocaleDateString("pt-BR");
}

function filtrarEncomendas() {
    const texto = (document.getElementById("pesquisaEncomenda")?.value || "").trim().toLowerCase();
    const produto = document.getElementById("filtroProdutoEncomenda")?.value || "";
    const status = document.getElementById("filtroStatusEncomenda")?.value || "";

    return encomendas
        .filter(e => {
            if (produto && e.produto !== produto) return false;
            if (status && e.status !== status) return false;

            if (texto) {
                const alvo = `${nomeDoProduto(e.produto)} ${e.cliente || ""}`.toLowerCase();
                if (!alvo.includes(texto)) return false;
            }

            return true;
        })
        // Pendentes primeiro; dentro de cada grupo, as mais recentes antes
        .sort((a, b) => {
            if (a.status !== b.status) return a.status === STATUS_PENDENTE ? -1 : 1;
            return b.id - a.id;
        });
}

function atualizarEstatisticasEncomendas() {
    const pendentes = encomendas.filter(e => e.status === STATUS_PENDENTE).length;
    const valores = {
        totalEncomendas: encomendas.length,
        encomendasPendentes: pendentes,
        encomendasConcluidas: encomendas.length - pendentes
    };

    Object.entries(valores).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
}

function criarCardEncomenda(e) {
    const concluida = e.status === STATUS_CONCLUIDA;
    const valor = calcularValorEncomenda(e.produto, e.tipo, e.quantidade);

    const valorHtml = valor
        ? `<small>${formatarDinheiro(valor.unitario)} × ${formatarNumero(e.quantidade)}</small>
           <strong>${formatarDinheiro(valor.total)}</strong>`
        : `<small>Valor</small><strong>Sem valor cadastrado</strong>`;

    const observacoesHtml = e.observacoes
        ? `<div class="encomenda-observacoes">${escaparHtml(e.observacoes)}</div>`
        : "";

    const dataConclusaoHtml = concluida
        ? `<div class="encomenda-info-row"><span>Concluída em</span><span>${formatarDataEncomenda(e.concluidaEm)}</span></div>`
        : "";

    const card = document.createElement("article");
    card.className = "encomenda-card";
    card.innerHTML = `
        <div class="encomenda-card-header">
            <div>
                <span class="encomenda-id">#${formatarIdEncomenda(e.id)}</span>
                <h3>${escaparHtml(nomeDoProduto(e.produto))}</h3>
            </div>
            <span class="encomenda-status ${concluida ? "concluida" : "pendente"}">${escaparHtml(e.status)}</span>
        </div>

        <div class="encomenda-produto">
            <span>Quantidade</span>
            <strong>${formatarNumero(e.quantidade)}</strong>
        </div>

        <div class="encomenda-info">
            <div class="encomenda-info-row"><span>Cliente</span><span>${escaparHtml(e.cliente) || "Não informado"}</span></div>
            <div class="encomenda-info-row"><span>Tipo</span><span>${escaparHtml(e.tipo)}</span></div>
            <div class="encomenda-info-row"><span>Criada em</span><span>${formatarDataEncomenda(e.criadaEm)}</span></div>
            ${dataConclusaoHtml}
        </div>

        <div class="encomenda-valor">${valorHtml}</div>
        ${observacoesHtml}

        <div class="encomenda-actions">
            <button type="button" class="${concluida ? "btn-reabrir-encomenda" : "btn-concluir-encomenda"}" data-acao="status">
                ${concluida ? "Reabrir" : "Concluir"}
            </button>
            <button type="button" class="btn-editar-encomenda" data-acao="editar">Editar</button>
            <button type="button" class="btn-excluir-encomenda" data-acao="excluir">Excluir</button>
        </div>
    `;

    card.querySelector('[data-acao="status"]').addEventListener("click", () => alternarStatusEncomenda(e.id));
    card.querySelector('[data-acao="editar"]').addEventListener("click", () => abrirModalEncomenda(e.id));
    card.querySelector('[data-acao="excluir"]').addEventListener("click", () => excluirEncomenda(e.id));

    return card;
}

function mostrarEncomendas() {
    const lista = document.getElementById("listaEncomendas");
    const vazio = document.getElementById("encomendasVazio");

    atualizarEstatisticasEncomendas();

    if (!lista || !vazio) return;

    const filtradas = filtrarEncomendas();

    lista.innerHTML = "";
    filtradas.forEach(e => lista.appendChild(criarCardEncomenda(e)));

    vazio.classList.toggle("hidden", filtradas.length > 0);
}

/* =========================================================
   EVENTOS DO MODAL (clicar fora / Esc)
========================================================= */

(function () {
    const modal = document.getElementById("modalEncomenda");
    if (!modal) return;

    modal.addEventListener("mousedown", e => {
        if (e.target === modal) fecharModalEncomenda();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            fecharModalEncomenda();
        }
    });
})();
