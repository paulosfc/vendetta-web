/* =========================================================
   HORÁRIO DE PISTA

   Regra do jogo: 10 minutos reais (Brasília) = 1 hora no jogo.
   Logo, 1 minuto de jogo = 10 segundos reais
   e 1 segundo real = 6 segundos de jogo.

   A pessoa informa o horário do jogo (que vale a partir de AGORA).
   O programa descobre quando será meia-noite no jogo. As meias-noites se repetem a cada
   24 horas de jogo = 4 horas reais.
========================================================= */

const MINUTOS_REAIS_POR_HORA_JOGO = 10;
const SEGUNDOS_REAIS_POR_MINUTO_JOGO = MINUTOS_REAIS_POR_HORA_JOGO * 60 / 60; // = 10
const SEGUNDOS_JOGO_POR_SEGUNDO_REAL = 60 / SEGUNDOS_REAIS_POR_MINUTO_JOGO;    // = 6
const CICLO_DIA_JOGO_MS = 24 * MINUTOS_REAIS_POR_HORA_JOGO * 60 * 1000;         // 4 h reais
const FUSO_BRASILIA = "America/Sao_Paulo";
const CHAVE_HORARIO_PISTA = "horarioPistaReferencia";
const QTD_PROXIMAS_MEIAS_NOITES = 4;

let referenciaHorario = null; // { minutoJogo, instanteMs }
let timerHorario = null;

/* =========================================================
   FUNÇÕES DE TEMPO (sempre no fuso de Brasília)
========================================================= */

const doisDigitos = n => String(n).padStart(2, "0");

function partesBrasilia(ms) {
    const formatador = new Intl.DateTimeFormat("pt-BR", {
        timeZone: FUSO_BRASILIA,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    });

    const p = {};
    formatador.formatToParts(new Date(ms)).forEach(parte => {
        p[parte.type] = parte.value;
    });

    return {
        ano: Number(p.year),
        mes: Number(p.month),
        dia: Number(p.day),
        h: Number(p.hour),
        m: Number(p.minute),
        s: Number(p.second)
    };
}

function formatarHoraBrasilia(ms) {
    const p = partesBrasilia(ms);
    return `${doisDigitos(p.h)}:${doisDigitos(p.m)}:${doisDigitos(p.s)}`;
}

function rotuloDiaBrasilia(ms, baseMs) {
    const a = partesBrasilia(ms);
    const b = partesBrasilia(baseMs);
    const dias = Math.round(
        (Date.UTC(a.ano, a.mes - 1, a.dia) - Date.UTC(b.ano, b.mes - 1, b.dia)) / 86400000
    );

    if (dias === 0) return "hoje";
    if (dias === 1) return "amanhã";
    if (dias === -1) return "ontem";
    return dias > 0 ? `em ${dias} dias` : `há ${-dias} dias`;
}

function formatarDuracao(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${doisDigitos(h)}:${doisDigitos(m)}:${doisDigitos(s)}`;
}

function formatarHoraJogo(segundosDoDia) {
    const total = ((Math.floor(segundosDoDia) % 86400) + 86400) % 86400;
    return `${doisDigitos(Math.floor(total / 3600))}:${doisDigitos(Math.floor((total % 3600) / 60))}`;
}

/* =========================================================
   CÁLCULO
========================================================= */

// Próxima meia-noite do jogo (instante real), a partir da referência.
function proximaMeiaNoite(referencia, agora) {
    const minutosAteMeiaNoite = (1440 - referencia.minutoJogo) % 1440;
    let instante = referencia.instanteMs + minutosAteMeiaNoite * SEGUNDOS_REAIS_POR_MINUTO_JOGO * 1000;

    // Pula ciclos já passados (3 s de tolerância para mostrar "agora")
    while (instante < agora - 3000) {
        instante += CICLO_DIA_JOGO_MS;
    }

    return instante;
}

function segundosDoJogoAgora(referencia, agora) {
    const segundosReais = (agora - referencia.instanteMs) / 1000;
    return referencia.minutoJogo * 60 + segundosReais * SEGUNDOS_JOGO_POR_SEGUNDO_REAL;
}

/* =========================================================
   TELA
========================================================= */

function calcularHorarioPista(evento) {
    evento.preventDefault();

    const horarioJogo = document.getElementById("horarioJogo").value;

    if (!horarioJogo) {
        alert("Informe o horário do jogo.");
        return;
    }

    const [h, m] = horarioJogo.split(":").map(Number);

    referenciaHorario = {
        minutoJogo: h * 60 + m,
        instanteMs: Date.now()
    };

    localStorage.setItem(CHAVE_HORARIO_PISTA, JSON.stringify(referenciaHorario));

    atualizarHorarioPista();
    iniciarTimerHorario();
}

function atualizarHorarioPista() {
    const cartao = document.getElementById("horarioResultado");
    if (!cartao) return;

    if (!referenciaHorario) {
        cartao.classList.add("hidden");
        return;
    }

    const agora = Date.now();
    const meiaNoite = proximaMeiaNoite(referenciaHorario, agora);
    const faltaMs = meiaNoite - agora;

    cartao.classList.remove("hidden");

    document.getElementById("horarioMeiaNoite").textContent = formatarHoraBrasilia(meiaNoite);
    document.getElementById("horarioMeiaNoiteDia").textContent =
        `${rotuloDiaBrasilia(meiaNoite, agora)} · horário de Brasília`;

    document.getElementById("horarioFaltam").textContent =
        faltaMs <= 0 ? "Agora!" : formatarDuracao(faltaMs);

    const horasJogoRestantes = Math.max(0, faltaMs) / 1000 * SEGUNDOS_JOGO_POR_SEGUNDO_REAL / 3600;
    document.getElementById("horarioFaltamJogo").textContent =
        `${horasJogoRestantes.toFixed(1).replace(".", ",")} h`;

    document.getElementById("horarioAgoraJogo").textContent =
        formatarHoraJogo(segundosDoJogoAgora(referenciaHorario, agora));

    const lista = document.getElementById("horarioLista");
    lista.innerHTML = "";

    for (let i = 0; i < QTD_PROXIMAS_MEIAS_NOITES; i++) {
        const instante = meiaNoite + i * CICLO_DIA_JOGO_MS;
        const item = document.createElement("li");

        const esquerda = document.createElement("span");
        esquerda.textContent = i === 0 ? "Próxima" : `Depois de ${i * 4} h`;

        const direita = document.createElement("strong");
        direita.textContent = `${formatarHoraBrasilia(instante)} · ${rotuloDiaBrasilia(instante, agora)}`;

        item.append(esquerda, direita);
        lista.appendChild(item);
    }

    const horaBase = formatarHoraBrasilia(referenciaHorario.instanteMs);
    const diaBase = rotuloDiaBrasilia(referenciaHorario.instanteMs, agora);
    document.getElementById("horarioBase").textContent =
        `Base do cálculo: ${formatarHoraJogo(referenciaHorario.minutoJogo * 60)} no jogo às ${horaBase} de Brasília (${diaBase}).`;
}

function iniciarTimerHorario() {
    if (timerHorario) clearInterval(timerHorario);
    timerHorario = setInterval(() => {
        const pagina = document.getElementById("pagina-horario");
        if (!document.hidden && pagina && !pagina.classList.contains("hidden")) atualizarHorarioPista();
    }, 500);
}

function limparHorarioPista() {
    referenciaHorario = null;
    localStorage.removeItem(CHAVE_HORARIO_PISTA);

    if (timerHorario) {
        clearInterval(timerHorario);
        timerHorario = null;
    }

    document.getElementById("formHorario").reset();
    atualizarHorarioPista();
}

function iniciarHorarioPista() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_HORARIO_PISTA));

        if (salvo && Number.isFinite(salvo.minutoJogo) && Number.isFinite(salvo.instanteMs)) {
            referenciaHorario = salvo;
        }
    } catch {
        referenciaHorario = null;
    }

    atualizarHorarioPista();

    if (referenciaHorario) iniciarTimerHorario();
}
