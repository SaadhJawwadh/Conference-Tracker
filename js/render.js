/* ======================================================
   Publication Scout – Rendering & Modals (XSS-Safe + A11y)
   ====================================================== */

import { state } from './state.js';
import { getGoogleCalendarUrl } from './calendar.js';
import {
    sanitize,
    safeUrl,
    daysUntil,
    formatDeadlineDate,
    getDeadlineStatus,
    getEarliestDeadline,
    showToast
} from './utils.js';

export function renderConferenceRow(conf) {
    const earliest = getEarliestDeadline(conf);
    const earliestDays = daysUntil(earliest);
    const status = getDeadlineStatus(earliestDays);
    const rowClass = conf.isTopTier ? 'row-top-tier' : (conf.rank === 'A' ? 'row-high-rank' : '');
    const isBookmarked = state.bookmarkedIds.has(conf.id);
    const note = state.notesMap[conf.id] || '';

    let daysBadgeHTML = '';
    if (earliestDays !== null) {
        if (earliestDays < 0) {
            daysBadgeHTML = `<span class="days-badge days-closed">Closed</span>`;
        } else if (earliestDays === 0) {
            daysBadgeHTML = `<span class="days-badge days-urgent">⚠ Due Today!</span>`;
        } else {
            const statusClass = status === 'urgent' ? 'days-urgent' : status === 'soon' ? 'days-soon' : 'days-open';
            daysBadgeHTML = `<span class="days-badge ${statusClass}">${earliestDays} day${earliestDays !== 1 ? 's' : ''} left</span>`;
        }
    }

    const extendedHTML = conf.extendedDeadline ? `<span class="badge-extended">⟳ Extended</span>` : '';

    let rankClass = 'rank-q1';
    if (conf.rank === 'A*') rankClass = 'rank-a-star';
    else if (conf.rank === 'A') rankClass = 'rank-a';
    else if (conf.rank === 'B' || conf.rank === 'Unranked') rankClass = 'rank-q1';

    const hIndexHTML = conf.hIndex ? `<span class="h-index">H-index: <span>${Number(conf.hIndex)}</span></span>` : '';
    const scimagoHTML = conf.scimagoQ ? `<span class="h-index">Scimago: <span>${sanitize(conf.scimagoQ)}</span></span>` : '';
    const dataSourceHTML = conf.dataSource === 'curated'
        ? `<span class="source-badge source-curated">Curated</span>`
        : `<span class="source-badge source-live">${sanitize(conf.dataSource || 'LIVE')}</span>`;

    const typeBadgeHTML = conf.type === 'journal'
        ? `<span class="source-badge type-journal">Journal</span>`
        : `<span class="source-badge type-conference">Conf</span>`;

    const isClosed = earliestDays !== null && earliestDays < 0;
    const btnClass = isClosed ? 'btn-submit btn-submit-closed' : 'btn-submit';
    const btnText = isClosed ? 'Closed' : 'Submit →';
    const btnTarget = isClosed ? '' : `target="_blank" rel="noopener noreferrer"`;
    const safeLink = safeUrl(conf.link);
    const gcalUrl = getGoogleCalendarUrl(conf);

    return `
        <tr class="${rowClass}" data-id="${sanitize(conf.id)}">
            <td class="td-bookmark" data-label="Bookmark">
                <button class="btn-star ${isBookmarked ? 'starred' : ''}" data-id="${sanitize(conf.id)}" title="${isBookmarked ? 'Remove bookmark' : 'Bookmark'}" aria-label="${isBookmarked ? `Remove bookmark for ${sanitize(conf.acronym)}` : `Bookmark ${sanitize(conf.acronym)}`}" aria-pressed="${isBookmarked}">
                    ${isBookmarked ? '★' : '☆'}
                </button>
            </td>
            <td data-label="Conference">
                <div class="conf-name-cell">
                    <div class="conf-name">
                        ${conf.isTopTier ? '<span class="star-icon" aria-hidden="true">⭐</span>' : ''}
                        <span>${sanitize(conf.name)}</span>
                        <span class="conf-acronym">${sanitize(conf.acronym)}</span>
                    </div>
                    <div class="conf-meta-row">
                        ${typeBadgeHTML}
                        <span class="conf-topic">${sanitize(conf.topic)}</span>
                        ${dataSourceHTML}
                    </div>
                </div>
            </td>
            <td data-label="Quality">
                <div class="quality-cell">
                    ${conf.rank && conf.rank !== 'TBD' ? `<span class="rank-badge ${rankClass}">CORE ${sanitize(conf.rank)}</span>` : '<span class="rank-badge rank-tbd">TBD</span>'}
                    ${hIndexHTML}
                    ${scimagoHTML}
                </div>
            </td>
            <td data-label="Location & Date">
                <div class="location-cell">
                    <span class="location-place">${sanitize(conf.locationFlag)} ${sanitize(conf.location)}</span>
                    <span class="location-date">${sanitize(conf.confDate)}</span>
                </div>
            </td>
            <td data-label="Deadline">
                <div class="deadline-cell">
                    <div class="deadline-dates">
                        ${conf.abstractDeadline ? `<div><span class="deadline-label">Abstract</span> <span class="deadline-date">${formatDeadlineDate(conf.abstractDeadline)}</span></div>` : ''}
                        <div><span class="deadline-label">Paper</span> <span class="deadline-date">${formatDeadlineDate(conf.paperDeadline)}</span></div>
                    </div>
                    ${daysBadgeHTML}
                    ${extendedHTML}
                </div>
            </td>
            <td data-label="Platform"><span class="platform-badge">${sanitize(conf.platform || '—')}</span></td>
            <td data-label="Actions">
                <div class="action-cell">
                    <a href="${safeLink}" class="${btnClass}" ${btnTarget}>${btnText}</a>
                    <div class="cal-actions">
                        <button class="btn-cal" data-ics-id="${sanitize(conf.id)}" title="Download .ics calendar file" aria-label="Download calendar event for ${sanitize(conf.acronym)}">📅 .ics</button>
                        <a href="${safeUrl(gcalUrl)}" target="_blank" rel="noopener noreferrer" class="btn-cal-link" title="Add to Google Calendar" aria-label="Add ${sanitize(conf.acronym)} to Google Calendar">GCal</a>
                    </div>
                </div>
            </td>
            <td class="td-notes" data-label="Notes">
                <div class="notes-cell" data-id="${sanitize(conf.id)}" role="button" tabindex="0" aria-label="Edit notes for ${sanitize(conf.acronym)}">
                    ${note
                        ? `<span class="note-text" title="${sanitize(note)}">${sanitize(note.length > 40 ? note.slice(0, 40) + '…' : note)}</span>`
                        : `<span class="note-placeholder">+ Add note</span>`
                    }
                </div>
            </td>
        </tr>
    `;
}

export function renderTable(data) {
    const tbody = document.getElementById('conferenceBody');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.getElementById('tableContainer');
    const paginationControls = document.getElementById('paginationControls');
    const resultsRange = document.getElementById('resultsRange');

    if (data.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'flex';
        paginationControls.style.display = 'none';
        if (resultsRange) resultsRange.textContent = 'Showing 0 results';
        return;
    }

    tableContainer.style.display = '';
    emptyState.style.display = 'none';

    const perPage = state.itemsPerPage === 'all' ? data.length : Number(state.itemsPerPage);
    const totalPages = Math.max(1, Math.ceil(data.length / perPage));
    if (state.currentPage > totalPages) state.currentPage = totalPages;

    const startIdx = (state.currentPage - 1) * perPage;
    const endIdx = Math.min(startIdx + perPage, data.length);
    const pageData = data.slice(startIdx, endIdx);

    tbody.innerHTML = pageData.map(renderConferenceRow).join('');

    if (resultsRange) {
        resultsRange.textContent = `Showing ${startIdx + 1}–${endIdx} of ${data.length}`;
    }

    paginationControls.style.display = 'flex';
    document.getElementById('pageInfo').textContent = `Page ${state.currentPage} of ${totalPages}`;
    document.getElementById('prevPageBtn').disabled = state.currentPage === 1;
    document.getElementById('nextPageBtn').disabled = state.currentPage === totalPages;
}

export function updateStats(data) {
    document.getElementById('totalConferences').textContent = data.length;

    const upcoming = data.filter(c => {
        const d = daysUntil(getEarliestDeadline(c));
        return d !== null && d >= 0;
    }).length;
    document.getElementById('upcomingDeadlines').textContent = upcoming;

    const urgent = data.filter(c => {
        const d = daysUntil(getEarliestDeadline(c));
        return d !== null && d >= 0 && d <= 30;
    }).length;
    document.getElementById('urgentDeadlines').textContent = urgent;

    const topTier = data.filter(c => c.isTopTier).length;
    document.getElementById('topTierCount').textContent = topTier;
}

export function renderBookmarksPanel() {
    const list = document.getElementById('bookmarksList');
    const count = document.getElementById('bookmarkCount');
    const bookmarked = state.allConferences.filter(c => state.bookmarkedIds.has(c.id));

    count.textContent = bookmarked.length;
    count.style.display = bookmarked.length > 0 ? 'flex' : 'none';

    if (bookmarked.length === 0) {
        list.innerHTML = '<p class="bookmarks-empty">No bookmarks yet. Click ☆ on any row.</p>';
        return;
    }

    list.innerHTML = bookmarked.map(c => {
        const days = daysUntil(getEarliestDeadline(c));
        const deadline = c.paperDeadline ? formatDeadlineDate(c.paperDeadline) : '—';
        const status = getDeadlineStatus(days);
        const statusClass = status === 'closed' ? 'days-closed' : status === 'urgent' ? 'days-urgent' : status === 'soon' ? 'days-soon' : 'days-open';
        const daysText = days === null ? '—' : days < 0 ? 'Closed' : `${days}d left`;

        return `
            <div class="bookmark-item">
                <div class="bookmark-top">
                    <span class="bookmark-acronym">${sanitize(c.acronym)}</span>
                    <span class="days-badge ${statusClass}" style="font-size:0.65rem;padding:2px 8px">${daysText}</span>
                    <button class="btn-star starred bm-remove" data-id="${sanitize(c.id)}" title="Remove" aria-label="Remove bookmark for ${sanitize(c.acronym)}">✕</button>
                </div>
                <div class="bookmark-name">${sanitize(c.name)}</div>
                <div class="bookmark-deadline">📅 Paper: ${deadline}</div>
                <a href="${safeUrl(c.link)}" class="bookmark-link" target="_blank" rel="noopener noreferrer">Visit →</a>
            </div>
        `;
    }).join('');
}

export function openBookmarksPanel() {
    renderBookmarksPanel();
    const panel = document.getElementById('bookmarksPanel');
    panel.classList.add('open');
    document.getElementById('panelOverlay').classList.add('active');
    document.getElementById('bookmarksBtn')?.setAttribute('aria-expanded', 'true');
    document.getElementById('closeBookmarks')?.focus();
}

export function closeBookmarksPanel() {
    document.getElementById('bookmarksPanel').classList.remove('open');
    document.getElementById('panelOverlay').classList.remove('active');
    document.getElementById('bookmarksBtn')?.setAttribute('aria-expanded', 'false');
}

export function openNotesModal(confId, onSave) {
    const conf = state.allConferences.find(c => c.id === confId);
    if (!conf) return;

    document.getElementById('notesModal')?.remove();
    const note = state.notesMap[confId] || '';

    const modal = document.createElement('div');
    modal.id = 'notesModal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'notesModalTitle');

    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3 id="notesModalTitle">📝 Notes — ${sanitize(conf.acronym)}</h3>
                <button class="btn-icon" id="closeModal" aria-label="Close notes dialog">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>
            </div>
            <textarea class="notes-textarea" id="noteInput" placeholder="Add your notes about ${sanitize(conf.acronym)}…"></textarea>
            <div class="modal-actions">
                <button class="btn-modal-cancel" id="cancelModal">Cancel</button>
                <button class="btn-modal-save" id="saveModal">Save Note</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const textarea = modal.querySelector('#noteInput');
    textarea.value = note;
    textarea.focus();

    modal.querySelector('#saveModal').onclick = async () => {
        const val = textarea.value.trim();
        state.notesMap[confId] = val;
        await window.DB.saveNote(confId, val);
        modal.remove();
        onSave();
        showToast('📝 Note saved!');
    };
    modal.querySelector('#closeModal').onclick = () => modal.remove();
    modal.querySelector('#cancelModal').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}
