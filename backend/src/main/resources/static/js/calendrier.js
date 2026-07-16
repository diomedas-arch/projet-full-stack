import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { initialiserLayout } from "./layout.js";

const session = exigerConnexion(["ROLE_ELEVE"]);
initialiserLayout("calendrier", session);

const corpsTableau = document.querySelector("[data-calendrier-table]");

function formaterDate(valeur) {
    if (!valeur) return "Non renseignée";
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date(valeur));
}

function cellule(texte, classe = "") {
    const element = document.createElement("td");
    element.textContent = texte;
    if (classe) element.className = classe;
    return element;
}

function badgeType(typeInscription) {
    const element = document.createElement("span");
    element.className = typeInscription === "UNITE" ? "pill warning" : "pill";
    element.textContent = typeInscription === "UNITE" ? "Cours à l’unité" : "Promotion";
    return element;
}

function afficherEtat(message) {
    const ligne = document.createElement("tr");
    const contenu = cellule(message, "state-cell");
    contenu.colSpan = 7;
    ligne.appendChild(contenu);
    corpsTableau.replaceChildren(ligne);
}

function afficherCalendrier(cours) {
    if (!cours.length) {
        afficherEtat("Aucun cours n’est encore présent dans votre calendrier.");
        return;
    }

    corpsTableau.replaceChildren();
    cours.forEach((element) => {
        const ligne = document.createElement("tr");
        const type = document.createElement("td");
        type.appendChild(badgeType(element.typeInscription));

        ligne.append(
            type,
            cellule(element.promotion),
            cellule(`${element.codeCours} - ${element.titreCours}`, "table-primary"),
            cellule(formaterDate(element.dateDebut)),
            cellule(formaterDate(element.dateFin)),
            cellule(element.salle || "Non renseignée", element.salle ? "" : "muted"),
            cellule(element.formateur || "Non affecté", element.formateur ? "" : "muted")
        );
        corpsTableau.appendChild(ligne);
    });
}

try {
    afficherCalendrier(await apiFetch("/api/me/calendrier"));
} catch (error) {
    afficherEtat(error.message);
}
