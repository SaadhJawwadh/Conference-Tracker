# Publication Scout 🎓

> A real-time academic conference tracker for Computer Science & AI researchers — filter by quality rank, topic, platform, and deadline urgency.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?logo=github)](https://saadhjawwadh.github.io/Conference-Tracker/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Conferences](https://img.shields.io/badge/Conferences-22%2B-brightgreen)]()

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌓 **Premium Themes** | Full Dark & Light mode support with persistent user preferences |
| 🔢 **Pagination** | New paging system for smooth navigation through hundreds of conferences |
| 📖 **Journal Support** | Native support for academic journals with dedicated filtering and badges |
| 📊 **Unified Explorer** | Search, filter, and track conferences in a single cohesive dashboard |
| 🔄 **WikiCFP Sync** | Real-time fetching from WikiCFP RSS feeds for community conferences |
| 💾 **Offline Persistence** | Powered by IndexedDB — your data, bookmarks, and notes are always available |
| ⭐ **Bookmarks** | Star important conferences and manage them in the slide-out panel |
| 📝 **Personal Notes** | Add private notes to any conference row for research planning |
| 📅 **Deadline Countdown** | Precise color-coded countdowns for paper & abstract deadlines |
| 📥 **Export to CSV** | Snapshot your research planning with one-click CSV exporting |
| ⌨️ **Keyboard Navigation** | `⌘K` to search, `Esc` to close panels, fully responsive design |

---

## 🚀 Quick Start

### Option 1 — Open Locally (No Setup)
Simply open `index.html` in any modern browser. No server, build step, or dependencies required.

### Option 2 — GitHub Pages (Recommended)

1. **Fork** this repository
2. Go to **Settings → Pages**
3. Under *Source*, select **GitHub Actions**
4. Push any change — the included workflow auto-deploys to `https://<your-username>.github.io/conference-tracker`

### Option 3 — Self-host with any static server
```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8080
```

---

## 📁 Project Structure

```
conference-tracker/
├── index.html          # App shell & layout
├── styles.css          # Dark/light theme + responsive CSS
├── app.js              # UI logic, filtering, sorting
├── db.js               # IndexedDB persistence layer (bookmarks, notes, cache)
├── conferences.json    # Aggregated conference data (auto-generated)
├── scripts/
│   └── fetch-data.js   # Node.js scraper for WikiCFP
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions: Daily fetch + Deploy
├── README.md
└── LICENSE
```

---

## 🔄 Automated Data Pipeline

Publication Scout maintains a fresh dataset without taxing user client devices:

1. **Daily Automation**: A GitHub Action runs `scripts/fetch-data.js` every 24 hours.
2. **Scraping WikiCFP**: It parses 6 WikiCFP RSS category feeds and scrapes HTML for specific conference locations and deadlines.
3. **Merging Data**: It merges the scraped data with the highly curated 22-conference base dataset.
4. **Static Serving**: The aggregated data is saved as a static `conferences.json` file.
5. **Client-Side**: The web app's "Fetch Latest" button simple downloads this pre-computed `conferences.json` and syncs it securely to the local IndexedDB.

> **Note:** WikiCFP data quality varies. The curated base dataset is always authoritative for the top-22 tracked conferences. Fetched data supplements with additional community-submitted CFPs.

---

## 🏆 Tracked Conferences

Curated coverage of 22 tier-1 conferences across:

- **AI/ML** — NeurIPS, ICML, ICLR, AAAI, IJCAI
- **Computer Vision** — CVPR, ICCV, ECCV
- **NLP** — ACL, EMNLP, NAACL, COLING
- **Data Mining / IR** — KDD, SIGIR, WSDM, CIKM, WWW
- **Databases** — SIGMOD, VLDB, ICDE
- **Systems** — OSDI, SOSP, SoCC

All curated conferences meet at least one of:
- CORE Ranking **A*** or **A**
- Scimago **Q1**
- H-index **> 50**

---

## 🛠 Tech Stack

Pure HTML + CSS + JavaScript — no frameworks, no bundler. Data fetching script utilizes Node.js.

- **Fonts**: Inter + JetBrains Mono (Google Fonts)
- **Data Pipeline**: Pre-computed `conferences.json` built daily via Node.js + GitHub Actions
- **Storage**: IndexedDB via `db.js` wrapper for real offline-first caching
- **Deploy**: GitHub Actions static site deployment

---

## 🤝 Contributing

To add or update a conference, edit the `BASE_CONFERENCES` array near the top of `app.js`:

```js
{
    id: 'conf-year',                       // unique ID
    name: "Full Conference Name",
    acronym: "CONF",
    topic: "AI/ML",                        // see topic options in index.html
    rank: "A*",                            // CORE rank: A*, A, or B
    hIndex: 120,
    scimagoQ: "Q1",
    location: "City, Country",
    locationFlag: "🇺🇸",
    confDate: "Jul 2026",
    abstractDeadline: "2026-03-01",        // YYYY-MM-DD or null
    paperDeadline: "2026-03-08",
    notificationDate: "2026-05-15",
    platform: "OpenReview",               // OpenReview, CMT3, EasyChair, ARR, HotCRP
    link: "https://conf2026.org/",
    isTopTier: true,
    extendedDeadline: false,
    dataSource: 'curated',
}
```

Pull requests welcome!

---

---

## 👨‍💻 Created by

**Saadh Jawwadh**
[GitHub](https://github.com/SaadhJawwadh) | [Twitter](https://twitter.com/SaadhJawwadh) | [LinkedIn](https://linkedin.com/in/saadhjawwadh)

✨ *Vibe coded with [Antigravity](https://antigravity.ai)*

---

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE)
