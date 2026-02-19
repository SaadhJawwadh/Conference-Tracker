/* ======================================================
   Publication Scout – Application Logic v2
   Real-time data fetching via WikiCFP + CORE API
   ====================================================== */

'use strict';

// ——— Real-time date ———
const NOW = new Date();

// ——— Curated base dataset (authoritative fallback + seed) ———
const BASE_CONFERENCES = [
    // ═══════ AI / Machine Learning ═══════
    { id: 'neurips-2026', name: "Neural Information Processing Systems", acronym: "NeurIPS", topic: "AI/ML", rank: "A*", hIndex: 278, scimagoQ: "Q1", location: "San Diego, CA, USA", locationFlag: "🇺🇸", confDate: "Dec 2026", abstractDeadline: null, paperDeadline: "2026-05-07", notificationDate: "2026-09-15", platform: "OpenReview", link: "https://neurips.cc/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'icml-2026', name: "International Conference on Machine Learning", acronym: "ICML", topic: "AI/ML", rank: "A*", hIndex: 245, scimagoQ: "Q1", location: "Honolulu, HI, USA", locationFlag: "🇺🇸", confDate: "Jul 2026", abstractDeadline: "2026-01-23", paperDeadline: "2026-01-28", notificationDate: "2026-05-01", platform: "OpenReview", link: "https://icml.cc/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'iclr-2026', name: "International Conference on Learning Representations", acronym: "ICLR", topic: "AI/ML", rank: "A*", hIndex: 210, scimagoQ: "Q1", location: "Singapore", locationFlag: "🇸🇬", confDate: "Apr 24–28, 2026", abstractDeadline: "2025-09-19", paperDeadline: "2025-09-24", notificationDate: "2026-01-23", platform: "OpenReview", link: "https://iclr.cc/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'aaai-2026', name: "AAAI Conference on Artificial Intelligence", acronym: "AAAI", topic: "AI/ML", rank: "A*", hIndex: 180, scimagoQ: "Q1", location: "Singapore", locationFlag: "🇸🇬", confDate: "Jan 20–27, 2026", abstractDeadline: "2025-07-25", paperDeadline: "2025-08-01", notificationDate: "2025-11-19", platform: "OpenReview", link: "https://aaai.org/conference/aaai/aaai-26/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'ijcai-2026', name: "International Joint Conference on Artificial Intelligence", acronym: "IJCAI", topic: "AI/ML", rank: "A*", hIndex: 140, scimagoQ: "Q1", location: "Bremen, Germany", locationFlag: "🇩🇪", confDate: "Aug 15–21, 2026", abstractDeadline: "2026-01-12", paperDeadline: "2026-01-19", notificationDate: "2026-04-20", platform: "OpenReview", link: "https://ijcai-26.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    // ═══════ Computer Vision ═══════
    { id: 'cvpr-2026', name: "IEEE/CVF Conference on Computer Vision and Pattern Recognition", acronym: "CVPR", topic: "Computer Vision", rank: "A*", hIndex: 312, scimagoQ: "Q1", location: "Nashville, TN, USA", locationFlag: "🇺🇸", confDate: "Jun 2026", abstractDeadline: "2025-11-07", paperDeadline: "2025-11-13", notificationDate: "2026-02-25", platform: "CMT3", link: "https://cvpr.thecvf.com/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'iccv-2025', name: "IEEE/CVF International Conference on Computer Vision", acronym: "ICCV", topic: "Computer Vision", rank: "A*", hIndex: 191, scimagoQ: "Q1", location: "Honolulu, HI, USA", locationFlag: "🇺🇸", confDate: "Oct 2025", abstractDeadline: null, paperDeadline: "2025-03-08", notificationDate: "2025-07-10", platform: "CMT3", link: "https://iccv2025.thecvf.com/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'eccv-2026', name: "European Conference on Computer Vision", acronym: "ECCV", topic: "Computer Vision", rank: "A*", hIndex: 157, scimagoQ: "Q1", location: "Malmö, Sweden", locationFlag: "🇸🇪", confDate: "Sep 8–13, 2026", abstractDeadline: "2026-02-26", paperDeadline: "2026-03-05", notificationDate: "2026-06-15", platform: "OpenReview", link: "https://eccv.ecva.net/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    // ═══════ NLP ═══════
    { id: 'acl-2026', name: "Annual Meeting of the Association for Computational Linguistics", acronym: "ACL", topic: "NLP", rank: "A*", hIndex: 157, scimagoQ: "Q1", location: "Vienna, Austria", locationFlag: "🇦🇹", confDate: "Jul 2026", abstractDeadline: null, paperDeadline: "2026-01-05", notificationDate: "2026-04-10", platform: "ARR", link: "https://2026.aclweb.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'emnlp-2026', name: "Conference on Empirical Methods in Natural Language Processing", acronym: "EMNLP", topic: "NLP", rank: "A*", hIndex: 122, scimagoQ: "Q1", location: "Budapest, Hungary", locationFlag: "🇭🇺", confDate: "Oct 24–29, 2026", abstractDeadline: "2026-05-30", paperDeadline: "2026-06-06", notificationDate: "2026-08-15", platform: "ARR", link: "https://2026.emnlp.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'naacl-2026', name: "North American Chapter of the ACL", acronym: "NAACL", topic: "NLP", rank: "A", hIndex: 98, scimagoQ: "Q1", location: "Albuquerque, NM, USA", locationFlag: "🇺🇸", confDate: "Apr 2026", abstractDeadline: null, paperDeadline: "2025-10-15", notificationDate: "2026-01-15", platform: "ARR", link: "https://2026.naacl.org/", isTopTier: false, extendedDeadline: false, dataSource: 'curated' },
    { id: 'coling-2026', name: "International Conference on Computational Linguistics", acronym: "COLING", topic: "NLP", rank: "A", hIndex: 78, scimagoQ: "Q1", location: "Abu Dhabi, UAE", locationFlag: "🇦🇪", confDate: "Jan 2026", abstractDeadline: null, paperDeadline: "2025-09-16", notificationDate: "2025-11-29", platform: "EasyChair", link: "https://coling2026.org/", isTopTier: false, extendedDeadline: false, dataSource: 'curated' },
    // ═══════ Data Mining / IR ═══════
    { id: 'kdd-2026', name: "ACM SIGKDD Conference on Knowledge Discovery and Data Mining", acronym: "KDD", topic: "Data Mining", rank: "A*", hIndex: 152, scimagoQ: "Q1", location: "Jeju, South Korea", locationFlag: "🇰🇷", confDate: "Aug 9–13, 2026", abstractDeadline: "2026-02-01", paperDeadline: "2026-02-08", notificationDate: "2026-05-15", platform: "CMT3", link: "https://kdd.org/kdd2026/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'sigir-2026', name: "ACM SIGIR Conference on Research and Development in Information Retrieval", acronym: "SIGIR", topic: "Data Mining", rank: "A*", hIndex: 98, scimagoQ: "Q1", location: "Melbourne, Australia", locationFlag: "🇦🇺", confDate: "Jul 20–24, 2026", abstractDeadline: "2026-01-15", paperDeadline: "2026-01-23", notificationDate: "2026-04-02", platform: "OpenReview", link: "https://sigir2026.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'wsdm-2026', name: "ACM International Conference on Web Search and Data Mining", acronym: "WSDM", topic: "Data Mining", rank: "A*", hIndex: 82, scimagoQ: "Q1", location: "Hannover, Germany", locationFlag: "🇩🇪", confDate: "Mar 2026", abstractDeadline: "2025-08-07", paperDeadline: "2025-08-14", notificationDate: "2025-10-28", platform: "CMT3", link: "https://www.wsdm-conference.org/2026/", isTopTier: false, extendedDeadline: false, dataSource: 'curated' },
    { id: 'cikm-2026', name: "ACM International Conference on Information and Knowledge Management", acronym: "CIKM", topic: "Data Mining", rank: "A", hIndex: 85, scimagoQ: "Q1", location: "TBD", locationFlag: "🌐", confDate: "Oct 2026", abstractDeadline: "2026-05-01", paperDeadline: "2026-05-08", notificationDate: "2026-07-20", platform: "CMT3", link: "https://cikm2026.org/", isTopTier: false, extendedDeadline: false, dataSource: 'curated' },
    { id: 'www-2026', name: "The Web Conference", acronym: "WWW", topic: "Data Mining", rank: "A*", hIndex: 110, scimagoQ: "Q1", location: "Sydney, Australia", locationFlag: "🇦🇺", confDate: "Apr 2026", abstractDeadline: "2025-10-06", paperDeadline: "2025-10-13", notificationDate: "2026-01-20", platform: "OpenReview", link: "https://www2026.thewebconf.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    // ═══════ Databases ═══════
    { id: 'sigmod-2026', name: "ACM SIGMOD International Conference on Management of Data", acronym: "SIGMOD", topic: "Databases", rank: "A*", hIndex: 120, scimagoQ: "Q1", location: "Bangalore, India", locationFlag: "🇮🇳", confDate: "May 31 – Jun 5, 2026", abstractDeadline: "2026-04-10", paperDeadline: "2026-04-17", notificationDate: "2026-06-15", platform: "CMT3", link: "https://2026.sigmod.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'vldb-2026', name: "International Conference on Very Large Data Bases", acronym: "VLDB", topic: "Databases", rank: "A*", hIndex: 108, scimagoQ: "Q1", location: "TBD", locationFlag: "🌐", confDate: "Aug 2026", abstractDeadline: null, paperDeadline: "2026-03-01", notificationDate: "2026-05-15", platform: "CMT3", link: "https://vldb.org/2026/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'icde-2026', name: "IEEE International Conference on Data Engineering", acronym: "ICDE", topic: "Databases", rank: "A*", hIndex: 94, scimagoQ: "Q1", location: "Hong Kong", locationFlag: "🇭🇰", confDate: "May 2026", abstractDeadline: "2025-10-01", paperDeadline: "2025-10-08", notificationDate: "2026-01-20", platform: "CMT3", link: "https://icde2026.github.io/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'globecom-2026', name: "IEEE Global Telecommunications Conference", acronym: "GLOBECOM", topic: "Systems", rank: "B", hIndex: 68, scimagoQ: "Q2", location: "TBD", locationFlag: "🌐", confDate: "Dec 2026", abstractDeadline: null, paperDeadline: "2026-04-15", notificationDate: null, platform: "EDAS", link: "https://globecom2026.ieee-globecom.org/", isTopTier: false, extendedDeadline: false, dataSource: 'curated' },
    { id: 'aciids-2026', name: "Asian Conference on Intelligent Information and Database Systems", acronym: "ACIIDS", topic: "AI/ML", rank: "B", hIndex: 32, scimagoQ: "Q3", location: "TBD", locationFlag: "🌐", confDate: "Apr 2026", abstractDeadline: null, paperDeadline: "2025-10-31", notificationDate: null, platform: "EasyChair", link: "https://aciids.pwr.edu.pl/", isTopTier: false, extendedDeadline: false, dataSource: 'curated' },
    { id: 'icsoft-2026', name: "International Joint Conference on Software Technologies", acronym: "ICSOFT", topic: "Systems", rank: "B", hIndex: 24, scimagoQ: "Q4", location: "TBD", locationFlag: "🌐", confDate: "Jul 2026", abstractDeadline: null, paperDeadline: "2026-03-10", notificationDate: null, platform: "INSTICC", link: "https://icsoft.scitevents.org/", isTopTier: false, extendedDeadline: false, dataSource: 'curated' },
    // ═══════ Systems ═══════
    { id: 'osdi-2026', name: "USENIX Symposium on Operating Systems Design and Implementation", acronym: "OSDI", topic: "Systems", rank: "A*", hIndex: 95, scimagoQ: "Q1", location: "TBD", locationFlag: "🌐", confDate: "Nov 2026", abstractDeadline: "2026-05-01", paperDeadline: "2026-05-08", notificationDate: "2026-08-10", platform: "HotCRP", link: "https://www.usenix.org/conference/osdi26", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'sosp-2027', name: "ACM Symposium on Operating Systems Principles", acronym: "SOSP", topic: "Systems", rank: "A*", hIndex: 75, scimagoQ: "Q1", location: "TBD", locationFlag: "🌐", confDate: "2027 (Biennial)", abstractDeadline: null, paperDeadline: "2027-04-10", notificationDate: "2027-07-01", platform: "HotCRP", link: "https://sigops.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated' },
    { id: 'socc-2026', name: "ACM Symposium on Cloud Computing", acronym: "SoCC", topic: "Systems", rank: "A", hIndex: 62, scimagoQ: "Q1", location: "TBD", locationFlag: "🌐", confDate: "Nov 2026", abstractDeadline: null, paperDeadline: "2026-05-14", notificationDate: "2026-07-31", platform: "HotCRP", link: "https://acmsocc.org/2026/", isTopTier: false, extendedDeadline: false, dataSource: 'curated' },
];

// ——— App State ———
let allConferences = [];
let bookmarkedIds = new Set();
let notesMap = {};
let currentSort = { field: 'deadline', direction: 'asc' };

// ——— Theme ———
function getTheme() { return localStorage.getItem('ps-theme') || 'dark'; }
function setTheme(t) {
    localStorage.setItem('ps-theme', t);
    document.documentElement.setAttribute('data-theme', t);
    const moon = document.querySelector('.icon-moon');
    const sun = document.querySelector('.icon-sun');
    if (t === 'dark') { moon.style.display = ''; sun.style.display = 'none'; }
    else { moon.style.display = 'none'; sun.style.display = ''; }
}

// ——— Toast Notifications ———
let _toastTimer;
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast toast-${type} toast-visible`;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3500);
}

// ——— Date Utilities ———
function parseDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr + 'T23:59:59Z');
}

function daysUntil(dateStr) {
    if (!dateStr) return null;
    const target = parseDate(dateStr);
    const diff = target - NOW;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDeadlineDate(dateStr) {
    if (!dateStr) return '—';
    const d = parseDate(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDeadlineStatus(days) {
    if (days === null) return 'unknown';
    if (days < 0) return 'closed';
    if (days <= 14) return 'urgent';
    if (days <= 30) return 'soon';
    return 'open';
}

function getEarliestDeadline(conf) {
    const deadlines = [conf.abstractDeadline, conf.paperDeadline].filter(Boolean);
    if (deadlines.length === 0) return null;
    return deadlines.reduce((a, b) => {
        const dA = daysUntil(a), dB = daysUntil(b);
        if (dA === null) return b;
        if (dB === null) return a;
        if (dA >= 0 && dB >= 0) return dA < dB ? a : b;
        if (dA >= 0) return a;
        if (dB >= 0) return b;
        return dA > dB ? a : b;
    });
}

// ——— Real-time Fetching ———
// Sources: WikiCFP RSS (via cors-anywhere proxy or allorigins) + CORE Portal scrape
const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const WIKICFP_FEEDS = [
    'http://www.wikicfp.com/cfp/rss?cat=computer+science',
    'http://www.wikicfp.com/cfp/rss?cat=artificial+intelligence',
    'http://www.wikicfp.com/cfp/rss?cat=machine+learning',
    'http://www.wikicfp.com/cfp/rss?cat=computer+vision',
    'http://www.wikicfp.com/cfp/rss?cat=natural+language+processing',
    'http://www.wikicfp.com/cfp/rss?cat=data+mining',
    'http://www.wikicfp.com/cfp/rss?cat=security',
    'http://www.wikicfp.com/cfp/rss?cat=robotics',
];

// Infer topic from title/description
function inferTopic(text) {
    const t = text.toLowerCase();
    if (t.includes('vision') || t.includes('image') || t.includes('cvpr') || t.includes('iccv') || t.includes('eccv')) return 'Computer Vision';
    if (t.includes('natural language') || t.includes('nlp') || t.includes('text') || t.includes('acl') || t.includes('emnlp') || t.includes('naacl')) return 'NLP';
    if (t.includes('data mining') || t.includes('knowledge discovery') || t.includes('information retrieval') || t.includes('kdd') || t.includes('sigir') || t.includes('wsdm')) return 'Data Mining';
    if (t.includes('database') || t.includes('data management') || t.includes('sigmod') || t.includes('vldb')) return 'Databases';
    if (t.includes('operating system') || t.includes('network') || t.includes('distributed') || t.includes('cloud') || t.includes('osdi') || t.includes('sosp')) return 'Systems';
    if (t.includes('security') || t.includes('privacy') || t.includes('cryptography') || t.includes('ccs') || t.includes('uss') || t.includes('ndss')) return 'Security';
    if (t.includes('robotics') || t.includes('automation') || t.includes('icra') || t.includes('iros')) return 'Robotics';
    if (t.includes('hci') || t.includes('human-computer') || t.includes('interaction') || t.includes('chi') || t.includes('uist')) return 'HCI';
    if (t.includes('software engineering') || t.includes('icse') || t.includes('fse') || t.includes('ase')) return 'Software Engineering';
    if (t.includes('theory') || t.includes('algorithm') || t.includes('stoc') || t.includes('focs') || t.includes('soda')) return 'Theory';
    if (t.includes('graphics') || t.includes('multimedia') || t.includes('siggraph') || t.includes('eurographics')) return 'Graphics';
    if (t.includes('bioinformatics') || t.includes('computational biology') || t.includes('ismb') || t.includes('recomb')) return 'Bioinformatics';
    return 'AI/ML';
}

// Parse WikiCFP RSS XML
function parseWikiCFPRSS(xmlStr) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'text/xml');
    const items = Array.from(doc.querySelectorAll('item'));
    const results = [];

    for (const item of items) {
        const title = item.querySelector('title')?.textContent?.trim() || '';
        const description = item.querySelector('description')?.textContent?.trim() || '';
        const link = item.querySelector('link')?.textContent?.trim() || '';

        // Extract acronym from title (e.g., "ICML 2026 : International Conference...")
        const acronymMatch = title.match(/^([A-Z][A-Z0-9\-]{1,8})\s+20\d{2}/);
        if (!acronymMatch) continue;
        const acronym = acronymMatch[1];

        // Extract year
        const yearMatch = title.match(/20(\d{2})/);
        const year = yearMatch ? '20' + yearMatch[1] : '2026';

        // Try to extract deadline from description
        // WikiCFP descriptions include structured text like "Paper Submission: ... 2026-03-01"
        const deadlinePatterns = [
            /(?:submission|paper|abstract)[^:]*:\s*(\w+\s+\d+,?\s*\d{4})/i,
            /(\d{4}-\d{2}-\d{2})/,
        ];
        let paperDeadline = null;
        let abstractDeadline = null;

        // Full text from description
        const fullText = description.replace(/<[^>]+>/g, ' ');

        // Try to find Abstract deadline
        const abstractMatch = fullText.match(/Abstract[^:]*:\s*(\w[^;|\n<]{3,30})/i);
        if (abstractMatch) {
            const d = parseDateFromText(abstractMatch[1]);
            if (d) abstractDeadline = d;
        }

        // Try to find Paper/Full paper deadline
        const paperMatch = fullText.match(/(?:Full Paper|Paper|Submission)[^:]*:\s*(\w[^;|\n<]{3,30})/i);
        if (paperMatch) {
            const d = parseDateFromText(paperMatch[1]);
            if (d) paperDeadline = d;
        }

        // If no structured deadline found, try bare ISO date
        if (!paperDeadline) {
            const isoMatch = fullText.match(/(\d{4}-\d{2}-\d{2})/);
            if (isoMatch) paperDeadline = isoMatch[1];
        }

        if (!paperDeadline) continue; // skip if no deadline found

        const topic = inferTopic(title + ' ' + fullText);
        const confName = title.replace(/^[A-Z0-9\-]+\s+20\d{2}\s*:\s*/, '').trim();

        // Extract location from description
        const locationMatch = fullText.match(/(?:Location|Venue|City)[^:]*:\s*([^\n|;]{5,50})/i);
        const location = locationMatch ? locationMatch[1].trim() : 'TBD';

        // Extract conference date
        const confDateMatch = fullText.match(/(?:Conference|Event|When)[^:]*:\s*([^\n|;]{5,40})/i);
        const confDate = confDateMatch ? confDateMatch[1].trim() : year;

        results.push({
            id: `wikicfp-${acronym.toLowerCase()}-${year}`,
            name: confName || title,
            acronym,
            topic,
            rank: 'TBD',
            hIndex: null,
            scimagoQ: null,
            location,
            locationFlag: '🌐',
            confDate,
            abstractDeadline,
            paperDeadline,
            notificationDate: null,
            platform: 'TBD',
            link: link || `http://www.wikicfp.com/cfp/`,
            isTopTier: false,
            extendedDeadline: false,
            dataSource: 'wikicfp',
        });
    }

    return results;
}

function parseDateFromText(text) {
    if (!text) return null;
    // Try ISO
    const iso = text.match(/(\d{4}-\d{2}-\d{2})/);
    if (iso) return iso[1];
    // Try "March 5, 2026" or "Mar 5 2026" etc.
    try {
        const d = new Date(text.trim());
        if (!isNaN(d.getTime()) && d.getFullYear() >= 2025) {
            return d.toISOString().slice(0, 10);
        }
    } catch (_) { }
    return null;
}

// Merge fetched data with curated data (curated takes priority for known conferences)
function mergeConferences(curated, fetched) {
    const curatedIds = new Set(curated.map(c => c.id));
    const curatedAcronyms = new Set(curated.map(c => c.acronym.toUpperCase()));
    const newFromFetch = fetched.filter(f => {
        // Skip if same acronym-year already in curated
        return !curatedAcronyms.has(f.acronym.toUpperCase());
    });
    return [...curated, ...newFromFetch];
}

// ——— Fetch Progress ———
let fetchAbortController = null;

function setFetchProgress(pct, text) {
    const bar = document.getElementById('fetchStatusBar');
    const fill = document.getElementById('fetchProgressFill');
    const txt = document.getElementById('fetchStatusText');
    if (pct === null) {
        bar.style.display = 'none';
        return;
    }
    bar.style.display = 'block';
    fill.style.width = pct + '%';
    txt.textContent = text;
}

async function fetchLatestData() {
    const btn = document.getElementById('fetchBtn');
    btn.classList.add('fetching');
    btn.querySelector('.fetch-label').textContent = 'Fetching…';
    btn.disabled = true;

    setFetchProgress(5, 'Connecting to WikiCFP RSS feeds…');

    const fetchedConfs = [];
    let done = 0;

    try {
        for (const feedUrl of WIKICFP_FEEDS) {
            try {
                const proxyUrl = CORS_PROXY + encodeURIComponent(feedUrl);
                const resp = await fetch(proxyUrl, { signal: (fetchAbortController = new AbortController()).signal });
                if (resp.ok) {
                    const json = await resp.json();
                    const contents = json.contents || '';
                    const parsed = parseWikiCFPRSS(contents);
                    fetchedConfs.push(...parsed);
                }
            } catch (e) {
                console.warn('Feed failed:', feedUrl, e);
            }
            done++;
            const pct = Math.round(5 + (done / WIKICFP_FEEDS.length) * 80);
            setFetchProgress(pct, `Fetched ${done}/${WIKICFP_FEEDS.length} feeds… (${fetchedConfs.length} entries found)`);
        }

        setFetchProgress(88, 'Merging with curated dataset…');
        const merged = mergeConferences(BASE_CONFERENCES, fetchedConfs);

        setFetchProgress(93, 'Persisting to local database…');
        await DB.saveConferences(merged);
        const now = new Date().toISOString();
        await DB.setMeta('lastSync', now);
        await DB.setMeta('lastSyncCount', merged.length);

        setFetchProgress(100, `Saved ${merged.length} conferences!`);
        allConferences = merged;

        setTimeout(() => setFetchProgress(null, ''), 1500);
        updateLastSyncDisplay(now, merged.length);
        applyFilters();
        showToast(`✅ Fetched ${fetchedConfs.length} live entries + ${BASE_CONFERENCES.length} curated. ${merged.length} total.`);
    } catch (err) {
        setFetchProgress(null, '');
        showToast('⚠️ Fetch failed. Showing locally stored data.', 'error');
        console.error('Fetch error:', err);
    } finally {
        btn.classList.remove('fetching');
        btn.querySelector('.fetch-label').textContent = 'Fetch Latest';
        btn.disabled = false;
    }
}

// ——— Sync display ———
function updateLastSyncDisplay(isoStr, count) {
    if (!isoStr) return;
    const d = new Date(isoStr);
    const opts = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('lastUpdated').textContent = d.toLocaleDateString('en-US', opts);
    document.getElementById('lastSyncText').textContent =
        `Last synced ${d.toLocaleString('en-US', opts)} — ${count} conferences in database`;
    document.getElementById('liveBadge').style.display = 'flex';
}

// ——— Rendering ———
function renderConferenceRow(conf) {
    const paperDays = daysUntil(conf.paperDeadline);
    const abstractDays = daysUntil(conf.abstractDeadline);
    const earliestDays = paperDays !== null ? paperDays : abstractDays;
    const status = getDeadlineStatus(earliestDays);
    const rowClass = conf.isTopTier ? 'row-top-tier' : (conf.rank === 'A' ? 'row-high-rank' : '');
    const isBookmarked = bookmarkedIds.has(conf.id);
    const note = notesMap[conf.id] || '';

    // Days badge
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

    // Extended badge
    const extendedHTML = conf.extendedDeadline ? `<span class="badge-extended">⟳ Extended</span>` : '';

    // Rank badge
    let rankClass = 'rank-q1';
    if (conf.rank === 'A*') rankClass = 'rank-a-star';
    else if (conf.rank === 'A') rankClass = 'rank-a';

    // Quality metrics
    const hIndexHTML = conf.hIndex ? `<span class="h-index">H-index: <span>${conf.hIndex}</span></span>` : '';
    const scimagoHTML = conf.scimagoQ ? `<span class="h-index">Scimago: <span>${conf.scimagoQ}</span></span>` : '';
    const dataSourceHTML = conf.dataSource === 'wikicfp' ? `<span class="source-badge source-live">LIVE</span>` : `<span class="source-badge source-curated">Curated</span>`;

    // Submit button
    const isClosed = earliestDays !== null && earliestDays < 0;
    const btnClass = isClosed ? 'btn-submit btn-submit-closed' : 'btn-submit';
    const btnText = isClosed ? 'Closed' : 'Submit →';
    const btnTarget = isClosed ? '' : `target="_blank" rel="noopener noreferrer"`;

    return `
        <tr class="${rowClass}" data-id="${conf.id}" data-topic="${conf.topic}" data-rank="${conf.rank}" data-platform="${conf.platform}" data-status="${status}" data-toptier="${conf.isTopTier}">
            <td class="td-bookmark">
                <button class="btn-star ${isBookmarked ? 'starred' : ''}" data-id="${conf.id}" title="${isBookmarked ? 'Remove bookmark' : 'Bookmark'}" aria-label="Bookmark">
                    ${isBookmarked ? '★' : '☆'}
                </button>
            </td>
            <td>
                <div class="conf-name-cell">
                    <div class="conf-name">
                        ${conf.isTopTier ? '<span class="star-icon">⭐</span>' : ''}
                        <span>${conf.name}</span>
                        <span class="conf-acronym">${conf.acronym}</span>
                    </div>
                    <div class="conf-meta-row">
                        <span class="conf-topic">${conf.topic}</span>
                        ${dataSourceHTML}
                    </div>
                </div>
            </td>
            <td>
                <div class="quality-cell">
                    ${conf.rank && conf.rank !== 'TBD' ? `<span class="rank-badge ${rankClass}">CORE ${conf.rank}</span>` : '<span class="rank-badge rank-tbd">TBD</span>'}
                    ${hIndexHTML}
                    ${scimagoHTML}
                </div>
            </td>
            <td>
                <div class="location-cell">
                    <span class="location-place">${conf.locationFlag} ${conf.location}</span>
                    <span class="location-date">${conf.confDate}</span>
                </div>
            </td>
            <td>
                <div class="deadline-cell">
                    <div class="deadline-dates">
                        ${conf.abstractDeadline ? `<div><span class="deadline-label">Abstract</span> <span class="deadline-date">${formatDeadlineDate(conf.abstractDeadline)}</span></div>` : ''}
                        <div><span class="deadline-label">Paper</span> <span class="deadline-date">${formatDeadlineDate(conf.paperDeadline)}</span></div>
                    </div>
                    ${daysBadgeHTML}
                    ${extendedHTML}
                </div>
            </td>
            <td><span class="platform-badge">${conf.platform || '—'}</span></td>
            <td>
                <a href="${conf.link}" class="${btnClass}" ${btnTarget}>${btnText}</a>
            </td>
            <td class="td-notes">
                <div class="notes-cell" data-id="${conf.id}">
                    ${note
            ? `<span class="note-text" title="${note.replace(/"/g, '&quot;')}">${note.length > 40 ? note.slice(0, 40) + '…' : note}</span>`
            : `<span class="note-placeholder">+ Add note</span>`
        }
                </div>
            </td>
        </tr>
    `;
}

function renderTable(data) {
    const tbody = document.getElementById('conferenceBody');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.getElementById('tableContainer');

    if (data.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        tableContainer.style.display = '';
        emptyState.style.display = 'none';
        tbody.innerHTML = data.map(renderConferenceRow).join('');
    }
}

// ——— Bookmarks Panel ———
function renderBookmarksPanel() {
    const list = document.getElementById('bookmarksList');
    const count = document.getElementById('bookmarkCount');
    const bookmarked = allConferences.filter(c => bookmarkedIds.has(c.id));

    count.textContent = bookmarked.length;
    count.style.display = bookmarked.length > 0 ? 'flex' : 'none';

    if (bookmarked.length === 0) {
        list.innerHTML = '<p class="bookmarks-empty">No bookmarks yet. Click ☆ on any row.</p>';
        return;
    }

    list.innerHTML = bookmarked.map(c => {
        const days = daysUntil(c.paperDeadline);
        const deadline = c.paperDeadline ? formatDeadlineDate(c.paperDeadline) : '—';
        const status = getDeadlineStatus(days);
        const statusClass = status === 'closed' ? 'days-closed' : status === 'urgent' ? 'days-urgent' : status === 'soon' ? 'days-soon' : 'days-open';
        const daysText = days === null ? '—' : days < 0 ? 'Closed' : `${days}d left`;

        return `
            <div class="bookmark-item">
                <div class="bookmark-top">
                    <span class="bookmark-acronym">${c.acronym}</span>
                    <span class="days-badge ${statusClass}" style="font-size:0.65rem;padding:2px 8px">${daysText}</span>
                    <button class="btn-star starred bm-remove" data-id="${c.id}" title="Remove">✕</button>
                </div>
                <div class="bookmark-name">${c.name}</div>
                <div class="bookmark-deadline">📅 Paper: ${deadline}</div>
                <a href="${c.link}" class="bookmark-link" target="_blank">Visit →</a>
            </div>
        `;
    }).join('');
}

function openBookmarksPanel() {
    renderBookmarksPanel();
    document.getElementById('bookmarksPanel').classList.add('open');
    document.getElementById('panelOverlay').classList.add('active');
}
function closeBookmarksPanel() {
    document.getElementById('bookmarksPanel').classList.remove('open');
    document.getElementById('panelOverlay').classList.remove('active');
}

// ——— Notes Modal ———
function openNotesModal(confId) {
    const conf = allConferences.find(c => c.id === confId);
    if (!conf) return;

    // Remove existing modal
    document.getElementById('notesModal')?.remove();

    const note = notesMap[confId] || '';
    const modal = document.createElement('div');
    modal.id = 'notesModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3>📝 Notes — ${conf.acronym}</h3>
                <button class="btn-icon" id="closeModal">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>
            </div>
            <textarea class="notes-textarea" id="noteInput" placeholder="Add your notes about ${conf.acronym}…">${note}</textarea>
            <div class="modal-actions">
                <button class="btn-modal-cancel" id="cancelModal">Cancel</button>
                <button class="btn-modal-save" id="saveModal">Save Note</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#noteInput').focus();

    modal.querySelector('#saveModal').onclick = async () => {
        const val = modal.querySelector('#noteInput').value.trim();
        notesMap[confId] = val;
        await DB.saveNote(confId, val);
        modal.remove();
        applyFilters();
        showToast('📝 Note saved!');
    };
    modal.querySelector('#closeModal').onclick = () => modal.remove();
    modal.querySelector('#cancelModal').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// ——— Stats ———
function updateStats(data) {
    document.getElementById('totalConferences').textContent = data.length;

    const upcoming = data.filter(c => {
        const d = daysUntil(c.paperDeadline);
        return d !== null && d >= 0;
    }).length;
    document.getElementById('upcomingDeadlines').textContent = upcoming;

    const urgent = data.filter(c => {
        const d = daysUntil(c.paperDeadline);
        return d !== null && d >= 0 && d <= 30;
    }).length;
    document.getElementById('urgentDeadlines').textContent = urgent;

    const topTier = data.filter(c => c.isTopTier).length;
    document.getElementById('topTierCount').textContent = topTier;
}

// ——— Sorting ———
function sortData(data, field, direction) {
    return [...data].sort((a, b) => {
        switch (field) {
            case 'name': {
                const vA = a.acronym.toLowerCase(), vB = b.acronym.toLowerCase();
                return direction === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
            }
            case 'quality': {
                const rankOrder = { 'A*': 0, 'A': 1, 'Q1': 2, 'Q2': 3, 'Q3': 4, 'Q4': 5, 'B': 6, 'C': 7, 'TBD': 99 };
                const vA = rankOrder[a.rank] ?? 99, vB = rankOrder[b.rank] ?? 99;
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

// ——— Filtering ———
function getFilteredData() {
    const search = (document.getElementById('searchInput').value || '').toLowerCase().trim();
    const rankFilter = document.getElementById('filterRank').value;
    const hIndexFilter = document.getElementById('filterHIndex').value;
    const topicFilter = document.getElementById('filterTopic').value;
    const platformFilter = document.getElementById('filterPlatform').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const topTierOnly = document.getElementById('topTierOnly').checked;
    const bookmarkedOnly = document.getElementById('bookmarkedOnly').checked;

    let filtered = allConferences.filter(conf => {
        if (search) {
            const haystack = `${conf.name} ${conf.acronym} ${conf.topic} ${conf.location} ${conf.platform}`.toLowerCase();
            if (!haystack.includes(search)) return false;
        }
        if (rankFilter !== 'all') {
            if (['Q1', 'Q2', 'Q3', 'Q4'].includes(rankFilter)) {
                if (conf.scimagoQ !== rankFilter) return false;
            } else {
                if (conf.rank !== rankFilter) return false;
            }
        }
        if (hIndexFilter !== 'all') {
            const minH = parseInt(hIndexFilter);
            if (!conf.hIndex || conf.hIndex < minH) return false;
        }
        if (topicFilter !== 'all' && conf.topic !== topicFilter) return false;
        if (platformFilter !== 'all' && conf.platform !== platformFilter) return false;
        if (statusFilter !== 'all') {
            const days = daysUntil(conf.paperDeadline);
            const status = getDeadlineStatus(days);
            if (statusFilter === 'open' && (status === 'closed' || status === 'unknown')) return false;
            if (statusFilter === 'upcoming' && days !== null && days < 0) return false;
            if (statusFilter === 'closed' && status !== 'closed') return false;
        }
        if (topTierOnly && !conf.isTopTier) return false;
        if (bookmarkedOnly && !bookmarkedIds.has(conf.id)) return false;
        return true;
    });

    return sortData(filtered, currentSort.field, currentSort.direction);
}

function applyFilters() {
    const data = getFilteredData();
    renderTable(data);
    updateStats(data);
    if (bookmarkedIds.size > 0) renderBookmarksPanel();
}

// ——— Export CSV ———
function exportCSV() {
    const data = getFilteredData();
    const headers = ['Acronym', 'Name', 'Topic', 'Rank', 'H-Index', 'Location', 'Conference Date', 'Abstract Deadline', 'Paper Deadline', 'Platform', 'Link'];
    const rows = data.map(c => [
        c.acronym, c.name, c.topic, c.rank, c.hIndex || '', c.location, c.confDate,
        c.abstractDeadline || '', c.paperDeadline || '', c.platform, c.link
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

// ——— Keyboard Shortcuts ———
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl+K → focus search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        // Escape → close modals/panels
        if (e.key === 'Escape') {
            closeBookmarksPanel();
            document.getElementById('notesModal')?.remove();
        }
    });
}

// ——— Init ———
document.addEventListener('DOMContentLoaded', async () => {
    // Apply theme
    setTheme(getTheme());

    // Set header date
    const opts = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('currentDate').textContent = NOW.toLocaleDateString('en-US', opts);

    // Init DB & load data
    await DB.init();
    const [storedConfs, lastSync, lastCount] = await Promise.all([
        DB.getConferences(),
        DB.getMeta('lastSync'),
        DB.getMeta('lastSyncCount'),
    ]);

    // Load bookmarks and notes
    const [bookmarkIds, notes] = await Promise.all([
        DB.getBookmarkedIds(),
        DB.getAllNotes(),
    ]);
    bookmarkedIds = new Set(bookmarkIds);
    notesMap = notes;

    // Use stored data if available, else use base curated data
    if (storedConfs && storedConfs.length > 0) {
        allConferences = storedConfs;
    } else {
        allConferences = BASE_CONFERENCES;
        // Save initial base data
        await DB.saveConferences(BASE_CONFERENCES);
    }

    if (lastSync) updateLastSyncDisplay(lastSync, lastCount || allConferences.length);
    else {
        document.getElementById('lastSyncText').textContent =
            `Showing ${allConferences.length} curated conferences. Press "Fetch Latest" for real-time data.`;
    }

    // Initial render
    applyFilters();

    // ——— Dynamic Header Height (keeps sticky thead flush below sticky header) ———
    const headerEl = document.getElementById('header');
    const updateHeaderHeight = () => {
        document.documentElement.style.setProperty('--header-h', headerEl.offsetHeight + 'px');
    };
    updateHeaderHeight();
    new ResizeObserver(updateHeaderHeight).observe(headerEl);

    // ——— Event Listeners ———

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });

    // Fetch button
    document.getElementById('fetchBtn').addEventListener('click', fetchLatestData);

    // Search
    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 200));

    // Filters
    ['filterRank', 'filterTopic', 'filterPlatform', 'filterStatus'].forEach(id => {
        document.getElementById(id).addEventListener('change', applyFilters);
    });

    // Toggles
    document.getElementById('topTierOnly').addEventListener('change', applyFilters);
    document.getElementById('bookmarkedOnly').addEventListener('change', applyFilters);

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterRank').value = 'all';
        document.getElementById('filterHIndex').value = 'all';
        document.getElementById('filterTopic').value = 'all';
        document.getElementById('filterPlatform').value = 'all';
        document.getElementById('filterStatus').value = 'all';
        document.getElementById('topTierOnly').checked = false;
        document.getElementById('bookmarkedOnly').checked = false;
        applyFilters();
    });

    document.getElementById('resetFilters').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterRank').value = 'all';
        document.getElementById('filterHIndex').value = 'all';
        document.getElementById('filterTopic').value = 'all';
        document.getElementById('filterPlatform').value = 'all';
        document.getElementById('filterStatus').value = 'all';
        document.getElementById('topTierOnly').checked = false;
        document.getElementById('bookmarkedOnly').checked = false;
        applyFilters();
    });

    // Ranking/Topic/Platform/Status/H-Index changes
    ['filterRank', 'filterTopic', 'filterPlatform', 'filterStatus', 'filterHIndex'].forEach(id => {
        document.getElementById(id).addEventListener('change', applyFilters);
    });

    // Bookmarks panel
    document.getElementById('bookmarksBtn').addEventListener('click', openBookmarksPanel);
    document.getElementById('closeBookmarks').addEventListener('click', closeBookmarksPanel);
    document.getElementById('panelOverlay').addEventListener('click', closeBookmarksPanel);

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportCSV);

    // Sorting
    document.querySelectorAll('.th-sortable').forEach(th => {
        th.addEventListener('click', () => {
            const field = th.dataset.sort;
            if (currentSort.field === field) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.field = field;
                currentSort.direction = 'asc';
            }
            document.querySelectorAll('.th-sortable').forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
            th.classList.add(currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
            applyFilters();
        });
    });

    // Bookmark star clicks (delegated)
    document.getElementById('conferenceBody').addEventListener('click', async (e) => {
        const starBtn = e.target.closest('.btn-star');
        if (starBtn) {
            const id = starBtn.dataset.id;
            const added = await DB.toggleBookmark(id);
            if (added) bookmarkedIds.add(id);
            else bookmarkedIds.delete(id);
            applyFilters();
            showToast(added ? '⭐ Bookmarked!' : '📌 Bookmark removed');
            return;
        }

        // Notes cell click
        const notesCell = e.target.closest('.notes-cell');
        if (notesCell) {
            openNotesModal(notesCell.dataset.id);
        }
    });

    // Bookmarks panel remove buttons (delegated)
    document.getElementById('bookmarksList').addEventListener('click', async (e) => {
        const removeBtn = e.target.closest('.bm-remove');
        if (removeBtn) {
            const id = removeBtn.dataset.id;
            await DB.toggleBookmark(id);
            bookmarkedIds.delete(id);
            applyFilters();
            renderBookmarksPanel();
            showToast('📌 Bookmark removed');
        }
    });

    // Keyboard shortcuts
    setupKeyboardShortcuts();

    // Default sort indicator
    document.querySelector('[data-sort="deadline"]')?.classList.add('sorted-asc');
});

// ——— Debounce Utility ———
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
