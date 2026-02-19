# Publication Scout 🎓

> A real-time academic conference tracker for Computer Science & AI researchers — filter by quality rank, topic, platform, and deadline urgency.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?logo=github)](https://saadhjawwadh.github.io/Conference-Tracker/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Conferences](https://img.shields.io/badge/Conferences-22%2B-brightgreen)]()

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Quality Filtering** | Filter by CORE A*/A/B rankings, Scimago Q1-Q4, or H-index ranges |
| ⏰ **Live Deadline Tracking** | Color-coded countdowns (green → amber → red → closed) |
| 🔄 **Real-time Fetching** | Pull live CFP data from WikiCFP RSS feeds via CORS proxy |
| 💾 **Offline-first** | IndexedDB caches all data for offline use |
| ⭐ **Bookmarks** | Star conferences and view them in a side panel |
| 📝 **Notes** | Add personal notes to any conference row |
| 📥 **CSV Export** | Export your filtered view to a spreadsheet |
| 🌓 **Dark / Light Mode** | Persisted preference via localStorage |
| ⌨️ **Keyboard Shortcuts** | `⌘K` / `Ctrl+K` to focus search, `Esc` to close modals |

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
├── app.js              # Conference data, filtering, sorting, fetching
├── db.js               # IndexedDB persistence layer (bookmarks, notes, cache)
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages auto-deploy workflow
├── README.md
└── LICENSE
```

---

## 🔄 Real-time Data Fetching

Click **Fetch Latest** in the header to:
1. Pull from 6 WikiCFP RSS category feeds via `api.allorigins.win` (free CORS proxy)
2. Parse abstracts, paper deadlines, and locations from RSS descriptions
3. Merge results with the curated 22-conference base dataset
4. Save everything to IndexedDB for offline access

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

Pure HTML + CSS + JavaScript — no frameworks, no bundler, no npm.

- **Fonts**: Inter + JetBrains Mono (Google Fonts)
- **Storage**: IndexedDB via `db.js` wrapper
- **Live Data**: WikiCFP RSS → `api.allorigins.win` CORS proxy → `DOMParser`
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

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE)
