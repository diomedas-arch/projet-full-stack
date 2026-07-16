import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { initialiserLayout } from "./layout.js";

const session = exigerConnexion();
initialiserLayout("promotions", session);

const corpsTableau = document.querySelector("[data-promotions-table]");

function cellule(texte, classe = "") {
    const element = document.createElement("td");
    element.textContent = texte;
    if (classe) element.className = classe;
    return element;
}

function badgeStatut(statut) {
    const element = document.createElement("span");
    element.className = statut === "ANNULEE" ? "pill danger" : statut === "TERMINEE" ? "pill success" : "pill";
    element.textContent = statut.replaceAll("_", " ");
    return element;
}

function afficherEtat(message) {
    const ligne = document.createElement("tr");
    const contenu = cellule(message, "state-cell");
    contenu.colSpan = 6;
    ligne.appendChild(contenu);
    corpsTableau.replaceChildren(ligne);
}

function afficherPromotions(promotions) {
    if (!promotions.length) {
        afficherEtat("Aucune promotion n’est encore enregistrée.");
        return;
    }

    corpsTableau.replaceChildren();
    promotions.forEach((promotion) => {
        const ligne = document.createElement("tr");

        const statut = document.createElement("td");
        statut.appendChild(badgeStatut(promotion.statut));

        const action = document.createElement("td");
        action.className = "actions-cell";
        const lien = document.createElement("a");
        lien.className = "button button-secondary button-small";
        lien.href = `/promotion-detail.html?id=${promotion.idPromotion}`;
        lien.textContent = "Voir détail";
        action.appendChild(lien);

        ligne.append(
            cellule(promotion.libelle, "table-primary"),
            cellule(promotion.titreCursus),
            cellule(promotion.libelleFiliere),
            cellule(promotion.periode),
            statut,
            action
        );
        corpsTableau.appendChild(ligne);
    });
}

try {
    afficherPromotions(await apiFetch("/api/promotions"));
} catch (error) {
    afficherEtat(error.message);
}
