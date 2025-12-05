// lib/api.ts
//Lina

export async function apiGet<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
        throw new Error(`GET ${url} failed: ${res.status}`);
    }

    return res.json();
}

export async function apiPost<T>(url: string, body: any): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        // ⬇️ NEW: log the response body so we can see why it failed
        const text = await res.text();
        console.error(`POST ${url} failed ${res.status}:`, text);
        throw new Error(`POST ${url} failed: ${res.status}`);
    }

    return res.json();
}

export async function apiPut<T>(url: string, body: any): Promise<T> {
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        throw new Error(`PUT ${url} failed: ${res.status}`);
    }

    return res.json();
}

export async function apiDelete<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) {
        throw new Error(`DELETE ${url} failed: ${res.status}`);
    }

    return res.json();
}
