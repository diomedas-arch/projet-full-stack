import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { afficherMessageForm, afficherToast, initialiserLayout } from "./layout.js";

const ROLES_GESTION = ["ROLE_REFERENTE", "ROLE_ADMIN"];
const session = exigerConnexion(ROLES_GESTION);
initialiserLayout("filieres", session);

const elements = {
    liste: document.querySelector("[data-filiere-list]"),
    compteur: document.querySelector("[data-filiere-count]"),
    recherche: document.querySelector("[data-filiere-search]"),
    formulaire: document.querySelector("[data-filiere-form]"),
    identifiant: document.querySelector("[data-filiere-id]"),
    libelle: document.querySelector("[data-filiere-libelle]"),
    titreFormulaire: document.querySelector("#filiere-form-title"),
    descriptionFormulaire: document.querySelector("[data-filiere-form-description]"),
    message: document.querySelector("[data-filiere-message]"),
    boutonSubmit: document.querySelector("[data-filiere-submit]"),
    boutonAnnuler: document.querySelector("[data-filiere-cancel]")
};

let filieres = [];

function normaliserRecherche(texte) {
    return texte.trim().toLocaleLowerCase("fr");
}

function cellule(texte, classe = "") {
    const element = document.createElement("td");
    element.textContent = texte;
    if (classe) element.className = classe;
    return element;
}

function afficherListe() {
    const recherche = normaliserRecherche(elements.recherche.value);
    const resultat = filieres.filter((filiere) => normaliserRecherche(filiere.libelle).includes(recherche));
    elements.compteur.textContent = resultat.length;
    elements.liste.replaceChildren();

    if (!resultat.length) {
        const ligne = document.createElement("tr");
        const etat = cellule(recherche ? "Aucune filière ne correspond à la recherche." : "Aucune filière n’est encore enregistrée.", "state-cell");
        etat.colSpan = 3;
        ligne.appendChild(etat);
        elements.liste.appendChild(ligne);
        return;
    }

    resultat.forEach((filiere) => {
        const ligne = document.createElement("tr");
        const action = cellule("", "actions-cell");
        const modifier = document.createElement("button");
        modifier.className = "button button-secondary button-small";
        modifier.type = "button";
        modifier.textContent = "Modifier";
        modifier.addEventListener("click", () => modifierFiliere(filiere));
        action.appendChild(modifier);

        ligne.append(
            cellule(filiere.libelle, "table-primary"),
            cellule(`${filiere.nombreCursus} cursus`),
            action
        );
        elements.liste.appendChild(ligne);
    });
}

async function chargerFilieres() {
    try {
        filieres = await apiFetch("/api/filieres");
        afficherListe();
    } catch (error) {
        const ligne = document.createElement("tr");
        const etat = cellule(error.message, "state-cell");
        etat.colSpan = 3;
        ligne.appendChild(etat);
        elements.liste.replaceChildren(ligne);
    }
}

function reinitialiserFormulaire(focus = false) {
    elements.formulaire.reset();
    elements.identifiant.value = "";
    elements.titreFormulaire.textContent = "Ajouter une filière";
    elements.descriptionFormulaire.textContent = "Une filière regroupe plusieurs cursus d’un même domaine.";
    elements.boutonSubmit.textContent = "Enregistrer";
    elements.boutonAnnuler.hidden = true;
    afficherMessageForm(elements.message);
    if (focus) {
        document.querySelector("#formulaire-filiere").scrollIntoView({ behavior: "smooth", block: "start" });
        elements.libelle.focus({ preventScroll: true });
    }
}

function modifierFiliere(filiere) {
    elements.identifiant.value = filiere.idFiliere;
    elements.libelle.value = filiere.libelle;
    elements.titreFormulaire.textContent = "Modifier la filière";
    elements.descriptionFormulaire.textContent = "Le nouveau libellé sera visible sur les cursus associés.";
    elements.boutonSubmit.textContent = "Enregistrer les modifications";
    elements.boutonAnnuler.hidden = false;
    afficherMessageForm(elements.message);
    document.querySelector("#formulaire-filiere").scrollIntoView({ behavior: "smooth", block: "start" });
    elements.libelle.focus({ preventScroll: true });
}

elements.formulaire.addEventListener("submit", async (event) => {
    event.preventDefault();
    const libelle = elements.libelle.value.trim();
    if (!libelle) {
        afficherMessageForm(elements.message, "Le libellé de la filière est obligatoire.");
        elements.libelle.focus();
        return;
    }

    const idFiliere = elements.identifiant.value;
    elements.boutonSubmit.disabled = true;
    afficherMessageForm(elements.message);

    try {
        await apiFetch(idFiliere ? `/api/filieres/${idFiliere}` : "/api/filieres", {
            method: idFiliere ? "PUT" : "POST",
            body: { libelle }
        });
        afficherToast(idFiliere ? "La filière a été modifiée." : "La filière a été créée.");
        reinitialiserFormulaire();
        await chargerFilieres();
    } catch (error) {
        afficherMessageForm(elements.message, error.details?.libelle || error.message);
    } finally {
        elements.boutonSubmit.disabled = false;
    }
});

elements.recherche.addEventListener("input", afficherListe);
elements.boutonAnnuler.addEventListener("click", () => reinitialiserFormulaire(true));
document.querySelector("[data-new-filiere]").addEventListener("click", () => reinitialiserFormulaire(true));

await chargerFilieres();
if (new URLSearchParams(window.location.search).get("nouveau") === "1") {
    reinitialiserFormulaire(true);
    window.history.replaceState({}, "", "/filieres.html");
}
