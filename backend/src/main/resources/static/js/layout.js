import { libelleRole, supprimerSession } from "./auth.js";

export function initialiserLayout(pageActive, session) {
    document.querySelector(`[data-nav="${pageActive}"]`)?.classList.add("active");

    document.querySelectorAll("[data-user-email]").forEach((element) => {
        element.textContent = session.utilisateur.email;
    });
    document.querySelectorAll("[data-user-role]").forEach((element) => {
        element.textContent = libelleRole(session.utilisateur.role);
    });
    document.querySelectorAll("[data-user-initial]").forEach((element) => {
        element.textContent = session.utilisateur.email.charAt(0).toUpperCase();
    });

    const peutGerer = ["ROLE_ADMIN", "ROLE_REFERENTE"].includes(session.utilisateur.role);
    document.querySelectorAll("[data-gestion-only]").forEach((element) => {
        element.hidden = !peutGerer;
    });

    document.querySelectorAll("[data-logout]").forEach((button) => {
        button.addEventListener("click", () => {
            supprimerSession();
            window.location.replace("/login.html");
        });
    });

    const shell = document.querySelector(".app-shell");
    document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => {
        shell?.classList.toggle("menu-open");
    });
    document.querySelector("[data-menu-backdrop]")?.addEventListener("click", () => {
        shell?.classList.remove("menu-open");
    });
}

export function afficherToast(message, type = "success") {
    let region = document.querySelector(".toast-region");
    if (!region) {
        region = document.createElement("div");
        region.className = "toast-region";
        region.setAttribute("aria-live", "polite");
        document.body.appendChild(region);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    region.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3600);
}

export function afficherMessageForm(element, message = "", type = "error") {
    element.className = message ? `form-message ${type}` : "form-message";
    element.textContent = message;
}
