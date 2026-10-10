/* interativo.js - navegação por URL, toasts, filtros em chips, galeria e extras do craft. Carregar por último. */
(function () {
    "use strict";
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    /* ---------- toasts (substitui alert) ---------- */
    let caixa = null;
    function toast(msg, tipo) {
        if (!caixa) {
            caixa = document.createElement("div");
            caixa.id = "toasts";
            caixa.setAttribute("role", "status");
            caixa.setAttribute("aria-live", "polite");
            document.body.appendChild(caixa);
        }
        const t = document.createElement("div");
        t.className = "toast" + (tipo === "erro" ? " erro" : "");
        t.textContent = msg;
        caixa.appendChild(t);
        setTimeout(() => { t.classList.add("sai"); setTimeout(() => t.remove(), 300); }, 4500);
    }
    window.mostrarToast = toast;
    window.alert = m => toast(String(m), /não foi possível|não enviad|erro|selecione|digite|informe/i.test(m) ? "erro" : "ok");

    /* ---------- navegação: URL (#aba), botão voltar, título ---------- */
    const titulos = { crafts: "Crafts", encomendas: "Encomendas", perimetros: "Perímetros", rotas: "Rotas", horario: "Horário de Pista", investigativa: "Investigativa" };
    const original = window.mostrarPagina;

    function ir(pagina, empurrar) {
        if (!document.getElementById("pagina-" + pagina)) pagina = "crafts";
        const botao = $(`.menu-btn[data-page="${pagina}"]`);
        original(pagina, botao);
        $$(".menu-btn").forEach(b => b.removeAttribute("aria-current"));
        if (botao) botao.setAttribute("aria-current", "page");
        document.title = `${titulos[pagina] || "App"} | Vendetta WEB`;
        if (empurrar && location.hash !== "#" + pagina) history.pushState(null, "", "#" + pagina);
        window.scrollTo({ top: 0 });
    }
    window.mostrarPagina = pagina => ir(pagina, true);
    window.addEventListener("popstate", () => ir(location.hash.slice(1) || "crafts", false));

    /* ---------- craft: chips, atalhos de quantidade, copiar lista ---------- */
    function chips() {
        const sel = $("#filtroCategoriaCraft"), lista = $("#listaCrafts");
        if (!sel || !lista) return;
        let box = $("#craftChips");
        if (!box) {
            box = document.createElement("div");
            box.id = "craftChips";
            box.className = "chips";
            box.setAttribute("role", "group");
            box.setAttribute("aria-label", "Categorias");
            lista.before(box);
        }
        const todos = craftsValidos();
        box.innerHTML = "";
        [...sel.options].forEach(o => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "chip" + (sel.value === o.value ? " ativo" : "");
            b.append(o.value ? o.textContent : "Todos");
            const n = document.createElement("small");
            n.textContent = o.value ? todos.filter(c => c.categoria === o.value).length : todos.length;
            b.append(n);
            b.onclick = () => { sel.value = o.value; mostrarCrafts(); chips(); };
            box.appendChild(b);
        });
    }

    function extrasCraft() {
        const campo = $("#craftQuantidade"), res = $("#craftResultado");
        if (!campo || !res || !craftAberto) return;

        if (!$("#craftRapido")) {
            const barra = document.createElement("div");
            barra.id = "craftRapido";
            barra.className = "chips";
            [["−1 craft", -1], ["+1 craft", 1], ["+5", 5], ["+10", 10], ["×2", "x2"]].forEach(([texto, n]) => {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "chip";
                b.textContent = texto;
                b.onclick = () => {
                    const u = unidadesPorCraft(craftAberto), atual = Math.max(0, Number(campo.value) || 0);
                    const novo = n === "x2" ? atual * 2 : atual + n * u;
                    campo.value = Math.min(QUANTIDADE_MAXIMA_CRAFT, Math.max(1, novo));
                    window.calcularCraftSelecionado();
                };
                barra.appendChild(b);
            });
            campo.closest(".form-group").after(barra);
        }

        const total = $(".craft-secao-total", res);
        if (total) {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "btn-secondary craft-copiar";
            b.textContent = "Copiar lista de materiais";
            b.onclick = async () => {
                const linhas = $$("li", total).map(li => `${li.querySelector("span").textContent}: ${li.querySelector("strong").textContent}`);
                const texto = `${craftAberto.nome} x ${campo.value}\n${linhas.join("\n")}`;
                try { await navigator.clipboard.writeText(texto); toast("Lista copiada!"); }
                catch { toast("Não foi possível copiar. Selecione o texto manualmente.", "erro"); }
            };
            res.appendChild(b);
        }
    }

    const calcOriginal = window.calcularCraftSelecionado;
    window.calcularCraftSelecionado = function () { calcOriginal(); extrasCraft(); };

    // devolve o foco ao card e evita fechar ao arrastar seleção de dentro da janela
    const abrirOriginal = window.abrirCraft, fecharOriginal = window.fecharCraft;
    let voltarFoco = null, desceuDentro = false;
    window.abrirCraft = craft => { voltarFoco = document.activeElement; abrirOriginal(craft); };
    window.fecharCraft = function (e) {
        if (e && e.type === "click" && desceuDentro) { desceuDentro = false; return; }
        fecharOriginal(e);
        const modal = $("#craftModal");
        if (modal && modal.classList.contains("hidden") && voltarFoco) { voltarFoco.focus(); voltarFoco = null; }
    };

    /* ---------- galeria: anterior/próximo, setas do teclado e deslize ---------- */
    const galerias = [
        { sel: "perimetroSelect", viewer: "perimetroViewer", lb: "perimetroLightbox", lbImg: "perimetroLightboxImg", img: "perimetroImagem", mostrar: "mostrarPerimetro" },
        { sel: "rotaSelect", viewer: "rotaViewer", lb: "rotaLightbox", lbImg: "rotaLightboxImg", img: "rotaImagem", mostrar: "mostrarRota" }
    ];

    function mover(g, d) {
        const s = document.getElementById(g.sel), n = s.options.length - 1;
        if (n < 1) return;
        const i = s.selectedIndex === 0 ? (d > 0 ? 0 : n - 1) : (s.selectedIndex - 1 + d + n) % n;
        s.selectedIndex = i + 1;
        window[g.mostrar]();
        const lb = document.getElementById(g.lb);
        if (!lb.classList.contains("hidden")) {
            const img = document.getElementById(g.img), alvo = document.getElementById(g.lbImg);
            alvo.src = img.src;
            alvo.alt = img.alt;
        }
    }

    function iniciarGalerias() {
        galerias.forEach(g => {
            const acoes = $(".perimetro-actions", document.getElementById(g.viewer));
            const lb = document.getElementById(g.lb);
            if (!acoes || !lb) return;

            [["◀", -1, "Anterior"], ["▶", 1, "Próximo"]].forEach(([txt, d, rotulo]) => {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "btn-editar-perimetro";
                b.textContent = txt;
                b.setAttribute("aria-label", rotulo);
                b.onclick = () => mover(g, d);
                d < 0 ? acoes.prepend(b) : acoes.insertBefore(b, acoes.lastElementChild);

                const seta = document.createElement("button");
                seta.type = "button";
                seta.className = "perimetro-lightbox-seta " + (d < 0 ? "esq" : "dir");
                seta.textContent = txt;
                seta.setAttribute("aria-label", rotulo);
                seta.onclick = e => { e.stopPropagation(); mover(g, d); };
                lb.appendChild(seta);
            });

            let x0 = null;
            lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
            lb.addEventListener("touchend", e => {
                if (x0 === null) return;
                const dx = e.changedTouches[0].clientX - x0;
                if (Math.abs(dx) > 50) mover(g, dx < 0 ? 1 : -1);
                x0 = null;
            });
        });

        document.addEventListener("keydown", e => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            const g = galerias.find(x => { const l = document.getElementById(x.lb); return l && !l.classList.contains("hidden"); });
            if (g) mover(g, e.key === "ArrowRight" ? 1 : -1);
        });
    }

    /* ---------- encomendas: cartões de estatística filtram a lista ---------- */
    function iniciarEstatisticas() {
        const mapa = { totalEncomendas: "", encomendasPendentes: "Pendente", encomendasConcluidas: "Concluída" };
        const filtro = $("#filtroStatusEncomenda");
        if (!filtro) return;

        const marcar = () => Object.entries(mapa).forEach(([id, status]) => {
            const card = document.getElementById(id)?.closest(".stat-card");
            if (card) card.classList.toggle("ativo", filtro.value !== "" && filtro.value === status);
        });

        Object.entries(mapa).forEach(([id, status]) => {
            const card = document.getElementById(id)?.closest(".stat-card");
            if (!card) return;
            const aplicar = () => { filtro.value = status; mostrarEncomendas(); marcar(); };
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.title = "Clique para filtrar";
            card.addEventListener("click", aplicar);
            card.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); aplicar(); }
            });
        });
        filtro.addEventListener("change", marcar);
    }

    /* ---------- início (depois do main.js) ---------- */
    document.addEventListener("DOMContentLoaded", () => {
        chips();
        const sel = $("#filtroCategoriaCraft");
        if (sel) sel.addEventListener("change", chips);
        iniciarGalerias();
        iniciarEstatisticas();
        const inicial = location.hash.slice(1);
        if (inicial && inicial !== "crafts") ir(inicial, false);
        else { const b = $('.menu-btn[data-page="crafts"]'); if (b) b.setAttribute("aria-current", "page"); }
    });
})();
