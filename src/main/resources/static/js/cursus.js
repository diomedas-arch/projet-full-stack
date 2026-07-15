import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { afficherMessageForm, afficherToast, initialiserLayout } from "./layout.js";

const ROLES_GESTION = ["ROLE_REFERENTE", "ROLE_ADMIN"];
const session = exigerConnexion(ROLES_GESTION);
initialiserLayout("cursus", session);

const elements = {
    liste: document.querySelector("[data-cursus-list]"),
    compteur: document.querySelector("[data-cursus-count]"),
    recherche: document.querySelector("[data-cursus-search]"),
    filtre: document.querySelector("[data-cursus-filter]"),
    formulaire: document.querySelector("[data-cursus-form]"),
    identifiant: document.querySelector("[data-cursus-id]"),
    filiere: document.querySelector("[data-cursus-filiere]"),
    titre: document.querySelector("[data-cursus-titre]"),
    niveau: document.querySelector("[data-cursus-niveau]"),
    titreFormulaire: document.querySelector("#cursus-form-title"),
    descriptionFormulaire: document.querySelector("[data-cursus-form-description]"),
    message: document.querySelector("[data-cursus-message]"),
    boutonSubmit: document.querySelector("[data-cursus-submit]"),
    boutonAnnuler: document.querySelector("[data-cursus-cancel]")
};

let cursus = [];
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

function remplirSelectsFilieres() {
    const valeurFormulaire = elements.filiere.value;
    const valeurFiltre = elements.filtre.value;
    elements.filiere.replaceChildren(new Option("Sélectionner une filière", ""));
    elements.filtre.replaceChildren(new Option("Toutes les filières", ""));

    filieres.forEach((filiere) => {
        elements.filiere.add(new Option(filiere.libelle, filiere.idFiliere));
        elements.filtre.add(new Option(filiere.libelle, filiere.idFiliere));
    });

    elements.filiere.value = valeurFormulaire;
    elements.filtre.value = valeurFiltre;
}

function afficherListe() {
    const recherche = normaliserRecherche(elements.recherche.value);
    const idFiliere = elements.filtre.value;
    const resultat = cursus.filter((element) => {
        const correspondTexte = normaliserRecherche(`${element.titre} ${element.libelleFiliere} ${element.niveau || ""}`).includes(recherche);
        const correspondFiliere = !idFiliere || String(element.idFiliere) === idFiliere;
        return correspondTexte && correspondFiliere;
    });

    elements.compteur.textContent = resultat.length;
    elements.liste.replaceChildren();

    if (!resultat.length) {
        const ligne = document.createElement("tr");
        const etat = cellule(recherche || idFiliere ? "Aucun cursus ne correspond aux filtres." : "Aucun cursus n’est encore enregistré.", "state-cell");
        etat.colSpan = 4;
        ligne.appendChild(etat);
        elements.liste.appendChild(ligne);
        return;
    }

    resultat.forEach((element) => {
        const ligne = document.createElement("tr");
        const filiere = cellule("");
        const badge = document.createElement("span");
        badge.className = "pill";
        badge.textContent = element.libelleFiliere;
        filiere.appendChild(badge);

        const action = cellule("", "actions-cell");
        const modifier = document.createElement("button");
        modifier.className = "button button-secondary button-small";
        modifier.type = "button";
        modifier.textContent = "Modifier";
        modifier.addEventListener("click", () => modifierCursus(element));
        action.appendChild(modifier);

        ligne.append(
            cellule(element.titre, "table-primary"),
            filiere,
            cellule(element.niveau || "Non renseigné", element.niveau ? "" : "muted"),
            action
        );
        elements.liste.appendChild(ligne);
    });
}

async function chargerDonnees() {
    try {
        [filieres, cursus] = await Promise.all([
            apiFetch("/api/filieres"),
            apiFetch("/api/cursus")
        ]);
        remplirSelectsFilieres();
        afficherListe();
    } catch (error) {
        const ligne = document.createElement("tr");
        const etat = cellule(error.message, "state-cell");
        etat.colSpan = 4;
        ligne.appendChild(etat);
        elements.liste.replaceChildren(ligne);
    }
}

function reinitialiserFormulaire(focus = false) {
    elements.formulaire.reset();
    elements.identifiant.value = "";
    elements.titreFormulaire.textContent = "Ajouter un cursus";
    elements.descriptionFormulaire.textContent = "Le cursus doit obligatoirement appartenir à une filière.";
    elements.boutonSubmit.textContent = "Enregistrer";
    elements.boutonAnnuler.hidden = true;
    afficherMessageForm(elements.message);
    if (focus) {
        document.querySelector("#formulaire-cursus").scrollIntoView({ behavior: "smooth", block: "start" });
        elements.filiere.focus({ preventScroll: true });
    }
}

function modifierCursus(element) {
    elements.identifiant.value = element.idCursus;
    elements.filiere.value = element.idFiliere;
    elements.titre.value = element.titre;
    elements.niveau.value = element.niveau || "";
    elements.titreFormulaire.textContent = "Modifier le cursus";
    elements.descriptionFormulaire.textContent = "Vous pouvez changer son intitulé, son niveau ou sa filière.";
    elements.boutonSubmit.textContent = "Enregistrer les modifications";
    elements.boutonAnnuler.hidden = false;
    afficherMessageForm(elements.message);
    document.querySelector("#formulaire-cursus").scrollIntoView({ behavior: "smooth", block: "start" });
    elements.titre.focus({ preventScroll: true });
}

elements.formulaire.addEventListener("submit", async (event) => {
    event.preventDefault();
    const idFiliere = Number(elements.filiere.value);
    const titre = elements.titre.value.trim();
    const niveau = elements.niveau.value.trim();

    if (!idFiliere) {
        afficherMessageForm(elements.message, "Sélectionnez la filière du cursus.");
        elements.filiere.focus();
        return;
    }
    if (!titre) {
        afficherMessageForm(elements.message, "Le titre du cursus est obligatoire.");
        elements.titre.focus();
        return;
    }

    const idCursus = elements.identifiant.value;
    elements.boutonSubmit.disabled = true;
    afficherMessageForm(elements.message);

    try {
        await apiFetch(idCursus ? `/api/cursus/${idCursus}` : "/api/cursus", {
            method: idCursus ? "PUT" : "POST",
            body: { idFiliere, titre, niveau: niveau || null }
        });
        afficherToast(idCursus ? "Le cursus a été modifié." : "Le cursus a été créé.");
        reinitialiserFormulaire();
        await chargerDonnees();
    } catch (error) {
        const message = error.details?.titre || error.details?.idFiliere || error.details?.niveau || error.message;
        afficherMessageForm(elements.message, message);
    } finally {
        elements.boutonSubmit.disabled = false;
    }
});

elements.recherche.addEventListener("input", afficherListe);
elements.filtre.addEventListener("change", afficherListe);
elements.boutonAnnuler.addEventListener("click", () => reinitialiserFormulaire(true));
document.querySelector("[data-new-cursus]").addEventListener("click", () => reinitialiserFormulaire(true));

await chargerDonnees();
if (new URLSearchParams(window.location.search).get("nouveau") === "1") {
    reinitialiserFormulaire(true);
    window.history.replaceState({}, "", "/cursus.html");
}
