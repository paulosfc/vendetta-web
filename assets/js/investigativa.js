/* =========================================================
   ABA INVESTIGATIVA

   Mostra o aviso de que a pessoa será direcionada para outro
   site e o botão para abrir. Os dados ficam em
   dados-investigativa.js; aqui não precisa mexer.

   Depende de: dados-investigativa.js (INVESTIGATIVA)
========================================================= */

// Aceita só endereços http(s) completos. Devolve um objeto URL ou null.
function lerUrlInvestigativa() {
    const texto = String(INVESTIGATIVA.url || "").trim();
    if (!texto) return null;

    try {
        const url = new URL(texto);
        return url.protocol === "https:" || url.protocol === "http:" ? url : null;
    } catch {
        return null;
    }
}

function criarElementoInvestigativa(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined) e.textContent = texto;
    return e;
}

function carregarInvestigativa() {
    const conteudo = document.getElementById("investigativaConteudo");
    if (!conteudo) return;

    const nome = INVESTIGATIVA.nome || "o site externo";
    const url = lerUrlInvestigativa();
    const novaAba = INVESTIGATIVA.abrirEmNovaAba !== false;

    conteudo.innerHTML = "";

    if (INVESTIGATIVA.descricao) {
        conteudo.appendChild(criarElementoInvestigativa("p", "investigativa-descricao", INVESTIGATIVA.descricao));
    }

    // Endereço ainda não configurado (ou inválido)
    if (!url) {
        const aviso = criarElementoInvestigativa("div", "investigativa-config");
        aviso.append(
            criarElementoInvestigativa("strong", "", "O endereço do site ainda não foi configurado."),
            criarElementoInvestigativa(
                "p", "",
                "Abra o arquivo assets/js/dados-investigativa.js, preencha o campo url com o endereço completo " +
                '(começando por https://) e publique de novo. Endereços que não comecem por http:// ou https:// são ignorados.'
            )
        );
        conteudo.appendChild(aviso);
        return;
    }

    // Aviso principal
    const aviso = criarElementoInvestigativa("div", "investigativa-aviso");
    aviso.setAttribute("role", "note");

    const cabecalho = criarElementoInvestigativa("div", "investigativa-aviso-topo");
    cabecalho.append(
        criarElementoInvestigativa("span", "investigativa-icone", "↗"),
        criarElementoInvestigativa("h2", "", "Você será direcionado para outro site")
    );
    aviso.appendChild(cabecalho);

    aviso.appendChild(criarElementoInvestigativa(
        "p", "investigativa-texto",
        `Ao clicar no botão abaixo, você vai sair do Vendetta WEB e abrir "${nome}", que é um site externo. ` +
        "O Vendetta WEB não controla o conteúdo desse site nem o que você digitar nele."
    ));

    // Para onde vai
    const destino = criarElementoInvestigativa("div", "investigativa-destino");
    destino.append(
        criarElementoInvestigativa("span", "", "Endereço de destino"),
        criarElementoInvestigativa("strong", "", url.hostname),
        criarElementoInvestigativa("small", "", url.href)
    );
    aviso.appendChild(destino);

    const lista = criarElementoInvestigativa("ul", "investigativa-lista");
    lista.appendChild(criarElementoInvestigativa(
        "li", "",
        novaAba
            ? "O site abre em uma nova aba; o Vendetta WEB continua aberto nesta aba."
            : "O site abre nesta mesma aba; você sairá do Vendetta WEB (para voltar, use o botão voltar do navegador)."
    ));
    lista.appendChild(criarElementoInvestigativa("li", "", "Confira o endereço de destino acima antes de continuar."));

    if (url.protocol === "http:") {
        lista.appendChild(criarElementoInvestigativa(
            "li", "investigativa-perigo",
            "Atenção: este endereço não usa conexão segura (http). Evite digitar senhas ou dados pessoais nele."
        ));
    }

    aviso.appendChild(lista);

    // Botão (link de verdade: dá para ver o destino ao passar o mouse)
    const botao = criarElementoInvestigativa("a", "btn-primary investigativa-botao", `Ir para ${nome}`);
    botao.id = "investigativaBotao";
    botao.href = url.href;
    botao.rel = "noopener noreferrer";
    if (novaAba) botao.target = "_blank";
    botao.appendChild(criarElementoInvestigativa("span", "", "↗"));
    aviso.appendChild(botao);

    conteudo.appendChild(aviso);
}
