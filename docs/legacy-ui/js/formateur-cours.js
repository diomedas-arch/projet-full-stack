import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { initialiserLayout } from "./layout.js";

const session = exigerConnexion(["ROLE_FORMATEUR"]);
initialiserLayout("formateur-cours", session);

const corpsTableau = document.querySelector("[data-formateur-cours-table]");

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

function afficherEleves(eleves) {
    if (!eleves.length) {
        const element = document.createElement("span");
        element.className = "muted";
        element.textContent = "Aucun élève inscrit";
        return element;
    }

    const liste = document.createElement("div");
    liste.className = "quick-actions";
    eleves.forEach((eleve) => {
        const ligne = document.createElement("span");
        ligne.className = "pill";
        ligne.textContent = `${eleve.email} - ${eleve.numeroDossier}`;
        liste.appendChild(ligne);
    });
    return liste;
}

function afficherEtat(message) {
    const ligne = document.createElement("tr");
    const contenu = cellule(message, "state-cell");
    contenu.colSpan = 5;
    ligne.appendChild(contenu);
    corpsTableau.replaceChildren(ligne);
}

function afficherCours(cours) {
    if (!cours.length) {
        afficherEtat("Aucun cours ne vous est encore affecté.");
        return;
    }

    corpsTableau.replaceChildren();
    cours.forEach((element) => {
        const ligne = document.createElement("tr");
        const coursPlanifie = element.cours;
        const eleves = document.createElement("td");
        eleves.appendChild(afficherEleves(element.eleves));

        ligne.append(
            cellule(`${coursPlanifie.codeCours} - ${coursPlanifie.titreCours}`, "table-primary"),
            cellule(coursPlanifie.promotion),
            cellule(`${formaterDate(coursPlanifie.dateDebut)} → ${formaterDate(coursPlanifie.dateFin)}`),
            cellule(coursPlanifie.salle || "Non renseignée", coursPlanifie.salle ? "" : "muted"),
            eleves
        );
        corpsTableau.appendChild(ligne);
    });
}

try {
    afficherCours(await apiFetch("/api/formateur/cours"));
} catch (error) {
    afficherEtat(error.message);
}
