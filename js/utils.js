/* ======================================================
   Publication Scout – Utilities & Security
   ====================================================== */

export function sanitize(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

export function safeUrl(url) {
    if (!url) return '#';
    try {
        const parsed = new URL(String(url), window.location.href);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.href;
        }
    } catch (_) { }
    return '#';
}

export function getNow() {
    return new Date();
}

export function parseDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr + 'T23:59:59Z');
}

export function daysUntil(dateStr) {
    if (!dateStr) return null;
    const target = parseDate(dateStr);
    if (!target || isNaN(target.getTime())) return null;
    const diff = target - getNow();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDeadlineDate(dateStr) {
    if (!dateStr) return '—';
    const d = parseDate(dateStr);
    if (!d || isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getDeadlineStatus(days) {
    if (days === null) return 'unknown';
    if (days < 0) return 'closed';
    if (days <= 14) return 'urgent';
    if (days <= 30) return 'soon';
    return 'open';
}

export function getEarliestDeadline(conf) {
    const deadlines = [conf.abstractDeadline, conf.paperDeadline].filter(Boolean);
    if (deadlines.length === 0) return null;
    return deadlines.reduce((a, b) => {
        const dA = daysUntil(a);
        const dB = daysUntil(b);
        if (dA === null) return b;
        if (dB === null) return a;
        if (dA >= 0 && dB >= 0) return dA < dB ? a : b;
        if (dA >= 0) return a;
        if (dB >= 0) return b;
        return dA > dB ? a : b;
    });
}

let _toastTimer;
export function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast toast-${type} toast-visible`;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3500);
}

export function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
