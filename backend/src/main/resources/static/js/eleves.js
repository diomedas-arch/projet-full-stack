import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { afficherToast, initialiserLayout } from "./layout.js";

const session = exigerConnexion(["ROLE_ADMIN", "ROLE_REFERENTE"]);
initialiserLayout("eleves", session);

const STATUTS = [
    ["ACTIF", "Actif"],
    ["INACTIF", "Inactif"],
    ["BLOQUE", "Bloqué"]
];

const elements = {
    liste: document.querySelector("[data-eleve-list]"),
    compteur: document.querySelector("[data-eleve-count]"),
    recherche: document.querySelector("[data-eleve-search]")
};

let eleves = [];

function normaliserRecherche(texte) {
    return texte.trim().toLocaleLowerCase("fr");
}

function cellule(texte, classe = "") {
    const element = document.createElement("td");
    element.textContent = texte;
    if (classe) element.className = classe;
    return element;
}

function libelleStatut(statut) {
    return STATUTS.find(([valeur]) => valeur === statut)?.[1] || statut;
}

function classeStatut(statut) {
    return {
        ACTIF: "success",
        INACTIF: "warning",
        BLOQUE: "danger"
    }[statut] || "";
}

function cellulePill(texte, classe = "") {
    const cell = cellule("");
    const pill = document.createElement("span");
    pill.className = `pill ${classe}`.trim();
    pill.textContent = texte;
    cell.appendChild(pill);
    return cell;
}

function creerLienModifier(eleve) {
    const modifier = document.createElement("a");
    modifier.className = "button button-secondary button-small";
    modifier.href = `/eleve-form.html?id=${eleve.idEleve}`;
    modifier.textContent = "Modifier";
    return modifier;
}

function creerBoutonSupprimer(eleve) {
    const supprimer = document.createElement("button");
    supprimer.className = "button button-danger button-small";
    supprimer.type = "button";
    supprimer.textContent = "Supprimer";
    supprimer.addEventListener("click", () => supprimerEleve(eleve));
    return supprimer;
}

function afficherListe() {
    const recherche = normaliserRecherche(elements.recherche.value);
    const resultat = eleves.filter((eleve) =>
        normaliserRecherche(`${eleve.numeroDossier} ${eleve.email} ${eleve.telephone || ""} ${eleve.statut}`).includes(recherche)
    );

    elements.compteur.textContent = resultat.length;
    elements.liste.replaceChildren();

    if (!resultat.length) {
        const ligne = document.createElement("tr");
        const etat = cellule(recherche ? "Aucun élève ne correspond à la recherche." : "Aucun élève n’est encore enregistré.", "state-cell");
        etat.colSpan = 5;
        ligne.appendChild(etat);
        elements.liste.appendChild(ligne);
        return;
    }

    resultat.forEach((eleve) => {
        const ligne = document.createElement("tr");
        const action = cellule("", "actions-cell");
        action.append(creerLienModifier(eleve), creerBoutonSupprimer(eleve));

        ligne.append(
            cellule(eleve.numeroDossier, "table-primary"),
            cellule(eleve.email),
            cellule(eleve.telephone || "Non renseigné", eleve.telephone ? "" : "muted"),
            cellulePill(libelleStatut(eleve.statut), classeStatut(eleve.statut)),
            action
        );
        elements.liste.appendChild(ligne);
    });
}

async function chargerEleves() {
    try {
        eleves = await apiFetch("/api/eleves");
        afficherListe();
    } catch (error) {
        const ligne = document.createElement("tr");
        const etat = cellule(error.message, "state-cell");
        etat.colSpan = 5;
        ligne.appendChild(etat);
        elements.liste.replaceChildren(ligne);
    }
}

async function supprimerEleve(eleve) {
    const confirmation = window.confirm(`Supprimer définitivement l’élève ${eleve.numeroDossier} et son compte utilisateur ?`);
    if (!confirmation) {
        return;
    }

    try {
        await apiFetch(`/api/eleves/${eleve.idEleve}`, {
            method: "DELETE"
        });
        afficherToast("L’élève et son compte utilisateur ont été supprimés.");
        await chargerEleves();
    } catch (error) {
        afficherToast(error.message, "error");
    }
}

elements.recherche.addEventListener("input", afficherListe);

await chargerEleves();
