import { lireSession, supprimerSession } from "./auth.js";

export class ApiError extends Error {
    constructor(message, status, details = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

export async function apiFetch(url, options = {}) {
    const session = lireSession();
    if (!session) {
        window.location.replace("/login.html");
        throw new ApiError("Authentification requise.", 401);
    }

    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");
    headers.set("Authorization", `Bearer ${session.token}`);

    let body = options.body;
    if (body && typeof body !== "string") {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(url, { ...options, headers, body });
    } catch {
        throw new ApiError("Impossible de contacter le serveur.", 0);
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 401) {
            supprimerSession();
            window.location.replace("/login.html?session=expiree");
        }

        throw new ApiError(
            data?.message || `La requête a échoué (HTTP ${response.status}).`,
            response.status,
            data?.details || {}
        );
    }

    return data;
}
