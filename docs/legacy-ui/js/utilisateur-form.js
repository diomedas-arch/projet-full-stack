import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { afficherMessageForm, afficherToast, initialiserLayout } from "./layout.js";

const session = exigerConnexion(["ROLE_ADMIN"]);
initialiserLayout("utilisateurs", session);

const ROLES = [
    ["ROLE_ELEVE", "Élève"],
    ["ROLE_FORMATEUR", "Formateur"],
    ["ROLE_REFERENTE", "Référente administrative"],
    ["ROLE_ADMIN", "Administrateur"]
];

const STATUTS = [
    ["ACTIF", "Actif"],
    ["INACTIF", "Inactif"],
    ["BLOQUE", "Bloqué"]
];

const params = new URLSearchParams(window.location.search);
const idUtilisateur = params.get("id");
const modeModification = Boolean(idUtilisateur);

const elements = {
    pageTitle: document.querySelector("[data-page-title]"),
    pageDescription: document.querySelector("[data-page-description]"),
    formTitle: document.querySelector("[data-form-title]"),
    descriptionFormulaire: document.querySelector("[data-utilisateur-form-description]"),
    formulaire: document.querySelector("[data-utilisateur-form]"),
    identifiant: document.querySelector("[data-utilisateur-id]"),
    email: document.querySelector("[data-utilisateur-email]"),
    motDePasse: document.querySelector("[data-utilisateur-password]"),
    role: document.querySelector("[data-utilisateur-role]"),
    statut: document.querySelector("[data-utilisateur-statut]"),
    message: document.querySelector("[data-utilisateur-message]"),
    boutonSubmit: document.querySelector("[data-utilisateur-submit]"),
    passwordRequired: document.querySelector("[data-password-required]"),
    passwordHelp: document.querySelector("[data-password-help]")
};

function remplirSelect(select, options) {
    select.replaceChildren();
    options.forEach(([valeur, libelle]) => {
        select.add(new Option(libelle, valeur));
    });
}

function appliquerModeCreation() {
    elements.role.value = "ROLE_ELEVE";
    elements.statut.value = "ACTIF";
    elements.motDePasse.required = true;
    elements.passwordRequired.hidden = false;
    elements.passwordHelp.textContent = "Obligatoire à la création du compte.";
    elements.boutonSubmit.textContent = "Créer l’utilisateur";
}

function appliquerModeModification(utilisateur) {
    elements.identifiant.value = utilisateur.idUtilisateur;
    elements.email.value = utilisateur.email;
    elements.role.value = utilisateur.role;
    elements.statut.value = utilisateur.statut;
    elements.motDePasse.required = false;
    elements.motDePasse.placeholder = "Laisser vide pour ne pas changer";
    elements.passwordRequired.hidden = true;
    elements.passwordHelp.textContent = "À renseigner uniquement si vous voulez réinitialiser le mot de passe.";
    elements.pageTitle.textContent = "Modifier un utilisateur";
    elements.pageDescription.textContent = "Modifiez les informations du compte sélectionné.";
    elements.formTitle.textContent = "Modifier l’utilisateur";
    elements.descriptionFormulaire.textContent = "Vous pouvez modifier l’email, le rôle, le statut et éventuellement le mot de passe.";
    elements.boutonSubmit.textContent = "Enregistrer les modifications";
}

function messageErreurUtilisateur(error) {
    return error.details?.email
        || error.details?.motDePasse
        || error.details?.role
        || error.details?.statut
        || error.message;
}

async function chargerUtilisateur() {
    if (!modeModification) {
        appliquerModeCreation();
        elements.email.focus();
        return;
    }

    try {
        const utilisateur = await apiFetch(`/api/utilisateurs/${idUtilisateur}`);
        appliquerModeModification(utilisateur);
        elements.email.focus();
    } catch (error) {
        afficherMessageForm(elements.message, error.message);
        elements.boutonSubmit.disabled = true;
    }
}

elements.formulaire.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = elements.email.value.trim();
    const motDePasse = elements.motDePasse.value;
    const role = elements.role.value;
    const statut = elements.statut.value;

    if (!email) {
        afficherMessageForm(elements.message, "L’email est obligatoire.");
        elements.email.focus();
        return;
    }

    if (!modeModification && !motDePasse) {
        afficherMessageForm(elements.message, "Le mot de passe est obligatoire pour créer un utilisateur.");
        elements.motDePasse.focus();
        return;
    }

    if (motDePasse && motDePasse.length < 8) {
        afficherMessageForm(elements.message, "Le mot de passe doit contenir au moins 8 caractères.");
        elements.motDePasse.focus();
        return;
    }

    elements.boutonSubmit.disabled = true;
    afficherMessageForm(elements.message);

    try {
        if (modeModification) {
            await apiFetch(`/api/utilisateurs/${idUtilisateur}`, {
                method: "PUT",
                body: { email, role, statut }
            });

            if (motDePasse) {
                await apiFetch(`/api/utilisateurs/${idUtilisateur}/mot-de-passe`, {
                    method: "PATCH",
                    body: { motDePasse }
                });
            }

            afficherToast("L’utilisateur a été modifié.");
        } else {
            await apiFetch("/api/utilisateurs", {
                method: "POST",
                body: { email, motDePasse, role, statut }
            });
            afficherToast("L’utilisateur a été créé.");
        }

        window.setTimeout(() => {
            window.location.replace("/utilisateurs.html");
        }, 650);
    } catch (error) {
        afficherMessageForm(elements.message, messageErreurUtilisateur(error));
        elements.boutonSubmit.disabled = false;
    }
});

remplirSelect(elements.role, ROLES);
remplirSelect(elements.statut, STATUTS);
await chargerUtilisateur();
