import { apiFetch } from "./api.js";
import { exigerConnexion, libelleRole } from "./auth.js";
import { afficherToast, initialiserLayout } from "./layout.js";

const session = exigerConnexion(["ROLE_ADMIN"]);
initialiserLayout("utilisateurs", session);

const STATUTS = [
    ["ACTIF", "Actif"],
    ["INACTIF", "Inactif"],
    ["BLOQUE", "Bloqué"]
];

const elements = {
    liste: document.querySelector("[data-utilisateur-list]"),
    compteur: document.querySelector("[data-utilisateur-count]"),
    recherche: document.querySelector("[data-utilisateur-search]")
};

let utilisateurs = [];

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

function creerLienModifier(utilisateur) {
    const modifier = document.createElement("a");
    modifier.className = "button button-secondary button-small";
    modifier.href = `/utilisateur-form.html?id=${utilisateur.idUtilisateur}`;
    modifier.textContent = "Modifier";
    return modifier;
}

function creerBoutonSupprimer(utilisateur) {
    const supprimer = document.createElement("button");
    supprimer.className = "button button-danger button-small";
    supprimer.type = "button";
    supprimer.textContent = "Supprimer";

    if (utilisateur.email === session.utilisateur.email) {
        supprimer.disabled = true;
        supprimer.title = "Vous ne pouvez pas supprimer votre propre compte depuis cette page.";
        return supprimer;
    }

    supprimer.addEventListener("click", () => supprimerUtilisateur(utilisateur));
    return supprimer;
}

function afficherListe() {
    const recherche = normaliserRecherche(elements.recherche.value);
    const resultat = utilisateurs.filter((utilisateur) =>
        normaliserRecherche(`${utilisateur.email} ${utilisateur.role} ${utilisateur.statut}`).includes(recherche)
    );

    elements.compteur.textContent = resultat.length;
    elements.liste.replaceChildren();

    if (!resultat.length) {
        const ligne = document.createElement("tr");
        const etat = cellule(recherche ? "Aucun utilisateur ne correspond à la recherche." : "Aucun utilisateur n’est encore enregistré.", "state-cell");
        etat.colSpan = 4;
        ligne.appendChild(etat);
        elements.liste.appendChild(ligne);
        return;
    }

    resultat.forEach((utilisateur) => {
        const ligne = document.createElement("tr");
        const action = cellule("", "actions-cell");
        action.append(creerLienModifier(utilisateur), creerBoutonSupprimer(utilisateur));

        ligne.append(
            cellule(utilisateur.email, "table-primary"),
            cellulePill(libelleRole(utilisateur.role)),
            cellulePill(libelleStatut(utilisateur.statut), classeStatut(utilisateur.statut)),
            action
        );
        elements.liste.appendChild(ligne);
    });
}

async function chargerUtilisateurs() {
    try {
        utilisateurs = await apiFetch("/api/utilisateurs");
        afficherListe();
    } catch (error) {
        const ligne = document.createElement("tr");
        const etat = cellule(error.message, "state-cell");
        etat.colSpan = 4;
        ligne.appendChild(etat);
        elements.liste.replaceChildren(ligne);
    }
}

async function supprimerUtilisateur(utilisateur) {
    const confirmation = window.confirm(`Supprimer définitivement le compte ${utilisateur.email} ?`);
    if (!confirmation) {
        return;
    }

    try {
        await apiFetch(`/api/utilisateurs/${utilisateur.idUtilisateur}`, {
            method: "DELETE"
        });
        afficherToast("L’utilisateur a été supprimé.");
        await chargerUtilisateurs();
    } catch (error) {
        afficherToast(error.message, "error");
    }
}

elements.recherche.addEventListener("input", afficherListe);

await chargerUtilisateurs();
