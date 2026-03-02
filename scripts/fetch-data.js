const { XMLParser } = require('fast-xml-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const NOW = new Date();

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
    { id: 'osdi-2026', name: "USENIX Symposium on Operating Systems Design and Implementation", acronym: "OSDI", topic: "Systems", rank: "A*", hIndex: 95, scimagoQ: "Q1", location: "TBD", locationFlag: "🌐", confDate: "Nov 2026", abstractDeadline: "2026-05-01", paperDeadline: "2026-05-08", notificationDate: "2026-08-10", platform: "HotCRP", link: "https://www.usenix.org/conference/osdi26", isTopTier: true, extendedDeadline: false, dataSource: 'curated', type: 'conference' },
    { id: 'sosp-2027', name: "ACM Symposium on Operating Systems Principles", acronym: "SOSP", topic: "Systems", rank: "A*", hIndex: 75, scimagoQ: "Q1", location: "TBD", locationFlag: "🌐", confDate: "2027 (Biennial)", abstractDeadline: null, paperDeadline: "2027-04-10", notificationDate: "2027-07-01", platform: "HotCRP", link: "https://sigops.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated', type: 'conference' },
    { id: 'socc-2026', name: "ACM Symposium on Cloud Computing", acronym: "SoCC", topic: "Systems", rank: "A", hIndex: 62, scimagoQ: "Q1", location: "TBD", locationFlag: "🌐", confDate: "Nov 2026", abstractDeadline: null, paperDeadline: "2026-05-14", notificationDate: "2026-07-31", platform: "HotCRP", link: "https://acmsocc.org/2026/", isTopTier: false, extendedDeadline: false, dataSource: 'curated', type: 'conference' },
    // ═══════ Sri Lanka Regional ═══════
    { id: 'mercon-2026', name: "Moratuwa Engineering Research Conference", acronym: "MERCon", topic: "Systems", rank: "Unranked", hIndex: 12, scimagoQ: "Q4", location: "Moratuwa, Sri Lanka", locationFlag: "🇱🇰", confDate: "Jun 2026", abstractDeadline: null, paperDeadline: "2026-02-15", notificationDate: "2026-04-10", platform: "IEEE", link: "https://mercon.mrt.ac.lk/", isTopTier: false, extendedDeadline: false, dataSource: 'curated', type: 'conference' },
    { id: 'slaai-2026', name: "Sri Lanka Association for Artificial Intelligence Conference", acronym: "SLAAI", topic: "AI/ML", rank: "Unranked", hIndex: 8, scimagoQ: "Q4", location: "Colombo, Sri Lanka", locationFlag: "🇱🇰", confDate: "Dec 2026", abstractDeadline: null, paperDeadline: "2026-09-01", notificationDate: "2026-10-15", platform: "EasyChair", link: "https://slaai.lk/", isTopTier: false, extendedDeadline: false, dataSource: 'curated', type: 'conference' },
    { id: 'iciafs-2026', name: "Int. Conference on Information and Automation for Sustainability", acronym: "ICIAfS", topic: "Systems", rank: "Unranked", hIndex: 15, scimagoQ: "Q4", location: "Colombo, Sri Lanka", locationFlag: "🇱🇰", confDate: "Aug 2026", abstractDeadline: null, paperDeadline: "2026-04-20", notificationDate: "2026-06-10", platform: "IEEE", link: "http://www.iciafs.org/", isTopTier: false, extendedDeadline: false, dataSource: 'curated', type: 'conference' },
    // ═══════ Journals ═══════
    { id: 'tpami-2026', name: "IEEE Transactions on Pattern Analysis and Machine Intelligence", acronym: "TPAMI", topic: "Computer Vision", rank: "A*", hIndex: 405, scimagoQ: "Q1", location: "Journal", locationFlag: "📖", confDate: "Continuous", abstractDeadline: null, paperDeadline: "2026-12-31", notificationDate: null, platform: "ScholarOne", link: "https://www.computer.org/csdl/journal/tp", isTopTier: true, extendedDeadline: false, dataSource: 'curated', type: 'journal' },
    { id: 'jmlr-2026', name: "Journal of Machine Learning Research", acronym: "JMLR", topic: "AI/ML", rank: "A*", hIndex: 265, scimagoQ: "Q1", location: "Journal", locationFlag: "📖", confDate: "Continuous", abstractDeadline: null, paperDeadline: "2026-12-31", notificationDate: null, platform: "JMLR Submissions", link: "https://www.jmlr.org/", isTopTier: true, extendedDeadline: false, dataSource: 'curated', type: 'journal' },
    { id: 'aij-2026', name: "Artificial Intelligence Journal", acronym: "AIJ", topic: "AI/ML", rank: "A*", hIndex: 195, scimagoQ: "Q1", location: "Journal", locationFlag: "📖", confDate: "Continuous", abstractDeadline: null, paperDeadline: "2026-12-31", notificationDate: null, platform: "Editorial Manager", link: "https://www.journals.elsevier.com/artificial-intelligence", isTopTier: true, extendedDeadline: false, dataSource: 'curated', type: 'journal' }
];

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

const JOURNAL_FEEDS = [
    'https://www.wikicfp.com/cfp/rss?cat=journal'
];

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
    if (t.includes('information science') || t.includes('journal') || t.includes('transactions')) return 'AI/ML';
    return 'AI/ML';
}

function parseDateFromText(text) {
    if (!text) return null;
    const iso = text.match(/(\d{4}-\d{2}-\d{2})/);
    if (iso) return iso[1];
    try {
        const d = new Date(text.trim());
        if (!isNaN(d.getTime()) && d.getFullYear() >= 2025) {
            return d.toISOString().slice(0, 10);
        }
    } catch (_) { }
    return null;
}

async function fetchEventDeadlines(url) {
    try {
        const html = await fetch(url).then(r => r.text());
        let paperDeadline = null;
        let abstractDeadline = null;

        const abstractRowMatch = html.match(/<th>.*?Abstract.*?<\/th>[\s\S]*?<\/td>/i);
        if (abstractRowMatch) {
            const dateMatch = abstractRowMatch[0].match(/property="v:startDate" content="([^"]+)"/i);
            if (dateMatch) abstractDeadline = dateMatch[1].split('T')[0];
        }

        const paperRowMatch = html.match(/<th>.*?(?:Submission Deadline|Paper Submission).*?<\/th>[\s\S]*?<\/td>/i) || html.match(/<th>.*?Due.*?<\/th>[\s\S]*?<\/td>/i);
        if (paperRowMatch) {
            const dateMatch = paperRowMatch[0].match(/property="v:startDate" content="([^"]+)"/i);
            if (dateMatch) paperDeadline = dateMatch[1].split('T')[0];
        }

        return { paperDeadline, abstractDeadline };
    } catch (err) {
        return { paperDeadline: null, abstractDeadline: null };
    }
}

async function parseWikiCFPRSS(xmlStr) {
    const parser = new XMLParser();
    const jsonObj = parser.parse(xmlStr);

    // Access items array
    const items = jsonObj?.rss?.channel?.item;
    if (!items) return [];

    const itemList = Array.isArray(items) ? items : [items];
    const results = [];

    for (const item of itemList) {
        const title = item.title?.trim() || '';
        const description = item.description?.trim() || '';
        const link = item.link?.trim() || '';

        const acronymMatch = title.match(/^([A-Z][A-Z0-9\-]{1,8})\s+20\d{2}/);
        if (!acronymMatch) continue;
        const acronym = acronymMatch[1];

        const yearMatch = title.match(/20(\d{2})/);
        const year = yearMatch ? '20' + yearMatch[1] : '2026';

        let paperDeadline = null;
        let abstractDeadline = null;

        if (link) {
            // Delay slightly to prevent rate limiting, though limited by sequential fetch
            await new Promise(r => setTimeout(r, 200));
            const deadlines = await fetchEventDeadlines(link);
            paperDeadline = deadlines.paperDeadline;
            abstractDeadline = deadlines.abstractDeadline;
        }

        if (!paperDeadline) continue;

        const fullText = description.replace(/<[^>]+>/g, ' ');

        const topic = inferTopic(title + ' ' + fullText);
        const confName = title.replace(/^[A-Z0-9\-]+\s+20\d{2}\s*:\s*/, '').trim();

        const locationMatch = fullText.match(/(?:Location|Venue|City)[^:]*:\s*([^\n|;]{5,50})/i);
        const location = locationMatch ? locationMatch[1].trim() : 'TBD';

        const confDateMatch = fullText.match(/(?:Conference|Event|When)[^:]*:\s*([^\n|;]{5,40})/i);
        const confDate = confDateMatch ? confDateMatch[1].trim() : year;

        const isJournal = description.toLowerCase().includes('journal') || title.toLowerCase().includes('journal') || title.toLowerCase().includes('transactions');

        results.push({
            id: `wikicfp-${acronym.toLowerCase()}-${year}`,
            name: confName || title,
            acronym,
            topic,
            rank: 'TBD',
            hIndex: null,
            scimagoQ: null,
            location: isJournal ? 'Journal' : location,
            locationFlag: isJournal ? '📖' : '🌐',
            confDate: isJournal ? 'Continuous' : confDate,
            abstractDeadline,
            paperDeadline,
            notificationDate: null,
            platform: 'TBD',
            link: link || `http://www.wikicfp.com/cfp/`,
            isTopTier: false,
            extendedDeadline: false,
            dataSource: 'wikicfp',
            type: isJournal ? 'journal' : 'conference'
        });
    }

    return results;
}

function mergeConferences(curated, fetched) {
    const curatedIds = new Set(curated.map(c => c.id));
    const curatedAcronyms = new Set(curated.map(c => c.acronym.toUpperCase()));
    const newFromFetch = fetched.filter(f => {
        return !curatedAcronyms.has(f.acronym.toUpperCase());
    });
    return [...curated, ...newFromFetch];
}

async function fetchLatestData() {
    console.log('Starting data fetch...');
    const fetchedConfs = [];
    const allFeeds = [...WIKICFP_FEEDS, ...JOURNAL_FEEDS];

    for (const feedUrl of allFeeds) {
        try {
            console.log(`Fetching ${feedUrl}...`);
            const xmlStr = await fetch(feedUrl).then(res => res.text());
            const parsed = await parseWikiCFPRSS(xmlStr);
            console.log(`- Found ${parsed.length} entries with valid deadlines.`);
            fetchedConfs.push(...parsed);
        } catch (e) {
            console.warn(`Failed to fetch ${feedUrl}:`, e.message);
        }
    }

    console.log('Merging with curated dataset...');
    const merged = mergeConferences(BASE_CONFERENCES, fetchedConfs);

    return merged;
}

async function run() {
    try {
        const mergedData = await fetchLatestData();

        const dataDir = path.join(__dirname, '..');
        const outputPath = path.join(dataDir, 'conferences.json');

        const outputPayload = {
            metadata: {
                lastSync: new Date().toISOString(),
                count: mergedData.length
            },
            data: mergedData
        };

        if (process.argv.includes('--stdout')) {
            console.log(JSON.stringify(outputPayload));
        } else {
            try {
                fs.writeFileSync(outputPath, JSON.stringify(outputPayload, null, 2));
                console.log(`✅ Data successfully saved to ${outputPath} (${mergedData.length} entries).`);
            } catch (fsErr) {
                if (fsErr.code === 'EPERM') {
                    const fallbackPath = '/tmp/conferences.json';
                    fs.writeFileSync(fallbackPath, JSON.stringify(outputPayload, null, 2));
                    console.log(`✅ Saved successfully to fallback path: ${fallbackPath} (${mergedData.length} entries).`);
                } else {
                    throw fsErr;
                }
            }
        }
    } catch (err) {
        console.error('❌ Failed to run data fetcher:', err);
        process.exit(1);
    }
}

run();
