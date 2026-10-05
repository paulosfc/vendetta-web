/* =========================================================
   PERÍMETROS

   Guarda as fotos no IndexedDB do navegador (comporta imagens
   grandes, ao contrário do localStorage, que tem ~5 MB).

   Depende de: utils.js (escaparHtml não é necessário aqui,
   os textos são inseridos com textContent)
========================================================= */

const PERIMETROS_DB = "vendettaPerimetros";
const PERIMETROS_STORE = "perimetros";
const PERIMETROS_TAMANHO_MAXIMO = 15 * 1024 * 1024; // 15 MB

let perimetros = [];
let perimetroUrlAtual = null;

/* =========================================================
   BANCO (IndexedDB)
========================================================= */

function abrirBancoPerimetros() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error("IndexedDB indisponível"));
            return;
        }

        const pedido = indexedDB.open(PERIMETROS_DB, 1);

        pedido.onupgradeneeded = () => {
            pedido.result.createObjectStore(PERIMETROS_STORE, {
                keyPath: "id",
                autoIncrement: true
            });
        };
        pedido.onsuccess = () => resolve(pedido.result);
        pedido.onerror = () => reject(pedido.error);
    });
}

async function operacaoPerimetros(modo, operacao) {
    const banco = await abrirBancoPerimetros();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(PERIMETROS_STORE, modo);
        const pedido = operacao(transacao.objectStore(PERIMETROS_STORE));

        transacao.oncomplete = () => {
            banco.close();
            resolve(pedido ? pedido.result : undefined);
        };
        transacao.onerror = () => {
            banco.close();
            reject(transacao.error);
        };
        transacao.onabort = () => {
            banco.close();
            reject(transacao.error);
        };
    });
}

const listarPerimetrosNoBanco = () => operacaoPerimetros("readonly", loja => loja.getAll());
const gravarPerimetroNoBanco = perimetro => operacaoPerimetros("readwrite", loja => loja.put(perimetro));
const excluirPerimetroNoBanco = id => operacaoPerimetros("readwrite", loja => loja.delete(id));

/* =========================================================
   LISTA / SELECT
========================================================= */

async function carregarPerimetros(idParaSelecionar) {
    const select = document.getElementById("perimetroSelect");
    if (!select) return;

    try {
        perimetros = await listarPerimetrosNoBanco();
    } catch (erro) {
        console.error("Erro ao carregar perímetros:", erro);
        perimetros = [];
    }

    perimetros.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { numeric: true }));

    const selecionado = idParaSelecionar !== undefined ? String(idParaSelecionar) : select.value;
    select.innerHTML = "";

    const padrao = document.createElement("option");
    padrao.value = "";
    padrao.textContent = "Selecione um perímetro";
    select.appendChild(padrao);

    perimetros.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
    });

    if (selecionado && perimetros.some(p => String(p.id) === selecionado)) {
        select.value = selecionado;
    }

    mostrarPerimetro();
}

function perimetroSelecionado() {
    const id = document.getElementById("perimetroSelect").value;
    return perimetros.find(p => String(p.id) === id) || null;
}

/* =========================================================
   VISUALIZAR
========================================================= */

function liberarUrlPerimetro() {
    if (perimetroUrlAtual) {
        URL.revokeObjectURL(perimetroUrlAtual);
        perimetroUrlAtual = null;
    }
}

function mostrarPerimetro() {
    const viewer = document.getElementById("perimetroViewer");
    const vazio = document.getElementById("perimetroVazio");
    const imagem = document.getElementById("perimetroImagem");
    if (!viewer || !vazio || !imagem) return;

    const perimetro = perimetroSelecionado();

    liberarUrlPerimetro();

    if (!perimetro) {
        imagem.removeAttribute("src");
        viewer.classList.add("hidden");
        vazio.classList.remove("hidden");
        vazio.textContent = perimetros.length === 0
            ? "Nenhum perímetro cadastrado ainda. Adicione uma foto abaixo."
            : "Escolha um perímetro na lista para ver a foto.";
        return;
    }

    perimetroUrlAtual = URL.createObjectURL(perimetro.imagem);
    imagem.src = perimetroUrlAtual;
    imagem.alt = perimetro.nome;

    document.getElementById("perimetroNome").textContent = perimetro.nome;
    document.getElementById("perimetroData").textContent =
        "Adicionado em " + new Date(perimetro.criadoEm).toLocaleDateString("pt-BR");

    vazio.classList.add("hidden");
    viewer.classList.remove("hidden");
}

function abrirImagemPerimetro() {
    const lightbox = document.getElementById("perimetroLightbox");
    const imagem = document.getElementById("perimetroImagem");
    if (!lightbox || !imagem.src) return;

    document.getElementById("perimetroLightboxImg").src = imagem.src;
    document.getElementById("perimetroLightboxImg").alt = imagem.alt;
    lightbox.classList.remove("hidden");
}

function fecharImagemPerimetro() {
    const lightbox = document.getElementById("perimetroLightbox");
    if (lightbox) lightbox.classList.add("hidden");
}

/* =========================================================
   ADICIONAR
========================================================= */

function aoEscolherFotoPerimetro() {
    const entrada = document.getElementById("perimetroArquivo");
    const nomeArquivo = document.getElementById("perimetroArquivoNome");
    const preview = document.getElementById("perimetroPreview");
    const arquivo = entrada.files[0];

    if (preview.src) URL.revokeObjectURL(preview.src);

    if (!arquivo) {
        nomeArquivo.textContent = "Nenhum arquivo selecionado";
        preview.removeAttribute("src");
        preview.classList.add("hidden");
        return;
    }

    nomeArquivo.textContent = arquivo.name;
    preview.src = URL.createObjectURL(arquivo);
    preview.classList.remove("hidden");
}

function limparFormularioPerimetro() {
    document.getElementById("formPerimetro").reset();
    aoEscolherFotoPerimetro();
}

async function salvarPerimetro(evento) {
    evento.preventDefault();

    const campoNome = document.getElementById("perimetroNovoNome");
    const arquivo = document.getElementById("perimetroArquivo").files[0];
    const botao = document.getElementById("btnSalvarPerimetro");

    if (!arquivo) {
        alert("Escolha uma foto.");
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        alert("O arquivo escolhido não é uma imagem.");
        return;
    }

    if (arquivo.size > PERIMETROS_TAMANHO_MAXIMO) {
        alert("A foto é muito grande. O limite é de 15 MB.");
        return;
    }

    // Sem nome digitado, usa o nome do arquivo (sem a extensão)
    const nome = campoNome.value.trim() || arquivo.name.replace(/\.[^.]+$/, "");

    if (perimetros.some(p => p.nome.toLowerCase() === nome.toLowerCase())) {
        alert(`Já existe um perímetro chamado "${nome}".`);
        return;
    }

    botao.disabled = true;

    try {
        const id = await gravarPerimetroNoBanco({
            nome: nome,
            imagem: arquivo,
            criadoEm: new Date().toISOString()
        });

        limparFormularioPerimetro();
        await carregarPerimetros(id);
        document.getElementById("perimetroViewer").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (erro) {
        console.error("Erro ao salvar perímetro:", erro);
        alert("Não foi possível salvar a foto neste navegador.");
    } finally {
        botao.disabled = false;
    }
}

/* =========================================================
   RENOMEAR / EXCLUIR
========================================================= */

async function renomearPerimetro() {
    const perimetro = perimetroSelecionado();
    if (!perimetro) return;

    const resposta = prompt("Novo nome do perímetro:", perimetro.nome);
    if (resposta === null) return;

    const nome = resposta.trim();

    if (!nome) {
        alert("Digite um nome.");
        return;
    }

    const repetido = perimetros.some(
        p => p.id !== perimetro.id && p.nome.toLowerCase() === nome.toLowerCase()
    );

    if (repetido) {
        alert(`Já existe um perímetro chamado "${nome}".`);
        return;
    }

    try {
        await gravarPerimetroNoBanco({ ...perimetro, nome: nome });
        await carregarPerimetros();
    } catch (erro) {
        console.error("Erro ao renomear perímetro:", erro);
        alert("Não foi possível renomear.");
    }
}

async function excluirPerimetro() {
    const perimetro = perimetroSelecionado();
    if (!perimetro) return;

    if (!confirm(`Deseja excluir o perímetro "${perimetro.nome}"?`)) return;

    try {
        await excluirPerimetroNoBanco(perimetro.id);
        document.getElementById("perimetroSelect").value = "";
        await carregarPerimetros();
    } catch (erro) {
        console.error("Erro ao excluir perímetro:", erro);
        alert("Não foi possível excluir.");
    }
}

/* =========================================================
   TECLADO (Esc fecha a imagem ampliada)
========================================================= */

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") fecharImagemPerimetro();
});
