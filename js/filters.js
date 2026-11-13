/* ======================================================
   Publication Scout – Filtering & Sorting
   ====================================================== */

import { state } from './state.js';
import { daysUntil, getDeadlineStatus, getEarliestDeadline } from './utils.js';

export function sortData(data, field, direction) {
    return [...data].sort((a, b) => {
        switch (field) {
            case 'name': {
                const vA = (a.acronym || '').toLowerCase();
                const vB = (b.acronym || '').toLowerCase();
                return direction === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
            }
            case 'quality': {
                const rankOrder = { 'A*': 0, 'A': 1, 'Q1': 2, 'Q2': 3, 'Q3': 4, 'Q4': 5, 'B': 6, 'C': 7, 'Unranked': 8, 'TBD': 99 };
                const vA = rankOrder[a.rank] ?? 99;
                const vB = rankOrder[b.rank] ?? 99;
                if (vA !== vB) return direction === 'asc' ? vA - vB : vB - vA;
                return direction === 'asc' ? (b.hIndex || 0) - (a.hIndex || 0) : (a.hIndex || 0) - (b.hIndex || 0);
            }
            case 'deadline':
            default: {
                const dA = daysUntil(getEarliestDeadline(a)) ?? 9999;
                const dB = daysUntil(getEarliestDeadline(b)) ?? 9999;
                const adjA = dA < 0 ? 10000 - dA : dA;
                const adjB = dB < 0 ? 10000 - dB : dB;
                return direction === 'asc' ? adjA - adjB : adjB - adjA;
            }
        }
    });
}

export function getFilteredData() {
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const typeFilter = document.getElementById('filterType')?.value || 'all';
    const rankFilter = document.getElementById('filterRank')?.value || 'all';
    const quartileFilter = document.getElementById('filterQuartile')?.value || 'all';
    const hIndexFilter = document.getElementById('filterHIndex')?.value || 'all';
    const topicFilter = document.getElementById('filterTopic')?.value || 'all';
    const platformFilter = document.getElementById('filterPlatform')?.value || 'all';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    const topTierOnly = document.getElementById('topTierOnly')?.checked || false;
    const bookmarkedOnly = document.getElementById('bookmarkedOnly')?.checked || false;
    const qualityOnly = document.getElementById('qualityOnly')?.checked || false;
    const hideClosed = document.getElementById('hideClosed')?.checked || false;

    const validRanks = new Set(['A*', 'A', 'B']);
    const validQ = new Set(['Q1', 'Q2']);

    const filtered = state.allConferences.filter(conf => {
        const confType = conf.type || 'conference';
        if (typeFilter !== 'all' && confType !== typeFilter) return false;

        if (qualityOnly) {
            const isQuality =
                conf.dataSource === 'curated' ||
                validRanks.has(conf.rank) ||
                validQ.has(conf.scimagoQ) ||
                (typeof conf.hIndex === 'number' && conf.hIndex > 18);
            if (!isQuality) return false;
        }

        const earliestDays = daysUntil(getEarliestDeadline(conf));
        const status = getDeadlineStatus(earliestDays);

        if (hideClosed && status === 'closed' && statusFilter !== 'closed') {
            return false;
        }

        if (search) {
            const haystack = `${conf.name} ${conf.acronym} ${conf.topic} ${conf.location} ${conf.platform} ${confType}`.toLowerCase();
            if (!haystack.includes(search)) return false;
        }

        if (rankFilter !== 'all' && conf.rank !== rankFilter) return false;
        if (quartileFilter !== 'all' && conf.scimagoQ !== quartileFilter) return false;

        if (hIndexFilter !== 'all') {
            const minH = parseInt(hIndexFilter, 10);
            if (!conf.hIndex || conf.hIndex <= minH) return false;
        }

        if (topicFilter !== 'all' && conf.topic !== topicFilter) return false;
        if (platformFilter !== 'all' && conf.platform !== platformFilter) return false;

        if (statusFilter !== 'all') {
            if (statusFilter === 'open' && (status === 'closed' || status === 'unknown')) return false;
            if (statusFilter === 'soon' && (earliestDays === null || earliestDays < 0 || earliestDays > 30)) return false;
            if (statusFilter === 'closed' && status !== 'closed') return false;
        }

        if (topTierOnly && !conf.isTopTier) return false;
        if (bookmarkedOnly && !state.bookmarkedIds.has(conf.id)) return false;
        return true;
    });

    return sortData(filtered, state.currentSort.field, state.currentSort.direction);
}
