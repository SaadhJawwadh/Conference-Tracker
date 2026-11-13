/* ======================================================
   Publication Scout – Main Entry Point (ES Module)
   ====================================================== */

import { state, getTheme, setTheme, readFiltersFromURL, syncFiltersToURL } from './state.js';
import { getFilteredData } from './filters.js';
import { downloadICS } from './calendar.js';
import {
    renderTable,
    updateStats,
    renderBookmarksPanel,
    openBookmarksPanel,
    closeBookmarksPanel,
    openNotesModal
} from './render.js';
import { getNow, showToast, debounce } from './utils.js';
import { initCustomDropdowns, syncCustomDropdowns } from './dropdown.js';

function setFetchProgress(pct, text) {
    const bar = document.getElementById('fetchStatusBar');
    const fill = document.getElementById('fetchProgressFill');
    const txt = document.getElementById('fetchStatusText');
    if (!bar || !fill || !txt) return;
    if (pct === null) {
        bar.style.display = 'none';
        return;
    }
    bar.style.display = 'block';
    fill.style.width = pct + '%';
    txt.textContent = text;
}

function updateLastSyncDisplay(isoStr, count) {
    if (!isoStr) return;
    const d = new Date(isoStr);
    const formattedDate = d.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('lastUpdated').textContent = formattedDate;
    document.getElementById('lastSyncText').textContent =
        `Last synced ${formattedDate} — ${count} high-quality venues in database`;
    const liveBadge = document.getElementById('liveBadge');
    if (liveBadge) liveBadge.style.display = 'flex';
}

export function applyFilters(resetPage = true) {
    if (resetPage !== false) state.currentPage = 1;
    syncFiltersToURL();
    const data = getFilteredData();
    renderTable(data);
    updateStats(data);
    renderBookmarksPanel();
}

async function fetchLatestData(isSilent = false) {
    const btn = document.getElementById('fetchBtn');
    if (!isSilent && btn) {
        btn.classList.add('fetching');
        btn.querySelector('.fetch-label').textContent = 'Fetching…';
        btn.disabled = true;
        setFetchProgress(50, 'Fetching latest conference data…');
    }

    try {
        const resp = await fetch('conferences.json');
        if (!resp.ok) throw new Error('Failed to fetch conferences.json');
        const payload = await resp.json();
        const merged = payload.data || [];

        if (!isSilent) setFetchProgress(90, 'Persisting to local database…');
        await window.DB.saveConferences(merged);
        const now = payload.metadata?.lastSync || new Date().toISOString();
        await window.DB.setMeta('lastSync', now);
        await window.DB.setMeta('lastSyncCount', merged.length);

        if (!isSilent) setFetchProgress(100, `Loaded ${merged.length} venues!`);
        state.allConferences = merged;

        if (!isSilent) setTimeout(() => setFetchProgress(null, ''), 1500);
        updateLastSyncDisplay(now, merged.length);
        applyFilters(false);
        if (!isSilent) showToast('✅ Successfully loaded latest data.');
    } catch (err) {
        if (!isSilent) {
            setFetchProgress(null, '');
            showToast('⚠️ Fetch failed. Showing locally stored data.', 'error');
        }
        console.error('Fetch error:', err);
    } finally {
        if (!isSilent && btn) {
            btn.classList.remove('fetching');
            btn.querySelector('.fetch-label').textContent = 'Fetch Latest';
            btn.disabled = false;
        }
    }
}

function resetAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterRank').value = 'all';
    document.getElementById('filterQuartile').value = 'all';
    document.getElementById('filterHIndex').value = 'all';
    document.getElementById('filterTopic').value = 'all';
    document.getElementById('filterPlatform').value = 'all';
    document.getElementById('filterStatus').value = 'all';
    document.getElementById('topTierOnly').checked = false;
    document.getElementById('bookmarkedOnly').checked = false;
    document.getElementById('qualityOnly').checked = false;
    document.getElementById('hideClosed').checked = false;
    syncCustomDropdowns();
    applyFilters();
}

function exportCSV() {
    const data = getFilteredData();
    const headers = ['Acronym', 'Name', 'Type', 'Topic', 'Rank', 'Scimago', 'H-Index', 'Location', 'Conference Date', 'Abstract Deadline', 'Paper Deadline', 'Platform', 'Link'];
    const rows = data.map(c => [
        c.acronym, c.name, c.type || 'conference', c.topic, c.rank, c.scimagoQ || '', c.hIndex || '',
        c.location, c.confDate, c.abstractDeadline || '', c.paperDeadline || '', c.platform, c.link
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conferences-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 CSV exported!');
}

function exportBookmarksJSON() {
    const payload = {
        exportedAt: new Date().toISOString(),
        bookmarks: [...state.bookmarkedIds],
        notes: state.notesMap
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `publication-scout-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Bookmarks & notes exported!');
}

async function importBookmarksJSON(file) {
    if (!file) return;
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (Array.isArray(data.bookmarks)) {
            for (const id of data.bookmarks) {
                if (!state.bookmarkedIds.has(id)) {
                    await window.DB.toggleBookmark(id);
                    state.bookmarkedIds.add(id);
                }
            }
        }
        if (data.notes && typeof data.notes === 'object') {
            for (const [id, note] of Object.entries(data.notes)) {
                if (typeof note === 'string') {
                    await window.DB.saveNote(id, note);
                    state.notesMap[id] = note;
                }
            }
        }
        applyFilters(false);
        showToast('✅ Backup imported!');
    } catch (_) {
        showToast('⚠️ Invalid backup JSON file.', 'error');
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
        if (e.key === 'Escape') {
            closeBookmarksPanel();
            document.getElementById('notesModal')?.remove();
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    setTheme(getTheme());
    document.getElementById('currentDate').textContent = getNow().toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    readFiltersFromURL();
    initCustomDropdowns();

    await window.DB.init();
    const [storedConfs, lastSync, lastCount, bookmarkIds, notes] = await Promise.all([
        window.DB.getConferences(),
        window.DB.getMeta('lastSync'),
        window.DB.getMeta('lastSyncCount'),
        window.DB.getBookmarkedIds(),
        window.DB.getAllNotes()
    ]);

    state.bookmarkedIds = new Set(bookmarkIds);
    state.notesMap = notes;

    if (storedConfs && storedConfs.length > 0) {
        state.allConferences = storedConfs;
        if (lastSync) updateLastSyncDisplay(lastSync, lastCount || storedConfs.length);
        applyFilters();
        fetchLatestData(true);
    } else {
        try {
            const curatedResp = await fetch('data/curated.json');
            state.allConferences = curatedResp.ok ? await curatedResp.json() : [];
            if (state.allConferences.length > 0) {
                await window.DB.saveConferences(state.allConferences);
            }
        } catch (_) {
            state.allConferences = [];
        }
        applyFilters();
        fetchLatestData(true);
    }

    const headerEl = document.getElementById('header');
    const updateHeaderHeight = () => {
        document.documentElement.style.setProperty('--header-h', headerEl.offsetHeight + 'px');
    };
    updateHeaderHeight();
    new ResizeObserver(updateHeaderHeight).observe(headerEl);

    document.getElementById('themeToggle').addEventListener('click', () => {
        setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });

    document.getElementById('fetchBtn').addEventListener('click', () => fetchLatestData(false));
    document.getElementById('searchInput').addEventListener('input', debounce(() => applyFilters(), 200));

    ['filterType', 'filterRank', 'filterQuartile', 'filterHIndex', 'filterTopic', 'filterPlatform', 'filterStatus', 'topTierOnly', 'bookmarkedOnly', 'qualityOnly', 'hideClosed'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => applyFilters());
    });

    document.getElementById('pageSizeSelect')?.addEventListener('change', (e) => {
        state.itemsPerPage = e.target.value === 'all' ? 'all' : Number(e.target.value);
        applyFilters(true);
    });

    document.getElementById('clearFilters').addEventListener('click', resetAllFilters);
    document.getElementById('resetFilters').addEventListener('click', resetAllFilters);

    document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            applyFilters(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
        state.currentPage++;
        applyFilters(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('bookmarksBtn').addEventListener('click', openBookmarksPanel);
    document.getElementById('closeBookmarks').addEventListener('click', closeBookmarksPanel);
    document.getElementById('panelOverlay').addEventListener('click', closeBookmarksPanel);

    document.getElementById('exportBtn').addEventListener('click', exportCSV);
    document.getElementById('exportBackupBtn')?.addEventListener('click', exportBookmarksJSON);
    document.getElementById('importBackupBtn')?.addEventListener('click', () => {
        document.getElementById('importBackupInput')?.click();
    });
    document.getElementById('importBackupInput')?.addEventListener('change', (e) => {
        importBookmarksJSON(e.target.files?.[0]);
        e.target.value = '';
    });

    document.querySelectorAll('.th-sortable').forEach(th => {
        const triggerSort = () => {
            const field = th.dataset.sort;
            if (state.currentSort.field === field) {
                state.currentSort.direction = state.currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                state.currentSort.field = field;
                state.currentSort.direction = 'asc';
            }
            document.querySelectorAll('.th-sortable').forEach(h => {
                h.classList.remove('sorted-asc', 'sorted-desc');
                h.setAttribute('aria-sort', 'none');
            });
            th.classList.add(state.currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
            th.setAttribute('aria-sort', state.currentSort.direction === 'asc' ? 'ascending' : 'descending');
            applyFilters();
        };
        th.addEventListener('click', triggerSort);
        th.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerSort();
            }
        });
    });

    document.getElementById('conferenceBody').addEventListener('click', async (e) => {
        const starBtn = e.target.closest('.btn-star');
        if (starBtn) {
            const id = starBtn.dataset.id;
            const added = await window.DB.toggleBookmark(id);
            if (added) state.bookmarkedIds.add(id);
            else state.bookmarkedIds.delete(id);
            applyFilters(false);
            showToast(added ? '⭐ Bookmarked!' : '📌 Bookmark removed');
            return;
        }

        const icsBtn = e.target.closest('.btn-cal');
        if (icsBtn) {
            const conf = state.allConferences.find(c => c.id === icsBtn.dataset.icsId);
            if (conf) downloadICS(conf);
            return;
        }

        const notesCell = e.target.closest('.notes-cell');
        if (notesCell) {
            openNotesModal(notesCell.dataset.id, () => applyFilters(false));
        }
    });

    document.getElementById('conferenceBody').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const notesCell = e.target.closest('.notes-cell');
            if (notesCell) {
                e.preventDefault();
                openNotesModal(notesCell.dataset.id, () => applyFilters(false));
            }
        }
    });

    document.getElementById('bookmarksList').addEventListener('click', async (e) => {
        const removeBtn = e.target.closest('.bm-remove');
        if (removeBtn) {
            const id = removeBtn.dataset.id;
            await window.DB.toggleBookmark(id);
            state.bookmarkedIds.delete(id);
            applyFilters(false);
            showToast('📌 Bookmark removed');
        }
    });

    setupKeyboardShortcuts();
    const defaultSortTh = document.querySelector('[data-sort="deadline"]');
    if (defaultSortTh) {
        defaultSortTh.classList.add('sorted-asc');
        defaultSortTh.setAttribute('aria-sort', 'ascending');
    }
});
