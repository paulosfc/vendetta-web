/* =========================================================
   MIGRAÇÃO DE ENCOMENDAS (uma vez só)

   Antes do banco de dados, as encomendas ficavam no localStorage
   deste navegador. Se ainda existirem, mostra um aviso para
   enviá-las ao Supabase.

   Depende de: api.js (banco), encomendas.js
========================================================= */

const MIGRACAO = {
    chaveEncomendasLocais: "encomendasCraft",
    chaveDispensada: "migracaoDispensada"
};

function lerEncomendasLocais() {
    try {
        const dados = JSON.parse(localStorage.getItem(MIGRACAO.chaveEncomendasLocais));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

/* =========================================================
   AVISO
========================================================= */

function verificarMigracao() {
    if (!perfilUsuario.podeEditar) return; // só quem pode editar envia dados
    if (sessionStorage.getItem(MIGRACAO.chaveDispensada)) return;

    const quantidade = lerEncomendasLocais().length;
    if (quantidade === 0) return;

    document.getElementById("avisoMigracaoTexto").textContent =
        `Há ${quantidade} encomenda${quantidade > 1 ? "s" : ""} salva${quantidade > 1 ? "s" : ""} só neste navegador. ` +
        "Envie para o banco de dados para ver tudo em qualquer aparelho.";
    document.getElementById("avisoMigracao").classList.remove("hidden");
}

function dispensarMigracao() {
    sessionStorage.setItem(MIGRACAO.chaveDispensada, "1");
    document.getElementById("avisoMigracao").classList.add("hidden");
}

/* =========================================================
   ENVIO
========================================================= */

function linhaDeEncomendaLocal(e) {
    const concluida = e.status === STATUS_CONCLUIDA;

    return {
        produto: e.produto,
        quantidade: Math.max(1, Math.floor(Number(e.quantidade) || 1)),
        tipo: e.tipo || "CNPJ",
        cliente: e.cliente || "",
        observacoes: e.observacoes || "",
        status: concluida ? STATUS_CONCLUIDA : STATUS_PENDENTE,
        criada_em: e.criadaEm || new Date().toISOString(),
        concluida_em: concluida ? (e.concluidaEm || null) : null
    };
}

async function executarMigracao() {
    const botao = document.getElementById("btnMigrar");
    botao.disabled = true;
    botao.textContent = "Enviando...";

    // Ignora encomendas de produtos que não existem mais na lista
    const locais = lerEncomendasLocais().filter(e => e && receitas[e.produto]);

    try {
        if (locais.length > 0) {
            await banco.inserir(TABELA_ENCOMENDAS, locais.map(linhaDeEncomendaLocal));
        }

        localStorage.removeItem(MIGRACAO.chaveEncomendasLocais);
        document.getElementById("avisoMigracao").classList.add("hidden");
        await carregarEncomendas();

        alert(`${locais.length} encomenda(s) enviada(s).`);
    } catch (erro) {
        console.error("Erro ao migrar encomendas:", erro);
        alert(`Encomendas não enviadas (os dados antigos foram mantidos): ${erro.message}`);
    } finally {
        botao.disabled = false;
        botao.textContent = "Enviar para o banco";
    }
}
