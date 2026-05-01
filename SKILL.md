---
name: biodailynews
description: "Generate BioDailyNews, a daily biopharmaceutical industry news briefing covering 4 sectors (Innovative Drug R&D/Clinical Trials, Corporate M&A/BD Deals, Financing/Capital Markets, Pharma Financial Reports). Produces a detailed Word document, PDF, and a concise Telegram plain-text summary (≤800 words, in Chinese). Use when user requests daily biopharma news, BioDailyNews briefing, or pharmaceutical industry news roundup."
---

# BioDailyNews Skill

Generate a daily biopharmaceutical industry news briefing in Chinese.

## Overview

BioDailyNews covers **4 sectors** of the biopharmaceutical industry:

1. **创新药研发、临床试验与审批** - Innovative drug R&D, clinical trials, regulatory approvals
2. **企业并购与商业合作（M&A & BD）** - M&A deals, licensing, BD partnerships
3. **融资、资本市场与行业重大动向** - Financing, IPOs, capital markets, industry trends
4. **药企定期财报与业绩** - Pharma quarterly/annual financial reports and results

## Output Requirements

### Per Sector (each of the 4):
- **≥5 global stories** with details
- **【中国市场特别关注】subsection** with ≥2 China market stories
- China stories are embedded within each sector, not in a separate section

### Deliverables:
1. **Word document** (`.docx`) - detailed version with full story descriptions
2. **PDF** - converted from Word via LibreOffice
3. **Telegram concise text** - ≤800 words, Chinese, sent directly to chat

## File Structure

```
BioDailyNews/
└── YYYY-MM-DD/
    ├── generate-doc.js       # Word doc generation script
    ├── news_data.json        # News source data (JSON)
    ├── BioDailyNews-YYYY-MM-DD.docx
    └── BioDailyNews-YYYY-MM-DD.pdf
```

## Workflow

### Step 1: Collect News

Fetch news from industry sources:
- BioPharma Dive (biopharmadive.com) - Topics: clinical trials, deals, FDA, biotech, pharma
- Fierce Biotech (fiercebiotech.com) - Topics: biotech, deals, venture capital
- Fierce Pharma (fiercepharma.com) - Topics: pharma, asia

Use `web_fetch` to scrape topic pages and collect recent articles (within 3-5 days).

### Step 2: Organize Data

Create `news_data.json` in the date folder following the template structure from `references/news_data_template.json`:

```json
{
  "sections": [
    {
      "title": "一、板块标题",
      "stories": [
        {"title": "新闻标题", "content": "新闻详情内容（含来源和日期）"}
      ],
      "china": [
        {"title": "中国市场新闻标题", "content": "内容详情"}
      ]
    }
  ]
}
```

- Each section MUST have both `stories` (≥5) and `china` (≥2) arrays
- China market stories focus on Chinese biotech companies, NMPA approvals, local M&A/financing
- **Sector 3 (Financing):**【中国市场特别关注】must prioritize Chinese domestic VC/PE primary market fundraising news (e.g., biotech startup Series A/B/C rounds led by domestic VCs, RMB fund closes, local biotech venture financing)
- For Sector 3 China stories, actively search Chinese-language sources (36kr, 动脉网, 医药魔方, etc.) for domestic biotech funding rounds
- Include source attribution and dates in story content

### Step 3: Generate Word Document

Run the generation script:

```bash
cd BioDailyNews/YYYY-MM-DD && node generate-doc.js
```

The script (`scripts/generate-doc.js`) uses the `docx` npm library to create a formatted Word document with:
- Title: "BioDailyNews · 生物医药日报"
- Date subtitle
- 本期摘要 section
- Per-sector global stories
- 【中国市场特别关注】subsections in each sector
- Footer with attribution

### Step 4: Convert to PDF

```bash
cd BioDailyNews/YYYY-MM-DD && libreoffice --headless --convert-to pdf BioDailyNews-YYYY-MM-DD.docx
```

### Step 5: Write Telegram Summary

Compose a ≤800 word Chinese summary with one line per story, organized by sector. Send via Telegram.

### Step 6: Deliver Files

Send both .docx and .pdf files to the user via Telegram.

## Data Sources

- BioPharma Dive: biopharmadive.com
- Fierce Biotech: fiercebiotech.com
- Fierce Pharma: fiercepharma.com
- Company press releases and regulatory filings as needed
