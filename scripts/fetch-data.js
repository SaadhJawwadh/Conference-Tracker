const { XMLParser } = require('fast-xml-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const CURATED_PATH = path.join(ROOT_DIR, 'data', 'curated.json');
const QUALITY_PATH = path.join(ROOT_DIR, 'data', 'quality-lookup.json');

const BASE_CONFERENCES = JSON.parse(fs.readFileSync(CURATED_PATH, 'utf8'));
const QUALITY_LOOKUP = JSON.parse(fs.readFileSync(QUALITY_PATH, 'utf8'));

const WIKICFP_FEEDS = [
    'https://www.wikicfp.com/cfp/rss?cat=computer+science',
    'https://www.wikicfp.com/cfp/rss?cat=artificial+intelligence',
    'https://www.wikicfp.com/cfp/rss?cat=machine+learning',
    'https://www.wikicfp.com/cfp/rss?cat=computer+vision',
    'https://www.wikicfp.com/cfp/rss?cat=natural+language+processing',
    'https://www.wikicfp.com/cfp/rss?cat=data+mining',
    'https://www.wikicfp.com/cfp/rss?cat=security',
    'https://www.wikicfp.com/cfp/rss?cat=robotics',
    'https://www.wikicfp.com/cfp/rss?cat=journal'
];

const CCFDDL_URL = 'https://raw.githubusercontent.com/ccfddl/ccf-deadlines/main/conference/allconf.yml';

async function fetchWithTimeout(url, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.text();
    } finally {
        clearTimeout(timer);
    }
}

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

function enrichWithQuality(entry) {
    const key = entry.acronym.toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    const match = QUALITY_LOOKUP[key];
    if (!match) return entry;

    return {
        ...entry,
        rank: match.rank || entry.rank,
        hIndex: match.hIndex ?? entry.hIndex,
        scimagoQ: match.scimagoQ || entry.scimagoQ,
        topic: match.topic || entry.topic,
        platform: (entry.platform === 'TBD' && match.platform) ? match.platform : entry.platform,
        type: match.type || entry.type,
        isTopTier: match.rank === 'A*'
    };
}

function passesQualityGate(entry) {
    const validRanks = new Set(['A*', 'A', 'B']);
    const validQ = new Set(['Q1', 'Q2']);
    return (
        validRanks.has(entry.rank) ||
        validQ.has(entry.scimagoQ) ||
        (typeof entry.hIndex === 'number' && entry.hIndex > 18)
    );
}

async function fetchEventDeadlines(url) {
    try {
        const html = await fetchWithTimeout(url.replace(/^http:/, 'https:'), 8000);
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
    } catch (_) {
        return { paperDeadline: null, abstractDeadline: null };
    }
}

async function parseWikiCFPRSS(xmlStr) {
    const parser = new XMLParser();
    const jsonObj = parser.parse(xmlStr);
    const items = jsonObj?.rss?.channel?.item;
    if (!items) return [];

    const itemList = Array.isArray(items) ? items : [items];
    const results = [];

    for (const item of itemList) {
        const title = item.title?.trim() || '';
        const description = item.description?.trim() || '';
        const link = item.link?.trim() || '';

        const acronymMatch = title.match(/^([A-Z][A-Z0-9\-]{1,10})\s+20\d{2}/);
        if (!acronymMatch) continue;
        const acronym = acronymMatch[1];

        const yearMatch = title.match(/20(\d{2})/);
        const year = yearMatch ? '20' + yearMatch[1] : '2026';

        let paperDeadline = null;
        let abstractDeadline = null;
        if (link) {
            await new Promise(r => setTimeout(r, 150));
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

        const entry = enrichWithQuality({
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
            link: link.replace(/^http:/, 'https:') || 'https://www.wikicfp.com/cfp/',
            isTopTier: false,
            extendedDeadline: false,
            dataSource: 'wikicfp',
            type: isJournal ? 'journal' : 'conference'
        });

        results.push(entry);
    }

    return results;
}

function parseCCFDDLYaml(yamlText) {
    const results = [];
    const blocks = yamlText.split(/^- title:\s*/m).slice(1);
    const ccfRankMap = { A: 'A*', B: 'A', C: 'B' };

    for (const block of blocks) {
        const acronym = (block.match(/^([^\n]+)/)?.[1] || '').trim().replace(/['"]/g, '');
        if (!acronym) continue;

        const desc = (block.match(/^\s*description:\s*(.+)$/m)?.[1] || acronym).trim().replace(/['"]/g, '');
        const ccfRankRaw = (block.match(/^\s*rank:\s*\n\s*ccf:\s*([A-C])/m)?.[1] || '').trim();
        const rank = ccfRankMap[ccfRankRaw] || 'TBD';

        const yearMatches = [...block.matchAll(/^\s*- year:\s*(\d{4})([\s\S]*?)(?=^\s*- year:|\Z)/gm)];
        if (yearMatches.length === 0) continue;

        const latest = yearMatches[0];
        const year = latest[1];
        const yearBody = latest[2];

        const deadlineMatch = yearBody.match(/deadline:\s*'?(\d{4}-\d{2}-\d{2})/m);
        if (!deadlineMatch) continue;
        const paperDeadline = deadlineMatch[1];

        const abstractMatch = yearBody.match(/abstract_deadline:\s*'?(\d{4}-\d{2}-\d{2})/m);
        const abstractDeadline = abstractMatch ? abstractMatch[1] : null;
        const link = (yearBody.match(/link:\s*(https?:\/\/\S+)/m)?.[1] || '').trim();
        const place = (yearBody.match(/place:\s*(.+)$/m)?.[1] || 'TBD').trim().replace(/['"]/g, '');
        const date = (yearBody.match(/date:\s*(.+)$/m)?.[1] || year).trim().replace(/['"]/g, '');

        const entry = enrichWithQuality({
            id: `ccfddl-${acronym.toLowerCase().replace(/\s+/g, '-')}-${year}`,
            name: desc,
            acronym,
            topic: inferTopic(`${acronym} ${desc}`),
            rank,
            hIndex: null,
            scimagoQ: rank === 'A*' ? 'Q1' : null,
            location: place,
            locationFlag: '🌐',
            confDate: date,
            abstractDeadline,
            paperDeadline,
            notificationDate: null,
            platform: 'TBD',
            link: link || 'https://ccfddl.com/',
            isTopTier: rank === 'A*',
            extendedDeadline: false,
            dataSource: 'ccfddl',
            type: 'conference'
        });

        results.push(entry);
    }

    return results;
}

function mergeConferences(curated, fetched) {
    const seenIds = new Set(curated.map(c => c.id));
    const seenKeys = new Set(curated.map(c => `${c.acronym.toUpperCase()}-${(c.paperDeadline || '').slice(0, 4)}`));
    const merged = [...curated];

    for (const item of fetched) {
        const year = (item.paperDeadline || '').slice(0, 4);
        const key = `${item.acronym.toUpperCase()}-${year}`;
        if (seenIds.has(item.id) || seenKeys.has(key)) continue;
        seenIds.add(item.id);
        seenKeys.add(key);
        merged.push(item);
    }

    return merged;
}

async function fetchLatestData() {
    console.log('Starting weekly high-quality data fetch...');
    const fetchedConfs = [];

    try {
        console.log('Fetching ccfddl dataset...');
        const yml = await fetchWithTimeout(CCFDDL_URL, 15000);
        const ccfParsed = parseCCFDDLYaml(yml);
        console.log(`- ccfddl: ${ccfParsed.length} high-quality entries.`);
        fetchedConfs.push(...ccfParsed);
    } catch (e) {
        console.warn('Failed to fetch ccfddl:', e.message);
    }

    for (const feedUrl of WIKICFP_FEEDS) {
        try {
            console.log(`Fetching ${feedUrl}...`);
            const xmlStr = await fetchWithTimeout(feedUrl, 10000);
            const parsed = await parseWikiCFPRSS(xmlStr);
            console.log(`- Found ${parsed.length} high-quality entries.`);
            fetchedConfs.push(...parsed);
        } catch (e) {
            console.warn(`Failed to fetch ${feedUrl}:`, e.message);
        }
    }

    console.log('Deduplicating & merging with curated dataset...');
    return mergeConferences(BASE_CONFERENCES, fetchedConfs);
}

async function run() {
    try {
        const mergedData = await fetchLatestData();
        const outputPath = path.join(ROOT_DIR, 'conferences.json');
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
            fs.writeFileSync(outputPath, JSON.stringify(outputPayload, null, 2));
            console.log(`✅ Saved ${mergedData.length} deduplicated high-quality entries to ${outputPath}`);
        }
    } catch (err) {
        console.error('❌ Failed to run data fetcher:', err);
        process.exit(1);
    }
}

run();
