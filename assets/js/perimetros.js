/* =========================================================
   ABA PERÍMETROS (somente visualização)

   Os perímetros ficam em dados-perimetros.js e as imagens em
   assets/perimetros/. Este arquivo só desenha a tela, não
   precisa mexer aqui.

   Depende de: dados-perimetros.js (PERIMETROS)
========================================================= */

function perimetrosValidos() {
    return PERIMETROS.filter(perimetro => {
        const valido = perimetro && perimetro.nome && perimetro.imagem;
        if (!valido) console.warn("Perímetro ignorado (faltam nome ou imagem):", perimetro);
        return valido;
    });
}

function carregarPerimetros() {
    const select = document.getElementById("perimetroSelect");
    if (!select) return;

    const selecionado = select.value;
    select.innerHTML = "";

    const padrao = document.createElement("option");
    padrao.value = "";
    padrao.textContent = "Selecione um perímetro";
    select.appendChild(padrao);

    perimetrosValidos().forEach((perimetro, indice) => {
        const option = document.createElement("option");
        option.value = indice;
        option.textContent = perimetro.nome;
        select.appendChild(option);
    });

    if (selecionado !== "" && select.querySelector(`option[value="${selecionado}"]`)) {
        select.value = selecionado;
    }

    mostrarPerimetro();
}

function mostrarPerimetro() {
    const select = document.getElementById("perimetroSelect");
    const viewer = document.getElementById("perimetroViewer");
    const vazio = document.getElementById("perimetroVazio");
    const imagem = document.getElementById("perimetroImagem");
    const aviso = document.getElementById("perimetroAviso");
    if (!select || !viewer || !vazio || !imagem || !aviso) return;

    const lista = perimetrosValidos();
    const perimetro = select.value === "" ? null : lista[Number(select.value)];

    if (!perimetro) {
        imagem.removeAttribute("src");
        viewer.classList.add("hidden");
        vazio.classList.remove("hidden");
        vazio.textContent = lista.length === 0
            ? "Nenhum perímetro cadastrado. Adicione em assets/js/dados-perimetros.js."
            : "Escolha um perímetro na lista para ver a imagem.";
        return;
    }

    document.getElementById("perimetroNome").textContent = perimetro.nome;

    const descricao = document.getElementById("perimetroDescricao");
    descricao.textContent = perimetro.descricao || "";
    descricao.classList.toggle("hidden", !perimetro.descricao);

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
            `Não foi possível carregar a imagem "${perimetro.imagem}". ` +
            "Confira se o arquivo está na pasta assets/perimetros e se o nome (inclusive maiúsculas e minúsculas) é igual ao de dados-perimetros.js.";
        aviso.classList.remove("hidden");
    };

    imagem.alt = perimetro.nome;
    imagem.src = perimetro.imagem;
}

function abrirImagemPerimetro() {
    const imagem = document.getElementById("perimetroImagem");
    const lightbox = document.getElementById("perimetroLightbox");
    if (!lightbox || !imagem.getAttribute("src")) return;

    document.getElementById("perimetroLightboxImg").src = imagem.src;
    document.getElementById("perimetroLightboxImg").alt = imagem.alt;
    lightbox.classList.remove("hidden");
}

function fecharImagemPerimetro() {
    const lightbox = document.getElementById("perimetroLightbox");
    if (lightbox) lightbox.classList.add("hidden");
}

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") fecharImagemPerimetro();
});
