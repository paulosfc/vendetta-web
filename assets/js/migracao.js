/* =========================================================
   MIGRAÇÃO (uma vez só)

   Antes do banco de dados, as encomendas ficavam no localStorage
   e as fotos de perímetro no IndexedDB deste navegador. Se ainda
   existirem, mostra um aviso para enviá-las ao Supabase.

   Depende de: api.js, encomendas.js, perimetros.js
========================================================= */

const MIGRACAO = {
    chaveEncomendasLocais: "encomendasCraft",
    bancoPerimetrosLocal: "vendettaPerimetros",
    lojaPerimetrosLocal: "perimetros",
    chaveDispensada: "migracaoDispensada"
};

/* =========================================================
   LEITURA DOS DADOS ANTIGOS
========================================================= */

function lerEncomendasLocais() {
    try {
        const dados = JSON.parse(localStorage.getItem(MIGRACAO.chaveEncomendasLocais));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

// Abre o banco antigo SEM criá-lo caso não exista.
function abrirBancoPerimetrosLocal() {
    return new Promise(resolve => {
        if (!window.indexedDB) return resolve(null);

        const pedido = indexedDB.open(MIGRACAO.bancoPerimetrosLocal);
        let existia = true;

        pedido.onupgradeneeded = () => {
            existia = false; // o banco não existia: cancela a criação
            pedido.transaction.abort();
        };
        pedido.onsuccess = () => {
            const banco = pedido.result;

            if (!existia || !banco.objectStoreNames.contains(MIGRACAO.lojaPerimetrosLocal)) {
                banco.close();
                resolve(null);
                return;
            }

            resolve(banco);
        };
        pedido.onerror = () => {
            indexedDB.deleteDatabase(MIGRACAO.bancoPerimetrosLocal);
            resolve(null);
        };
    });
}

async function lerPerimetrosLocais() {
    const banco = await abrirBancoPerimetrosLocal();
    if (!banco) return [];

    return new Promise(resolve => {
        const pedido = banco
            .transaction(MIGRACAO.lojaPerimetrosLocal, "readonly")
            .objectStore(MIGRACAO.lojaPerimetrosLocal)
            .getAll();

        pedido.onsuccess = () => {
            banco.close();
            resolve(pedido.result || []);
        };
        pedido.onerror = () => {
            banco.close();
            resolve([]);
        };
    });
}

function apagarPerimetrosLocais() {
    return new Promise(resolve => {
        const pedido = indexedDB.deleteDatabase(MIGRACAO.bancoPerimetrosLocal);
        pedido.onsuccess = pedido.onerror = pedido.onblocked = () => resolve();
    });
}

/* =========================================================
   AVISO
========================================================= */

async function verificarMigracao() {
    if (!perfilUsuario.administrador) return; // só administrador pode enviar dados

    if (sessionStorage.getItem(MIGRACAO.chaveDispensada)) return;

    const qtdEncomendas = lerEncomendasLocais().length;
    const qtdFotos = (await lerPerimetrosLocais()).length;

    if (qtdEncomendas === 0 && qtdFotos === 0) return;

    const partes = [];
    if (qtdEncomendas) partes.push(`${qtdEncomendas} encomenda${qtdEncomendas > 1 ? "s" : ""}`);
    if (qtdFotos) partes.push(`${qtdFotos} foto${qtdFotos > 1 ? "s" : ""} de perímetro`);

    document.getElementById("avisoMigracaoTexto").textContent =
        `Há ${partes.join(" e ")} salva${qtdEncomendas + qtdFotos > 1 ? "s" : ""} só neste navegador. ` +
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

async function migrarEncomendas() {
    const locais = lerEncomendasLocais().filter(e => e && receitas[e.produto]);

    if (locais.length === 0) {
        localStorage.removeItem(MIGRACAO.chaveEncomendasLocais);
        return { enviadas: 0 };
    }

    await banco.inserir(TABELA_ENCOMENDAS, locais.map(linhaDeEncomendaLocal));
    localStorage.removeItem(MIGRACAO.chaveEncomendasLocais);

    return { enviadas: locais.length };
}

async function migrarPerimetros() {
    const locais = await lerPerimetrosLocais();
    if (locais.length === 0) return { enviadas: 0, repetidas: 0, falhas: 0 };

    const existentes = (await banco.listar(TABELA_PERIMETROS, "select=nome"))
        .map(p => String(p.nome).toLowerCase());

    const resultado = { enviadas: 0, repetidas: 0, falhas: 0 };

    for (const item of locais) {
        const nome = String(item.nome || "").trim();

        if (!nome || !(item.imagem instanceof Blob)) {
            resultado.falhas++;
            continue;
        }

        if (existentes.includes(nome.toLowerCase())) {
            resultado.repetidas++; // já existe no banco com esse nome
            continue;
        }

        const arquivo = new File([item.imagem], nome, { type: item.imagem.type || "image/jpeg" });
        const caminho = nomeArquivoSeguro(arquivo);
        let subiu = false;

        try {
            await armazenamento.enviar(SUPABASE_BUCKET_PERIMETROS, caminho, arquivo);
            subiu = true;
            await banco.inserir(TABELA_PERIMETROS, {
                nome: nome,
                arquivo: caminho,
                criado_em: item.criadoEm || new Date().toISOString()
            });
            existentes.push(nome.toLowerCase());
            resultado.enviadas++;
        } catch (erro) {
            console.error("Erro ao migrar perímetro:", nome, erro);
            if (subiu) armazenamento.remover(SUPABASE_BUCKET_PERIMETROS, [caminho]).catch(() => {});
            resultado.falhas++;
        }
    }

    // Só apaga os dados antigos se nada falhou
    if (resultado.falhas === 0) await apagarPerimetrosLocais();

    return resultado;
}

async function executarMigracao() {
    const botao = document.getElementById("btnMigrar");
    botao.disabled = true;
    botao.textContent = "Enviando...";

    const mensagens = [];
    let tudoCerto = true;

    try {
        const e = await migrarEncomendas();
        if (e.enviadas) mensagens.push(`${e.enviadas} encomenda(s) enviada(s).`);
    } catch (erro) {
        console.error("Erro ao migrar encomendas:", erro);
        mensagens.push(`Encomendas não enviadas: ${erro.message}`);
        tudoCerto = false;
    }

    try {
        const p = await migrarPerimetros();
        if (p.enviadas) mensagens.push(`${p.enviadas} foto(s) enviada(s).`);
        if (p.repetidas) mensagens.push(`${p.repetidas} foto(s) já existiam no banco e foram ignoradas.`);
        if (p.falhas) {
            mensagens.push(`${p.falhas} foto(s) não puderam ser enviadas (os dados antigos foram mantidos).`);
            tudoCerto = false;
        }
    } catch (erro) {
        console.error("Erro ao migrar perímetros:", erro);
        mensagens.push(`Fotos não enviadas: ${erro.message}`);
        tudoCerto = false;
    }

    botao.disabled = false;
    botao.textContent = "Enviar para o banco";

    await Promise.all([carregarEncomendas(), carregarPerimetros()]);

    if (tudoCerto) {
        document.getElementById("avisoMigracao").classList.add("hidden");
    }

    alert(mensagens.join("\n") || "Nada para enviar.");
}
