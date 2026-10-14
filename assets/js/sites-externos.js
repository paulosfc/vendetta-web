/* =========================================================
   ABA SITES EXTERNOS

   Mostra um local para cada site de dados-sites-externos.js,
   com botão e link visível que levam direto ao site. Aqui
   não precisa mexer: para trocar ou adicionar sites, edite
   assets/js/dados-sites-externos.js.

   Depende de: dados-sites-externos.js (SITES_EXTERNOS)
========================================================= */

// Aceita só endereços http(s) completos. Devolve um objeto URL ou null.
function lerUrlSiteExterno(site) {
    const texto = String((site && site.url) || "").trim();
    if (!texto) return null;

    try {
        const url = new URL(texto);
        return url.protocol === "https:" || url.protocol === "http:" ? url : null;
    } catch {
        return null;
    }
}

function criarElementoSite(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
}

// Preenche os atributos que fazem o link abrir o site (rel seguro + nova aba)
function configurarLinkExterno(link, url) {
    link.href = url.href;
    link.rel = "noopener noreferrer";
    if (SITES_EXTERNOS_NOVA_ABA !== false) link.target = "_blank";
}

function criarCardSiteExterno(site) {
    const nome = site.nome || "Site externo";
    const url = lerUrlSiteExterno(site);

    const card = criarElementoSite("article", "card site-card");

    const topo = criarElementoSite("div", "site-card-topo");
    topo.append(
        criarElementoSite("span", "site-icone", site.icone || "↗"),
        criarElementoSite("h2", "", nome)
    );
    card.appendChild(topo);

    if (site.descricao) {
        card.appendChild(criarElementoSite("p", "site-descricao", site.descricao));
    }

    // Endereço ainda não configurado (ou inválido)
    if (!url) {
        const config = criarElementoSite("div", "site-config");
        config.append(
            criarElementoSite("strong", "", "O endereço deste site ainda não foi configurado."),
            criarElementoSite(
                "p", "",
                "Abra o arquivo assets/js/dados-sites-externos.js, preencha o campo url com o endereço completo " +
                "(começando por https://) e publique de novo. Endereços que não comecem por http:// ou https:// são ignorados."
            )
        );
        card.appendChild(config);
        return card;
    }

    // Link visível (clicável) com o endereço de destino
    const destino = criarElementoSite("div", "site-destino");
    const link = criarElementoSite("a", "site-link", url.href);
    configurarLinkExterno(link, url);
    destino.append(criarElementoSite("span", "", "Link do site"), link);
    card.appendChild(destino);

    if (url.protocol === "http:") {
        card.appendChild(criarElementoSite(
            "p", "site-perigo",
            "Atenção: este endereço não usa conexão segura (http). Evite digitar senhas ou dados pessoais nele."
        ));
    }

    // Botão (link de verdade: dá para ver o destino ao passar o mouse)
    const botao = criarElementoSite("a", "btn-primary site-botao", `Abrir ${nome}`);
    configurarLinkExterno(botao, url);
    botao.appendChild(criarElementoSite("span", "", "↗"));
    card.appendChild(botao);

    return card;
}

function carregarSitesExternos() {
    const conteudo = document.getElementById("sitesExternosConteudo");
    if (!conteudo) return;

    conteudo.innerHTML = "";

    const sites = Array.isArray(SITES_EXTERNOS) ? SITES_EXTERNOS.filter(s => s && s.nome) : [];

    if (sites.length === 0) {
        conteudo.appendChild(criarElementoSite(
            "div", "perimetro-vazio",
            "Nenhum site cadastrado. Adicione em assets/js/dados-sites-externos.js."
        ));
        return;
    }

    sites.forEach(site => conteudo.appendChild(criarCardSiteExterno(site)));
}
