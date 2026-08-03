/**
 * Minimal localStorage / sessionStorage for Node.
 *
 * The driver picks a storage backend by feature-detecting these on `window`
 * (js/gitana/http/OAuth2Http.js). Without them, a driver configured for "local" or
 * "session" storage silently falls back to memory, and testAuthenticationStorage1
 * would pass without ever exercising those paths.
 *
 * This is in-memory only: it verifies the driver's storage selection and its
 * read/write/remove logic, not real browser persistence across page loads.
 */

class MemoryStorage
{
    constructor()
    {
        this._values = new Map();
    }

    get length()
    {
        return this._values.size;
    }

    key(index)
    {
        return Array.from(this._values.keys())[index] ?? null;
    }

    getItem(key)
    {
        return this._values.has(String(key)) ? this._values.get(String(key)) : null;
    }

    setItem(key, value)
    {
        this._values.set(String(key), String(value));
    }

    removeItem(key)
    {
        this._values.delete(String(key));
    }

    clear()
    {
        this._values.clear();
    }
}

export function installWebStorage()
{
    // the driver tests `'localStorage' in window`, and the legacy tests call
    // localStorage/sessionStorage as bare globals
    var local = new MemoryStorage();
    var session = new MemoryStorage();

    globalThis.window.localStorage = local;
    globalThis.window.sessionStorage = session;

    globalThis.localStorage = local;
    globalThis.sessionStorage = session;
}
