/* =========================================================
   ABA ENCOMENDAS

   Mostra o aviso de que a pessoa será direcionada para outro
   site e o botão para abrir. Os dados ficam em
   dados-encomendas.js; aqui não precisa mexer.

   Depende de: dados-encomendas.js (ENCOMENDAS)
========================================================= */

// Aceita só endereços http(s) completos. Devolve um objeto URL ou null.
function lerUrlEncomendas() {
    const texto = String(ENCOMENDAS.url || "").trim();
    if (!texto) return null;

    try {
        const url = new URL(texto);
        return url.protocol === "https:" || url.protocol === "http:" ? url : null;
    } catch {
        return null;
    }
}

function criarElementoEncomendas(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
}

function carregarEncomendas() {
    const conteudo = document.getElementById("encomendasConteudo");
    if (!conteudo) return;

    const nome = ENCOMENDAS.nome || "o site externo";
    const url = lerUrlEncomendas();
    const novaAba = ENCOMENDAS.abrirEmNovaAba !== false;

    conteudo.innerHTML = "";

    if (ENCOMENDAS.descricao) {
        conteudo.appendChild(criarElementoEncomendas("p", "encomendas-descricao", ENCOMENDAS.descricao));
    }

    // Endereço ainda não configurado (ou inválido)
    if (!url) {
        const aviso = criarElementoEncomendas("div", "encomendas-config");
        aviso.append(
            criarElementoEncomendas("strong", "", "O endereço do site ainda não foi configurado."),
            criarElementoEncomendas(
                "p", "",
                "Abra o arquivo assets/js/dados-encomendas.js, preencha o campo url com o endereço completo " +
                '(começando por https://) e publique de novo. Endereços que não comecem por http:// ou https:// são ignorados.'
            )
        );
        conteudo.appendChild(aviso);
        return;
    }

    // Aviso principal
    const aviso = criarElementoEncomendas("div", "encomendas-aviso");
    aviso.setAttribute("role", "note");

    const cabecalho = criarElementoEncomendas("div", "encomendas-aviso-topo");
    cabecalho.append(
        criarElementoEncomendas("span", "encomendas-icone", "↗"),
        criarElementoEncomendas("h2", "", "Você será direcionado para outro site")
    );
    aviso.appendChild(cabecalho);

    aviso.appendChild(criarElementoEncomendas(
        "p", "encomendas-texto",
        `Ao clicar no botão abaixo, você vai sair do Vendetta WEB e abrir "${nome}", que é um site externo. ` +
        "O Vendetta WEB não controla o conteúdo desse site nem o que você digitar nele."
    ));

    // Para onde vai
    const destino = criarElementoEncomendas("div", "encomendas-destino");
    destino.append(
        criarElementoEncomendas("span", "", "Endereço de destino"),
        criarElementoEncomendas("strong", "", url.hostname),
        criarElementoEncomendas("small", "", url.href)
    );
    aviso.appendChild(destino);

    const lista = criarElementoEncomendas("ul", "encomendas-lista");
    lista.appendChild(criarElementoEncomendas(
        "li", "",
        novaAba
            ? "O site abre em uma nova aba; o Vendetta WEB continua aberto nesta aba."
            : "O site abre nesta mesma aba; você sairá do Vendetta WEB (para voltar, use o botão voltar do navegador)."
    ));
    lista.appendChild(criarElementoEncomendas("li", "", "Confira o endereço de destino acima antes de continuar."));

    if (url.protocol === "http:") {
        lista.appendChild(criarElementoEncomendas(
            "li", "encomendas-perigo",
            "Atenção: este endereço não usa conexão segura (http). Evite digitar senhas ou dados pessoais nele."
        ));
    }

    aviso.appendChild(lista);

    // Botão (link de verdade: dá para ver o destino ao passar o mouse)
    const botao = criarElementoEncomendas("a", "btn-primary encomendas-botao", `Ir para ${nome}`);
    botao.id = "encomendasBotao";
    botao.href = url.href;
    botao.rel = "noopener noreferrer";
    if (novaAba) botao.target = "_blank";
    botao.appendChild(criarElementoEncomendas("span", "", "↗"));
    aviso.appendChild(botao);

    conteudo.appendChild(aviso);
}
