/* =========================================================
   PERÍMETROS

   Os dados ficam na tabela "perimetros" do Supabase e as fotos
   no bucket "perimetros" (Storage).

   Depende de: config.js, api.js (banco, armazenamento)
========================================================= */

const TABELA_PERIMETROS = "perimetros";
const PERIMETROS_TAMANHO_MAXIMO = 15 * 1024 * 1024; // 15 MB (o plano grátis aceita até 50 MB)

let perimetros = [];
const fotosEmCache = new Map(); // caminho no storage -> URL da foto já baixada
let perimetroExibido = null;    // id que está na tela (evita misturar fotos ao trocar rápido)

/* =========================================================
   LISTA / SELECT
========================================================= */

function normalizarPerimetro(linha) {
    return {
        id: Number(linha.id),
        nome: linha.nome,
        arquivo: linha.arquivo,
        criadoEm: linha.criado_em
    };
}

async function carregarPerimetros(idParaSelecionar) {
    const select = document.getElementById("perimetroSelect");
    if (!select) return;

    let falhou = null;

    try {
        const linhas = await banco.listar(TABELA_PERIMETROS, "select=id,nome,arquivo,criado_em&order=nome.asc");
        perimetros = linhas.map(normalizarPerimetro);
    } catch (erro) {
        console.error("Erro ao carregar perímetros:", erro);
        perimetros = [];
        falhou = erro.message;
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

    mostrarPerimetro(falhou);
}

function perimetroSelecionado() {
    const id = document.getElementById("perimetroSelect").value;
    return perimetros.find(p => String(p.id) === id) || null;
}

/* =========================================================
   VISUALIZAR
========================================================= */

async function obterUrlDaFoto(perimetro) {
    if (fotosEmCache.has(perimetro.arquivo)) {
        return fotosEmCache.get(perimetro.arquivo);
    }

    const blob = await armazenamento.baixar(SUPABASE_BUCKET_PERIMETROS, perimetro.arquivo);
    const url = URL.createObjectURL(blob);
    fotosEmCache.set(perimetro.arquivo, url);
    return url;
}

function esquecerFoto(arquivo) {
    if (fotosEmCache.has(arquivo)) {
        URL.revokeObjectURL(fotosEmCache.get(arquivo));
        fotosEmCache.delete(arquivo);
    }
}

async function mostrarPerimetro(mensagemDeErro) {
    const viewer = document.getElementById("perimetroViewer");
    const vazio = document.getElementById("perimetroVazio");
    const imagem = document.getElementById("perimetroImagem");
    const carregando = document.getElementById("perimetroCarregando");
    if (!viewer || !vazio || !imagem || !carregando) return;

    const perimetro = perimetroSelecionado();
    perimetroExibido = perimetro ? perimetro.id : null;

    if (!perimetro) {
        imagem.removeAttribute("src");
        viewer.classList.add("hidden");
        vazio.classList.remove("hidden");

        if (typeof mensagemDeErro === "string" && mensagemDeErro) {
            vazio.textContent = `Não foi possível carregar os perímetros: ${mensagemDeErro}`;
        } else {
            vazio.textContent = perimetros.length === 0
                ? "Nenhum perímetro cadastrado ainda. Adicione uma foto abaixo."
                : "Escolha um perímetro na lista para ver a foto.";
        }
        return;
    }

    document.getElementById("perimetroNome").textContent = perimetro.nome;
    document.getElementById("perimetroData").textContent =
        "Adicionado em " + new Date(perimetro.criadoEm).toLocaleDateString("pt-BR");

    vazio.classList.add("hidden");
    viewer.classList.remove("hidden");

    // Foto já baixada: mostra na hora. Senão, mostra "Carregando..."
    if (fotosEmCache.has(perimetro.arquivo)) {
        carregando.classList.add("hidden");
        imagem.classList.remove("hidden");
        imagem.src = fotosEmCache.get(perimetro.arquivo);
        imagem.alt = perimetro.nome;
        return;
    }

    imagem.removeAttribute("src");
    imagem.classList.add("hidden");
    carregando.textContent = "Carregando foto...";
    carregando.classList.remove("hidden");

    try {
        const url = await obterUrlDaFoto(perimetro);

        // O usuário pode ter trocado de perímetro enquanto baixava
        if (perimetroExibido !== perimetro.id) return;

        imagem.src = url;
        imagem.alt = perimetro.nome;
        imagem.classList.remove("hidden");
        carregando.classList.add("hidden");
    } catch (erro) {
        console.error("Erro ao baixar foto:", erro);

        if (perimetroExibido === perimetro.id) {
            carregando.textContent = `Não foi possível carregar a foto: ${erro.message}`;
        }
    }
}

function abrirImagemPerimetro() {
    const lightbox = document.getElementById("perimetroLightbox");
    const imagem = document.getElementById("perimetroImagem");
    if (!lightbox || !imagem.getAttribute("src")) return;

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

function nomeJaExiste(nome, ignorarId) {
    return perimetros.some(p => p.id !== ignorarId && p.nome.toLowerCase() === nome.toLowerCase());
}

const ehNomeDuplicado = erro => erro.status === 409 || erro.codigo === "23505";

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

    if (nomeJaExiste(nome)) {
        alert(`Já existe um perímetro chamado "${nome}".`);
        return;
    }

    botao.disabled = true;
    botao.textContent = "Enviando...";

    const caminho = nomeArquivoSeguro(arquivo);
    let fotoEnviada = false;

    try {
        await armazenamento.enviar(SUPABASE_BUCKET_PERIMETROS, caminho, arquivo);
        fotoEnviada = true;

        const [linha] = await banco.inserir(TABELA_PERIMETROS, { nome: nome, arquivo: caminho });

        limparFormularioPerimetro();
        await carregarPerimetros(linha.id);
        document.getElementById("perimetroViewer").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (erro) {
        console.error("Erro ao salvar perímetro:", erro);

        // Se a foto subiu mas o cadastro falhou, apaga a foto para não sobrar lixo
        if (fotoEnviada) {
            armazenamento.remover(SUPABASE_BUCKET_PERIMETROS, [caminho]).catch(() => {});
        }

        alert(ehNomeDuplicado(erro)
            ? `Já existe um perímetro chamado "${nome}".`
            : `Não foi possível salvar o perímetro: ${erro.message}`);
    } finally {
        botao.disabled = false;
        botao.textContent = "Salvar perímetro";
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

    if (nomeJaExiste(nome, perimetro.id)) {
        alert(`Já existe um perímetro chamado "${nome}".`);
        return;
    }

    try {
        await banco.atualizar(TABELA_PERIMETROS, perimetro.id, { nome: nome });
        await carregarPerimetros(perimetro.id);
    } catch (erro) {
        console.error("Erro ao renomear perímetro:", erro);
        alert(ehNomeDuplicado(erro)
            ? `Já existe um perímetro chamado "${nome}".`
            : `Não foi possível renomear: ${erro.message}`);
    }
}

async function excluirPerimetro() {
    const perimetro = perimetroSelecionado();
    if (!perimetro) return;

    if (!confirm(`Deseja excluir o perímetro "${perimetro.nome}"?`)) return;

    try {
        await banco.excluir(TABELA_PERIMETROS, perimetro.id);
    } catch (erro) {
        console.error("Erro ao excluir perímetro:", erro);
        alert(`Não foi possível excluir: ${erro.message}`);
        return;
    }

    // O registro já foi removido; apagar o arquivo é só limpeza
    esquecerFoto(perimetro.arquivo);
    armazenamento.remover(SUPABASE_BUCKET_PERIMETROS, [perimetro.arquivo]).catch(erro => {
        console.warn("Foto não removida do armazenamento:", erro);
    });

    document.getElementById("perimetroSelect").value = "";
    await carregarPerimetros();
}

/* =========================================================
   TECLADO (Esc fecha a imagem ampliada)
========================================================= */

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") fecharImagemPerimetro();
});
