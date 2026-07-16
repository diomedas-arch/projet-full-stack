import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { afficherToast, initialiserLayout } from "./layout.js";

const session = exigerConnexion();
initialiserLayout("accueil", session);

const nom = session.utilisateur.email.split("@")[0].replace(/[._-]+/g, " ");
document.querySelector("[data-dashboard-name]").textContent = nom || "bienvenue";

if (new URLSearchParams(window.location.search).get("acces") === "refuse") {
    afficherToast("Vous n’avez pas les droits nécessaires pour accéder à cette rubrique.", "error");
    window.history.replaceState({}, "", "/accueil.html");
}

const corpsTableau = document.querySelector("[data-dashboard-cursus]");

function creerCellule(texte, classe = "") {
    const cellule = document.createElement("td");
    cellule.textContent = texte;
    if (classe) cellule.className = classe;
    return cellule;
}

function afficherCursus(cursus) {
    corpsTableau.replaceChildren();
    if (!cursus.length) {
        const ligne = document.createElement("tr");
        const cellule = creerCellule("Aucun cursus n’est encore enregistré.", "state-cell");
        cellule.colSpan = 3;
        ligne.appendChild(cellule);
        corpsTableau.appendChild(ligne);
        return;
    }

    cursus.slice(0, 6).forEach((element) => {
        const ligne = document.createElement("tr");
        ligne.append(
            creerCellule(element.titre, "table-primary"),
            creerCellule(element.libelleFiliere),
            creerCellule(element.niveau || "Non renseigné", element.niveau ? "" : "muted")
        );
        corpsTableau.appendChild(ligne);
    });
}

try {
    const [filieres, cursus] = await Promise.all([
        apiFetch("/api/filieres"),
        apiFetch("/api/cursus")
    ]);

    document.querySelector("[data-stat-filieres]").textContent = filieres.length;
    document.querySelector("[data-stat-cursus]").textContent = cursus.length;
    document.querySelector("[data-stat-sans-cursus]").textContent = filieres.filter((filiere) => filiere.nombreCursus === 0).length;
    afficherCursus(cursus);
} catch (error) {
    document.querySelectorAll("[data-stat-filieres], [data-stat-cursus], [data-stat-sans-cursus]")
        .forEach((element) => { element.textContent = "!"; });
    const ligne = document.createElement("tr");
    const cellule = creerCellule(error.message, "state-cell");
    cellule.colSpan = 3;
    ligne.appendChild(cellule);
    corpsTableau.replaceChildren(ligne);
}
