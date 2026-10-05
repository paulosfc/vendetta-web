/* =========================================================
   SIDEBAR (abrir/fechar no mobile)
========================================================= */
(function () {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");
    const backdrop = document.getElementById("sidebarBackdrop");

    if (!sidebar || !toggle || !backdrop) return;

    function definir(aberta) {
        sidebar.classList.toggle("open", aberta);
        backdrop.classList.toggle("show", aberta);
        toggle.setAttribute("aria-expanded", String(aberta));
        toggle.setAttribute("aria-label", aberta ? "Fechar menu" : "Abrir menu");
    }

    toggle.addEventListener("click", () => definir(!sidebar.classList.contains("open")));
    backdrop.addEventListener("click", () => definir(false));

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") definir(false);
    });

    // Fecha o menu ao escolher uma página
    sidebar.addEventListener("click", e => {
        if (e.target.closest(".menu-btn, .sidebar-brand")) definir(false);
    });

    // Volta ao estado normal ao ir para tela grande
    window.matchMedia("(min-width: 901px)").addEventListener("change", e => {
        if (e.matches) definir(false);
    });
})();
