/* ======================================================
   Publication Scout – State & URL Filter Sync
   ====================================================== */

export const state = {
    allConferences: [],
    bookmarkedIds: new Set(),
    notesMap: {},
    currentSort: { field: 'deadline', direction: 'asc' },
    currentPage: 1,
    itemsPerPage: 20
};

export function getTheme() {
    return localStorage.getItem('ps-theme') || 'light';
}

export function setTheme(t) {
    localStorage.setItem('ps-theme', t);
    document.documentElement.setAttribute('data-theme', t);
    const moon = document.querySelector('.icon-moon');
    const sun = document.querySelector('.icon-sun');
    if (!moon || !sun) return;
    if (t === 'dark') {
        moon.style.display = '';
        sun.style.display = 'none';
    } else {
        moon.style.display = 'none';
        sun.style.display = '';
    }
}

const FILTER_PARAMS = [
    { key: 'q', id: 'searchInput', type: 'value', def: '' },
    { key: 'type', id: 'filterType', type: 'value', def: 'all' },
    { key: 'rank', id: 'filterRank', type: 'value', def: 'all' },
    { key: 'h', id: 'filterHIndex', type: 'value', def: 'all' },
    { key: 'topic', id: 'filterTopic', type: 'value', def: 'all' },
    { key: 'platform', id: 'filterPlatform', type: 'value', def: 'all' },
    { key: 'status', id: 'filterStatus', type: 'value', def: 'all' },
    { key: 'top', id: 'topTierOnly', type: 'checked', def: false },
    { key: 'bm', id: 'bookmarkedOnly', type: 'checked', def: false },
    { key: 'hideClosed', id: 'hideClosed', type: 'checked', def: true }
];

export function readFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    for (const f of FILTER_PARAMS) {
        const el = document.getElementById(f.id);
        if (!el || !params.has(f.key)) continue;
        const val = params.get(f.key);
        if (f.type === 'checked') {
            el.checked = val === '1' || val === 'true';
        } else {
            el.value = val;
        }
    }
}

export function syncFiltersToURL() {
    const params = new URLSearchParams();
    for (const f of FILTER_PARAMS) {
        const el = document.getElementById(f.id);
        if (!el) continue;
        const val = f.type === 'checked' ? el.checked : el.value;
        if (val !== f.def) {
            params.set(f.key, f.type === 'checked' ? (val ? '1' : '0') : val);
        }
    }
    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
}
