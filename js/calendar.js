/* ======================================================
   Publication Scout – Calendar (.ics & Google Calendar)
   ====================================================== */

import { showToast } from './utils.js';

function formatICSDate(dateStr) {
    return dateStr.replace(/-/g, '');
}

function escapeICS(text) {
    return String(text || '')
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

export function downloadICS(conf) {
    const targetDate = conf.paperDeadline || conf.abstractDeadline;
    if (!targetDate) {
        showToast('⚠️ No deadline date available for calendar export.', 'error');
        return;
    }

    const events = [];
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    if (conf.abstractDeadline) {
        const d = formatICSDate(conf.abstractDeadline);
        events.push([
            'BEGIN:VEVENT',
            `UID:${conf.id}-abstract@publicationscout`,
            `DTSTAMP:${stamp}`,
            `DTSTART;VALUE=DATE:${d}`,
            `SUMMARY:${escapeICS(`${conf.acronym} Abstract Deadline`)}`,
            `DESCRIPTION:${escapeICS(`${conf.name}\nPlatform: ${conf.platform || 'TBD'}\nLink: ${conf.link || ''}`)}`,
            'END:VEVENT'
        ].join('\r\n'));
    }

    if (conf.paperDeadline) {
        const d = formatICSDate(conf.paperDeadline);
        events.push([
            'BEGIN:VEVENT',
            `UID:${conf.id}-paper@publicationscout`,
            `DTSTAMP:${stamp}`,
            `DTSTART;VALUE=DATE:${d}`,
            `SUMMARY:${escapeICS(`${conf.acronym} Paper Submission Deadline`)}`,
            `DESCRIPTION:${escapeICS(`${conf.name}\nRank: ${conf.rank || 'TBD'}\nPlatform: ${conf.platform || 'TBD'}\nLink: ${conf.link || ''}`)}`,
            'END:VEVENT'
        ].join('\r\n'));
    }

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Publication Scout//Conference Tracker//EN',
        ...events,
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conf.acronym.toLowerCase()}-deadline.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`📅 Exported ${conf.acronym} calendar (.ics)!`);
}

export function getGoogleCalendarUrl(conf) {
    const targetDate = conf.paperDeadline || conf.abstractDeadline;
    if (!targetDate) return '#';
    const d = formatICSDate(targetDate);
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `${conf.acronym} Paper Deadline`,
        dates: `${d}/${d}`,
        details: `${conf.name} (${conf.rank || 'TBD'})\nPlatform: ${conf.platform || 'TBD'}\n${conf.link || ''}`,
        location: conf.location || 'Online'
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
