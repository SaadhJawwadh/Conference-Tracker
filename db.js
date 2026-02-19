/* ======================================================
   Publication Scout – IndexedDB Persistence Layer
   ====================================================== */

const DB_NAME = 'PublicationScoutDB';
const DB_VERSION = 2;

let _db = null;

function openDB() {
    return new Promise((resolve, reject) => {
        if (_db) { resolve(_db); return; }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            // Conference store
            if (!db.objectStoreNames.contains('conferences')) {
                const store = db.createObjectStore('conferences', { keyPath: 'id' });
                store.createIndex('topic', 'topic', { unique: false });
                store.createIndex('rank', 'rank', { unique: false });
            }
            // Metadata store (last sync time, etc.)
            if (!db.objectStoreNames.contains('meta')) {
                db.createObjectStore('meta', { keyPath: 'key' });
            }
            // Bookmarks store
            if (!db.objectStoreNames.contains('bookmarks')) {
                db.createObjectStore('bookmarks', { keyPath: 'id' });
            }
            // Notes store
            if (!db.objectStoreNames.contains('notes')) {
                db.createObjectStore('notes', { keyPath: 'id' });
            }
        };
        req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
        req.onerror = (e) => reject(e.target.error);
    });
}

function tx(storeName, mode = 'readonly') {
    return _db.transaction(storeName, mode).objectStore(storeName);
}

function promisify(req) {
    return new Promise((res, rej) => {
        req.onsuccess = (e) => res(e.target.result);
        req.onerror = (e) => rej(e.target.error);
    });
}

const DB = {
    async init() { await openDB(); },

    // ——— Conferences ———
    async saveConferences(list) {
        await openDB();
        const store = tx('conferences', 'readwrite');
        for (const c of list) {
            store.put(c);
        }
        return new Promise((res, rej) => {
            store.transaction.oncomplete = res;
            store.transaction.onerror = rej;
        });
    },

    async getConferences() {
        await openDB();
        return promisify(tx('conferences').getAll());
    },

    async getConferenceCount() {
        await openDB();
        return promisify(tx('conferences').count());
    },

    // ——— Meta ———
    async setMeta(key, value) {
        await openDB();
        return promisify(tx('meta', 'readwrite').put({ key, value }));
    },

    async getMeta(key) {
        await openDB();
        const result = await promisify(tx('meta').get(key));
        return result ? result.value : null;
    },

    // ——— Bookmarks ———
    async toggleBookmark(id) {
        await openDB();
        const existing = await promisify(tx('bookmarks').get(id));
        if (existing) {
            await promisify(tx('bookmarks', 'readwrite').delete(id));
            return false; // removed
        } else {
            await promisify(tx('bookmarks', 'readwrite').put({ id, savedAt: Date.now() }));
            return true; // added
        }
    },

    async isBookmarked(id) {
        await openDB();
        const r = await promisify(tx('bookmarks').get(id));
        return !!r;
    },

    async getBookmarkedIds() {
        await openDB();
        const all = await promisify(tx('bookmarks').getAll());
        return all.map(b => b.id);
    },

    // ——— Notes ———
    async saveNote(id, note) {
        await openDB();
        return promisify(tx('notes', 'readwrite').put({ id, note, updatedAt: Date.now() }));
    },

    async getNote(id) {
        await openDB();
        const r = await promisify(tx('notes').get(id));
        return r ? r.note : '';
    },

    async getAllNotes() {
        await openDB();
        const all = await promisify(tx('notes').getAll());
        return Object.fromEntries(all.map(n => [n.id, n.note]));
    },
};

window.DB = DB;
