/* =========================================================
   ABA ROTAS (somente visualização)

   As rotas ficam em dados-rotas.js e as imagens em assets/rotas/.
   Este arquivo só desenha a tela, não precisa mexer aqui.

   Depende de: dados-rotas.js (ROTAS)
========================================================= */

function rotasValidas() {
    return ROTAS.filter(rota => {
        const valida = rota && rota.nome && rota.imagem;
        if (!valida) console.warn("Rota ignorada (faltam nome ou imagem):", rota);
        return valida;
    });
}

function carregarRotas() {
    const select = document.getElementById("rotaSelect");
    if (!select) return;

    const selecionada = select.value;
    select.innerHTML = "";

    const padrao = document.createElement("option");
    padrao.value = "";
    padrao.textContent = "Selecione uma rota";
    select.appendChild(padrao);

    rotasValidas().forEach((rota, indice) => {
        const option = document.createElement("option");
        option.value = indice;
        option.textContent = rota.nome;
        select.appendChild(option);
    });

    if (selecionada !== "" && select.querySelector(`option[value="${selecionada}"]`)) {
        select.value = selecionada;
    }

    mostrarRota();
}

function mostrarRota() {
    const select = document.getElementById("rotaSelect");
    const viewer = document.getElementById("rotaViewer");
    const vazio = document.getElementById("rotaVazio");
    const imagem = document.getElementById("rotaImagem");
    const aviso = document.getElementById("rotaAviso");
    if (!select || !viewer || !vazio || !imagem || !aviso) return;

    const rotas = rotasValidas();
    const rota = select.value === "" ? null : rotas[Number(select.value)];

    if (!rota) {
        imagem.removeAttribute("src");
        viewer.classList.add("hidden");
        vazio.classList.remove("hidden");
        vazio.textContent = rotas.length === 0
            ? "Nenhuma rota cadastrada. Adicione em assets/js/dados-rotas.js."
            : "Escolha uma rota na lista para ver a imagem.";
        return;
    }

    document.getElementById("rotaNome").textContent = rota.nome;

    const descricao = document.getElementById("rotaDescricao");
    descricao.textContent = rota.descricao || "";
    descricao.classList.toggle("hidden", !rota.descricao);

    vazio.classList.add("hidden");
    viewer.classList.remove("hidden");

    aviso.classList.add("hidden");
    imagem.classList.remove("hidden");

    imagem.onload = () => {
        aviso.classList.add("hidden");
        imagem.classList.remove("hidden");
    };
    imagem.onerror = () => {
        imagem.classList.add("hidden");
        aviso.textContent =
            `Não foi possível carregar a imagem "${rota.imagem}". ` +
            "Confira se o arquivo está na pasta assets/rotas e se o nome (inclusive maiúsculas e minúsculas) é igual ao de dados-rotas.js.";
        aviso.classList.remove("hidden");
    };

    imagem.alt = rota.nome;
    imagem.src = rota.imagem;
}

function abrirImagemRota() {
    const imagem = document.getElementById("rotaImagem");
    const lightbox = document.getElementById("rotaLightbox");
    if (!lightbox || !imagem.getAttribute("src")) return;

    document.getElementById("rotaLightboxImg").src = imagem.src;
    document.getElementById("rotaLightboxImg").alt = imagem.alt;
    lightbox.classList.remove("hidden");
}

function fecharImagemRota() {
    const lightbox = document.getElementById("rotaLightbox");
    if (lightbox) lightbox.classList.add("hidden");
}

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") fecharImagemRota();
});
