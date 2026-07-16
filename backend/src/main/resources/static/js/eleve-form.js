import { apiFetch } from "./api.js";
import { exigerConnexion } from "./auth.js";
import { afficherMessageForm, afficherToast, initialiserLayout } from "./layout.js";

const session = exigerConnexion(["ROLE_ADMIN", "ROLE_REFERENTE"]);
initialiserLayout("eleves", session);

const STATUTS = [
    ["ACTIF", "Actif"],
    ["INACTIF", "Inactif"],
    ["BLOQUE", "Bloqué"]
];

const params = new URLSearchParams(window.location.search);
const idEleve = params.get("id");
const modeModification = Boolean(idEleve);

const elements = {
    pageTitle: document.querySelector("[data-page-title]"),
    pageDescription: document.querySelector("[data-page-description]"),
    formTitle: document.querySelector("[data-form-title]"),
    descriptionFormulaire: document.querySelector("[data-eleve-form-description]"),
    formulaire: document.querySelector("[data-eleve-form]"),
    identifiant: document.querySelector("[data-eleve-id]"),
    numeroDossier: document.querySelector("[data-eleve-numero]"),
    email: document.querySelector("[data-eleve-email]"),
    motDePasse: document.querySelector("[data-eleve-password]"),
    telephone: document.querySelector("[data-eleve-telephone]"),
    statut: document.querySelector("[data-eleve-statut]"),
    message: document.querySelector("[data-eleve-message]"),
    boutonSubmit: document.querySelector("[data-eleve-submit]"),
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
    elements.statut.value = "ACTIF";
    elements.motDePasse.required = true;
    elements.passwordRequired.hidden = false;
    elements.passwordHelp.textContent = "Obligatoire à la création du compte utilisateur.";
    elements.boutonSubmit.textContent = "Créer l’élève";
}

function appliquerModeModification(eleve) {
    elements.identifiant.value = eleve.idEleve;
    elements.numeroDossier.value = eleve.numeroDossier;
    elements.email.value = eleve.email;
    elements.telephone.value = eleve.telephone || "";
    elements.statut.value = eleve.statut;
    elements.motDePasse.required = false;
    elements.motDePasse.placeholder = "Laisser vide pour ne pas changer";
    elements.passwordRequired.hidden = true;
    elements.passwordHelp.textContent = "À renseigner uniquement si vous voulez réinitialiser le mot de passe.";
    elements.pageTitle.textContent = "Modifier un élève";
    elements.pageDescription.textContent = "Modifiez le dossier élève et son compte utilisateur lié.";
    elements.formTitle.textContent = "Modifier l’élève";
    elements.descriptionFormulaire.textContent = "Le dossier élève reste lié au même compte utilisateur.";
    elements.boutonSubmit.textContent = "Enregistrer les modifications";
}

function messageErreurEleve(error) {
    return error.details?.email
        || error.details?.motDePasse
        || error.details?.numeroDossier
        || error.details?.telephone
        || error.details?.statut
        || error.message;
}

async function chargerEleve() {
    if (!modeModification) {
        appliquerModeCreation();
        elements.numeroDossier.focus();
        return;
    }

    try {
        const eleve = await apiFetch(`/api/eleves/${idEleve}`);
        appliquerModeModification(eleve);
        elements.numeroDossier.focus();
    } catch (error) {
        afficherMessageForm(elements.message, error.message);
        elements.boutonSubmit.disabled = true;
    }
}

elements.formulaire.addEventListener("submit", async (event) => {
    event.preventDefault();

    const numeroDossier = elements.numeroDossier.value.trim();
    const email = elements.email.value.trim();
    const motDePasse = elements.motDePasse.value;
    const telephone = elements.telephone.value.trim();
    const statut = elements.statut.value;

    if (!numeroDossier) {
        afficherMessageForm(elements.message, "Le numéro de dossier est obligatoire.");
        elements.numeroDossier.focus();
        return;
    }

    if (!email) {
        afficherMessageForm(elements.message, "L’email est obligatoire.");
        elements.email.focus();
        return;
    }

    if (!modeModification && !motDePasse) {
        afficherMessageForm(elements.message, "Le mot de passe est obligatoire pour créer le compte utilisateur de l’élève.");
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
            await apiFetch(`/api/eleves/${idEleve}`, {
                method: "PUT",
                body: {
                    email,
                    numeroDossier,
                    telephone: telephone || null,
                    statut
                }
            });

            if (motDePasse) {
                await apiFetch(`/api/eleves/${idEleve}/mot-de-passe`, {
                    method: "PATCH",
                    body: { motDePasse }
                });
            }

            afficherToast("L’élève a été modifié.");
        } else {
            await apiFetch("/api/eleves", {
                method: "POST",
                body: {
                    email,
                    motDePasse,
                    numeroDossier,
                    telephone: telephone || null,
                    statut
                }
            });
            afficherToast("L’élève a été créé avec son compte utilisateur.");
        }

        window.setTimeout(() => {
            window.location.replace("/eleves.html");
        }, 650);
    } catch (error) {
        afficherMessageForm(elements.message, messageErreurEleve(error));
        elements.boutonSubmit.disabled = false;
    }
});

remplirSelect(elements.statut, STATUTS);
await chargerEleve();
