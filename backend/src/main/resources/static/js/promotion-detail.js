import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { initialiserLayout } from "./layout.js";

const session = exigerConnexion();
initialiserLayout("promotions", session);

const params = new URLSearchParams(window.location.search);
const idPromotion = params.get("id");
const titre = document.querySelector("[data-promotion-title]");
const description = document.querySelector("[data-promotion-description]");
const corpsTableau = document.querySelector("[data-cours-table]");

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

function badgeStatut(statut) {
    const element = document.createElement("span");
    element.className = statut === "ANNULE" ? "pill danger" : statut === "TERMINE" ? "pill success" : "pill";
    element.textContent = statut.replaceAll("_", " ");
    return element;
}

function afficherEtat(message) {
    const ligne = document.createElement("tr");
    const contenu = cellule(message, "state-cell");
    contenu.colSpan = 7;
    ligne.appendChild(contenu);
    corpsTableau.replaceChildren(ligne);
}

function afficherCours(cours) {
    if (!cours.length) {
        afficherEtat("Aucun cours n’est encore planifié pour cette promotion.");
        return;
    }

    corpsTableau.replaceChildren();
    cours.forEach((element) => {
        const ligne = document.createElement("tr");
        const statut = document.createElement("td");
        statut.appendChild(badgeStatut(element.statut));

        ligne.append(
            cellule(element.ordre ?? "—"),
            cellule(`${element.codeCours} - ${element.titreCours}`, "table-primary"),
            cellule(formaterDate(element.dateDebut)),
            cellule(formaterDate(element.dateFin)),
            cellule(element.salle || "Non renseignée", element.salle ? "" : "muted"),
            cellule(element.formateur || "Non affecté", element.formateur ? "" : "muted"),
            statut
        );
        corpsTableau.appendChild(ligne);
    });
}

if (!idPromotion) {
    titre.textContent = "Promotion introuvable";
    afficherEtat("Identifiant de promotion manquant.");
} else {
    try {
        const detail = await apiFetch(`/api/promotions/${idPromotion}/detail`);
        titre.textContent = detail.promotion.libelle;
        description.textContent = `${detail.promotion.titreCursus} - ${detail.promotion.libelleFiliere} - ${detail.promotion.periode}`;
        afficherCours(detail.cours);
    } catch (error) {
        titre.textContent = "Erreur de chargement";
        description.textContent = error.message;
        afficherEtat(error.message);
    }
}
