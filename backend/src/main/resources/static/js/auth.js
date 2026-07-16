const TOKEN_KEY = "token";
const USER_KEY = "utilisateur";

function decoderPayload(token) {
    try {
        const morceau = token.split(".")[1];
        if (!morceau) return null;
        const base64 = morceau.replace(/-/g, "+").replace(/_/g, "/");
        const complete = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        return JSON.parse(atob(complete));
    } catch {
        return null;
    }
}

export function lireSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const payload = decoderPayload(token);
    if (!payload || !payload.exp || Date.now() >= payload.exp * 1000) {
        supprimerSession();
        return null;
    }

    let utilisateur = null;
    try {
        utilisateur = JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        utilisateur = null;
    }

    return {
        token,
        payload,
        utilisateur: utilisateur || {
            email: payload.sub,
            role: payload.role
        }
    };
}

export function enregistrerSession(reponseConnexion) {
    localStorage.setItem(TOKEN_KEY, reponseConnexion.token);
    localStorage.setItem(USER_KEY, JSON.stringify(reponseConnexion.utilisateur));
}

export function supprimerSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function exigerConnexion(rolesAutorises = []) {
    const session = lireSession();
    if (!session) {
        window.location.replace("/login.html");
        throw new Error("Authentification requise.");
    }

    if (rolesAutorises.length && !rolesAutorises.includes(session.utilisateur.role)) {
        window.location.replace("/accueil.html?acces=refuse");
        throw new Error("Droits insuffisants.");
    }

    return session;
}

export function libelleRole(role) {
    return {
        ROLE_ADMIN: "Administrateur",
        ROLE_REFERENTE: "Référente administrative",
        ROLE_FORMATEUR: "Formateur",
        ROLE_ELEVE: "Élève"
    }[role] || role;
}
