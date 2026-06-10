import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const people = [
  {
    slug: "peixin",
    name: "佩欣",
    role: "課務、核銷與跨系統追蹤",
    source: "people/peixin/needs-analysis.md",
    status: "已整理",
    summary: "需要每日工作台、缺漏檢查、課務與核銷草稿，先處理高頻跨系統重工。",
    tags: ["每日工作台", "課務", "核銷", "草稿"],
  },
  {
    slug: "siyi",
    name: "思宜",
    role: "自行報名案、同意書、LINE 與匯入",
    source: "people/siyi/needs-analysis.md",
    status: "已整理",
    summary: "需要同意書與 LINE 狀態提醒、引導員電訪追蹤、欄位品質檢查與信扶匯入模板。",
    tags: ["狀態追蹤", "欄位檢查", "匯入模板", "提醒"],
  },
  {
    slug: "yijun",
    name: "怡君",
    role: "分享會、Podcast 與交通核銷",
    source: "people/yijun/needs-analysis.md",
    status: "已整理",
    summary: "需要內容素材工作台、逐字稿摘要、發布草稿與交通費試算，降低內容再製與月底核銷負擔。",
    tags: ["內容再製", "Podcast", "分享會", "交通核銷"],
  },
  {
    slug: "yujun",
    name: "瑜君",
    role: "南區課務與課前提醒",
    source: "people/yujun/needs-analysis.md",
    status: "已整理",
    summary: "最在意課前提醒與資料不漏接，適合先做南區課程案件提醒與缺漏檢查。",
    tags: ["南區課務", "提醒", "課前時間軸", "Sheet"],
  },
  {
    slug: "awan",
    name: "阿丸",
    role: "活動行政、候補與文件包",
    source: "people/awan/needs-analysis.md",
    status: "已整理",
    summary: "需要候補比對、通知草稿、活動行政文件包與 InfoCenter 建檔草稿。",
    tags: ["候補", "活動行政包", "文件", "名單比對"],
  },
  {
    slug: "sujing",
    name: "素菁",
    role: "帳務、月結與對帳",
    source: "people/sujing/needs-analysis.md",
    status: "已整理",
    summary: "需要半自動月結助理，處理資料匯入、規則試算、個人確認包與匯款前檢查。",
    tags: ["月結", "帳務", "對帳", "人工核准"],
  },
  {
    slug: "yuhong",
    name: "雨虹",
    role: "後續補資料",
    source: "people/yuhong/README.md",
    status: "待補資料",
    summary: "已列入需求蒐集名單，等待逐字稿、訪談摘要或工作紀錄補齊。",
    tags: ["待補"],
  },
  {
    slug: "yiyin",
    name: "奕吟",
    role: "後續補資料",
    source: "people/yiyin/README.md",
    status: "待補資料",
    summary: "已列入需求蒐集名單，等待逐字稿、訪談摘要或工作紀錄補齊。",
    tags: ["待補"],
  },
  {
    slug: "sixuan",
    name: "思璇",
    role: "後續補資料",
    source: "people/sixuan/README.md",
    status: "待補資料",
    summary: "已列入需求蒐集名單，等待逐字稿、訪談摘要或工作紀錄補齊。",
    tags: ["待補"],
  },
];

const exercises = [
  {
    slug: "course-reminder",
    name: "課程提醒與每日工作台",
    outcome: "今日課務工作台、課前提醒清單、等待回覆追蹤表、內部提醒草稿。",
    prepare: ["一筆課程資料或活動資料", "日期、時間、地點、對象與負責人", "目前已知狀態與等待回覆事項"],
    steps: [
      "先用工作流程整理卡寫清楚這件事從哪裡開始、最後要產出什麼。",
      "把資料貼給 Codex，請它整理成「今日到期、已逾期、等待回覆、需要人工確認」。",
      "請 Codex 依課程日期倒推提醒節點，並把提醒文字寫成可修改草稿。",
      "人工檢查日期、對象、稱謂、是否有外部發送風險。",
      "記錄這次節省了哪一段整理時間，以及下次資料要補哪個欄位。",
    ],
    prompt: "請把以下課程資料整理成今日課務工作台。\n請分成：今日到期、已逾期、等待回覆、需要人工確認、可複製提醒草稿。\n請列出你判斷的依據，不要自動寄出或改任何正式資料。\n\n資料：",
    checks: ["日期與倒推提醒是否正確", "提醒對象是否正確", "需要人工確認的地方是否有被標出"],
  },
  {
    slug: "transcript-content",
    name: "逐字稿與內容草稿",
    outcome: "逐字稿摘要、活動紀錄、文章草稿、社群短文與待確認清單。",
    prepare: ["一段逐字稿、會議紀錄或音檔摘要", "活動名稱、用途與讀者", "希望輸出的格式"],
    steps: [
      "先說明這份內容要給誰看，以及要變成摘要、文章、公告還是社群短文。",
      "請 Codex 先抓出主題、重點、可引用資訊與需要確認的事實。",
      "請 Codex 產出第一版草稿，再要求它改成適合台灣同仁或合作單位閱讀的語氣。",
      "人工檢查專有名詞、日期、人名、對外可發布程度。",
      "留下可重複指令，下一次換逐字稿時可直接套用。",
    ],
    prompt: "請將以下逐字稿整理成內容草稿。\n輸出請包含：一段摘要、三個重點、文章草稿、社群短文、需要人工確認的事實清單。\n請使用台灣職場常用的繁體中文語氣，避免誇大或替我做正式發布判斷。\n\n資料：",
    checks: ["是否有忠於原意", "是否標出需要查證的事實", "語氣是否適合對內或對外讀者"],
  },
  {
    slug: "sheet-status",
    name: "表格狀態與核銷檢查",
    outcome: "異常清單、人工確認清單、待補資料清單與詢問草稿。",
    prepare: ["一份表格或 CSV", "欄位意義與必要欄位", "金額、日期或狀態的檢查規則"],
    steps: [
      "先告訴 Codex 這張表的用途、哪些欄位一定要有、哪些欄位不能自己猜。",
      "請 Codex 做只讀檢查，列出缺欄、格式錯、重複、狀態衝突與低信心資料。",
      "若涉及金額或核銷，請它只做試算與疑點標記，不做正式結論。",
      "人工確認每一筆異常是否真的需要修正。",
      "把常見錯誤整理成下次可重複的檢查規則。",
    ],
    prompt: "請只讀檢查以下表格資料。\n請列出：缺漏欄位、格式異常、重複資料、狀態衝突、需要人工確認的金額或日期。\n若資料不足，請列出補問問題；不要替我做正式核銷或付款結論。\n\n資料：",
    checks: ["是否保留來源列或辨識依據", "是否只做試算與疑點標記", "是否清楚列出需要人工確認的項目"],
  },
  {
    slug: "event-admin",
    name: "活動行政包",
    outcome: "活動流程、分工表、通知草稿、風險清單與可交接 checklist。",
    prepare: ["活動日期、地點、對象與人數", "工作人員、講師、物資與場地資訊", "既有流程、通知或範本"],
    steps: [
      "先把活動拆成課前、課中、課後三段。",
      "請 Codex 依三段整理任務、負責人、截止時間與所需資料。",
      "請 Codex 產生通知草稿、物資清單、風險清單與可交接 checklist。",
      "人工檢查場地、餐食、報名名單、外部通知與個資揭露。",
      "課後用同一份清單補上紀錄、附件與待建檔事項。",
    ],
    prompt: "請把以下活動資料整理成活動行政包。\n請輸出：課前/課中/課後流程、分工表、通知草稿、物資清單、風險清單、可交接 checklist。\n請把需要人工確認的場地、餐食、名單、外部通知與個資項目另外列出。\n\n資料：",
    checks: ["分工是否清楚", "課前/課中/課後是否都有涵蓋", "外部通知與個資項目是否有人工確認"],
  },
];

const commonNeedsPath = "shared-modules/office-common-needs.md";
const workflowIntakePath = "shared-modules/workflow-intake-ai-evaluation-template.md";
const navItems = [
  { key: "home", label: "首頁", href: "/" },
  { key: "learn", label: "上課入口", href: "/learn/" },
  { key: "slides", label: "課程簡報", href: "/slides/" },
  { key: "guide", label: "操作說明", href: "/guide/" },
  { key: "kit", label: "練習包", href: "/kit/" },
  { key: "exercises", label: "操作題目", href: "/exercises/" },
  { key: "publish", label: "公開部署", href: "/publish/" },
  { key: "needs", label: "需求資料", href: "/needs/" },
];

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseInline(value) {
  const escaped = escapeHtml(value);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
      if (href.startsWith("./") || href.endsWith(".md")) {
        return `<span class="muted-link">${text}</span>`;
      }
      return `<a href="${escapeHtml(href)}">${text}</a>`;
    });
}

function slugify(value) {
  return String(value)
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function splitTableRow(line) {
  const trimmed = line.trim();
  const body = trimmed.startsWith("|") && trimmed.endsWith("|")
    ? trimmed.slice(1, -1)
    : trimmed;
  return body.split("|").map((cell) => parseInline(cell.trim()));
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let paragraph = [];
  let listType = null;

  const closeParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${parseInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    out.push(`</${listType}>`);
    listType = null;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      closeParagraph();
      closeList();
      continue;
    }

    if (trimmed.startsWith("```")) {
      closeParagraph();
      closeList();
      const lang = trimmed.slice(3).trim();
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      const codeText = escapeHtml(code.join("\n"));
      if (lang === "mermaid") {
        out.push(`<pre class="mermaid">${codeText}</pre>`);
      } else {
        out.push(`<pre><code>${codeText}</code></pre>`);
      }
      continue;
    }

    if (/^\|.+\|$/.test(trimmed) && i + 1 < lines.length && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[i + 1].trim())) {
      closeParagraph();
      closeList();
      const header = splitTableRow(trimmed);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.+\|$/.test(lines[i].trim())) {
        rows.push(splitTableRow(lines[i]));
        i += 1;
      }
      i -= 1;
      out.push(`<div class="table-wrap"><table><thead><tr>${header.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeParagraph();
      closeList();
      const level = heading[1].length;
      const text = heading[2];
      out.push(`<h${level} id="${slugify(text)}">${parseInline(text)}</h${level}>`);
      continue;
    }

    const bullet = /^[-*]\s+(.+)$/.exec(trimmed);
    if (bullet) {
      closeParagraph();
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        out.push("<ul>");
      }
      out.push(`<li>${parseInline(bullet[1])}</li>`);
      continue;
    }

    const ordered = /^\d+[.)]\s+(.+)$/.exec(trimmed);
    if (ordered) {
      closeParagraph();
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        out.push("<ol>");
      }
      out.push(`<li>${parseInline(ordered[1])}</li>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  closeParagraph();
  closeList();
  return out.join("\n");
}

function pageShell({ title, eyebrow, intro, body, sectionClass = "", active = "home" }) {
  const nav = navItems.map((item) => {
    const activeClass = item.key === active ? ' class="primary"' : "";
    return `<a${activeClass} href="${item.href}">${item.label}</a>`;
  }).join("\n      ");

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #1f2937;
      --muted: #5f6b7a;
      --paper: #fff;
      --bg: #f6f8fb;
      --line: #d8dee8;
      --navy: #202a44;
      --blue: #2f6bff;
      --teal: #0e9f8b;
      --wine: #8b3556;
      --gold: #c58b25;
      --green: #2e7d5f;
      --sky: #eef5ff;
      --mint: #e9f8f4;
      --blush: #f8ecf1;
      --amber: #fff6e0;
      --radius: 8px;
      font-family: "Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif;
    }
    * { box-sizing: border-box; }
    body { margin: 0; overflow-x: hidden; background: var(--bg); color: var(--ink); line-height: 1.72; }
    a { color: inherit; }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      padding: 10px clamp(14px, 3vw, 32px);
      border-bottom: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(10px);
    }
    .brand { font-weight: 900; color: var(--navy); }
    .nav { max-width: 100%; min-width: 0; display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
    .nav a, .button-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 0 12px;
      background: #fff;
      color: var(--ink);
      font-weight: 800;
      text-decoration: none;
      white-space: nowrap;
    }
    .button-link.primary, .nav a.primary { border-color: var(--blue); background: var(--blue); color: #fff; }
    .hero {
      background: var(--navy);
      color: #fff;
      padding: clamp(42px, 8vw, 84px) 0;
    }
    .shell { width: min(1120px, calc(100% - 36px)); min-width: 0; margin: 0 auto; }
    .hero .shell { display: grid; gap: 18px; }
    .eyebrow { margin: 0; color: #9be1d5; font-size: 0.94rem; font-weight: 900; }
    h1, h2, h3, h4, p { margin-top: 0; }
    h1 { max-width: 900px; margin-bottom: 0; font-size: clamp(2.15rem, 5vw, 4rem); line-height: 1.1; letter-spacing: 0; }
    .lead { max-width: 880px; margin-bottom: 0; color: rgba(255, 255, 255, 0.82); font-size: clamp(1.05rem, 2vw, 1.25rem); }
    main.shell { padding: 42px 0 76px; }
    .section { margin: 34px 0; }
    .cards, .grid { min-width: 0; display: grid; gap: 16px; }
    .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .card, .panel, .md article {
      min-width: 0;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--paper);
      box-shadow: 0 8px 24px rgba(32, 42, 68, 0.06);
    }
    .card, .panel { padding: 20px; }
    .card strong { display: block; margin-bottom: 8px; color: var(--navy); font-size: 1.08rem; }
    .card p, .muted { color: var(--muted); }
    .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    .tag { border: 1px solid var(--line); border-radius: var(--radius); padding: 4px 8px; background: var(--sky); color: var(--navy); font-size: 0.86rem; font-weight: 800; }
    .notice {
      border: 1px solid #c7d5da;
      border-left: 6px solid var(--teal);
      border-radius: var(--radius);
      padding: 16px 18px;
      background: #f0faf8;
      color: #254d49;
    }
    .path {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 14px;
    }
    .path-card {
      position: relative;
      min-height: 188px;
      display: grid;
      align-content: space-between;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 20px;
      background: #fff;
      box-shadow: 0 8px 24px rgba(32, 42, 68, 0.06);
    }
    .path-card small {
      color: var(--muted);
      font-weight: 900;
    }
    .next-strip {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
      align-items: center;
      border: 1px solid #c7d5da;
      border-left: 6px solid var(--blue);
      border-radius: var(--radius);
      padding: 16px 18px;
      background: var(--sky);
    }
    .deploy-flow {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 10px;
      align-items: stretch;
    }
    .deploy-step {
      min-height: 158px;
      display: grid;
      align-content: space-between;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 16px;
      background: #fff;
      box-shadow: 0 8px 24px rgba(32, 42, 68, 0.06);
    }
    .deploy-step small {
      color: var(--muted);
      font-weight: 900;
    }
    .deploy-step strong {
      display: block;
      color: var(--navy);
      line-height: 1.35;
    }
    .account-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .callout-row {
      display: grid;
      grid-template-columns: 0.95fr 1.05fr;
      gap: 18px;
      align-items: start;
    }
    .check-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .prompt {
      overflow-x: auto;
      white-space: pre-wrap;
      border-radius: var(--radius);
      padding: 18px;
      background: #111827;
      color: #e5e7eb;
      font-size: 0.98rem;
      line-height: 1.68;
    }
    .steps { counter-reset: step; display: grid; gap: 10px; }
    .steps li { margin: 0 0 8px; }
    .md { min-width: 0; display: grid; gap: 20px; }
    .md article { padding: clamp(20px, 4vw, 34px); }
    .md h1 { color: var(--navy); font-size: clamp(1.9rem, 4vw, 3rem); }
    .md h2 { margin-top: 34px; color: var(--navy); font-size: clamp(1.35rem, 3vw, 2rem); line-height: 1.25; }
    .md h3 { margin-top: 24px; color: var(--navy); font-size: 1.22rem; }
    .table-wrap { max-width: 100%; min-width: 0; overflow-x: auto; margin: 16px 0 24px; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; }
    table { width: 100%; min-width: 720px; border-collapse: collapse; }
    th, td { border-bottom: 1px solid var(--line); padding: 10px 12px; text-align: left; vertical-align: top; }
    th { background: #eef1f6; color: var(--navy); white-space: nowrap; }
    pre { overflow-x: auto; border-radius: var(--radius); padding: 16px; background: #111827; color: #e5e7eb; }
    pre.mermaid { background: #fff; color: var(--ink); border: 1px solid var(--line); }
    code { font-family: "Cascadia Code", Consolas, monospace; }
    .muted-link { color: var(--muted); }
    .accent-blue { border-top: 5px solid var(--blue); }
    .accent-teal { border-top: 5px solid var(--teal); }
    .accent-gold { border-top: 5px solid var(--gold); }
    .accent-wine { border-top: 5px solid var(--wine); }
    .accent-green { border-top: 5px solid var(--green); }
    .soft-sky { background: var(--sky); }
    .soft-mint { background: var(--mint); }
    .soft-blush { background: var(--blush); }
    .soft-amber { background: var(--amber); }
    footer { border-top: 1px solid var(--line); padding: 26px 0 40px; color: var(--muted); font-size: 0.92rem; }
    @media (max-width: 860px) {
      .topbar { align-items: flex-start; flex-direction: column; }
      .nav { width: 100%; justify-content: flex-start; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 2px; }
      .cards, .grid.two, .path, .next-strip, .deploy-flow, .account-grid, .callout-row, .check-grid { grid-template-columns: 1fr; }
      table { min-width: 640px; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="brand">Codex 行政工作實驗課</div>
    <nav class="nav" aria-label="站內導覽">
      ${nav}
    </nav>
  </header>
  <section class="hero">
    <div class="shell">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p class="lead">${escapeHtml(intro)}</p>
    </div>
  </section>
  <main class="shell ${sectionClass}">
    ${body}
  </main>
  <footer>
    <div class="shell">版本：2026.06.10｜內部複核版：可用網址瀏覽，但不代表隱私保護；公開頁不放完整逐字稿、正式資料或可識別個資。</div>
  </footer>
  <script type="module">
    import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
    mermaid.initialize({ startOnLoad: true, theme: "default" });
  </script>
</body>
</html>`;
}

function personCard(person) {
  return `<article class="card accent-${person.status === "已整理" ? "blue" : "gold"}">
    <strong>${escapeHtml(person.name)}｜${escapeHtml(person.role)}</strong>
    <p>${escapeHtml(person.summary)}</p>
    <div class="tag-row">${person.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    <p style="margin-top:16px"><a class="button-link primary" href="./${person.slug}/">查看${escapeHtml(person.name)}需求</a></p>
  </article>`;
}

function buildLearnPage() {
  const body = `
    <section class="notice">
      這頁是給上課當天使用的入口。照順序走就好：先看簡報，再開啟原本的 Codex 可視化操作說明，接著打開練習包與操作題目；自己的工作套用與收尾整理，留到課後自行探索。
    </section>
    <section class="section">
      <h2>上課照這五步走</h2>
      <div class="path">
        <article class="path-card accent-blue">
          <small>第 1 步</small>
          <div><strong>看課程簡報</strong><p class="muted">先理解 Codex 能協助什麼，以及今天會完成哪些成果。</p></div>
          <a class="button-link primary" href="/slides/">開始看簡報</a>
        </article>
        <article class="path-card accent-teal">
          <small>第 2 步</small>
          <div><strong>看操作說明</strong><p class="muted">開啟可視化教學，用成效報表情境看完整操作。</p></div>
          <a class="button-link primary" href="/guide/">看操作說明</a>
        </article>
        <article class="path-card accent-wine">
          <small>第 3 步</small>
          <div><strong>打開練習包</strong><p class="muted">把自己的工作填進流程卡、共用指令與人工確認清單。</p></div>
          <a class="button-link primary" href="/kit/">打開練習包</a>
        </article>
        <article class="path-card accent-gold">
          <small>第 4 步</small>
          <div><strong>選一題操作</strong><p class="muted">從課程提醒、逐字稿、表格檢查、活動行政包中選一題。</p></div>
          <a class="button-link primary" href="/exercises/">選操作題目</a>
        </article>
        <article class="path-card accent-green">
          <small>第 5 步</small>
          <div><strong>課後自行探索</strong><p class="muted">課堂先學共同操作；課後再把自己的工作套入練習包，整理成果與人工確認點。</p></div>
          <a class="button-link primary" href="/kit/#review">看探索清單</a>
        </article>
      </div>
    </section>
    <section class="section next-strip">
      <div>
        <strong>課後延伸：公開部署工作流。</strong>
        <p class="muted">如果你想把 Codex 做出的頁面或小工具變成可在不同裝置開啟的公開作品，重點不是背完整流程，而是學會請 Codex 拆步驟、確認授權與公開邊界，再帶你建立 GitHub repo、接上 Vercel、取得正式網址並完成驗證。</p>
      </div>
      <a class="button-link primary" href="/publish/">看公開部署流程</a>
    </section>
    <section class="section grid two">
      <article class="panel">
        <h2>我現在要點哪裡？</h2>
        <p>如果你是學員，優先使用這四個頁面：課程簡報、操作說明、練習包、操作題目。每個頁面上方都有同一組導覽，迷路時回到「上課入口」。</p>
      </article>
      <article class="panel">
        <h2>需求資料放哪裡？</h2>
        <p>同仁需求整理是課程設計與後續工具規劃用，不是學員上課的主要路徑。需要回看來源時再進入需求資料。</p>
        <p><a class="button-link" href="/needs/">查看需求資料</a></p>
      </article>
    </section>`;
  return pageShell({
    title: "學員上課入口",
    eyebrow: "上課入口",
    intro: "把課程簡報、練習包與四個操作題目整理成一條路徑，降低來回跳頁的不確定感。",
    body,
    active: "learn",
  });
}


function buildNeedsIndex() {
  const commonNeeds = existsSync(commonNeedsPath) ? markdownToHtml(readFileSync(commonNeedsPath, "utf8")) : "";
  const donePeople = people.filter((person) => person.status === "已整理");
  const pendingPeople = people.filter((person) => person.status !== "已整理");
  const body = `
    <section class="notice">
      這裡放回每位夥伴的需求整理頁，並保留辦公室共通需求摘要。這些頁面是給內部討論與課程設計使用，仍維持 noindex。
    </section>
    <section class="section next-strip">
      <div>
        <strong>工作流蒐集與 AI 評估模板</strong>
        <p class="muted">後續陪夥伴補工作細節時，先用同一份模板整理觸發、資料來源、步驟、產出、人工確認與 AI 協助邊界，再決定是否進入沙盒實驗。</p>
      </div>
      <a class="button-link primary" href="/needs/workflow-intake/">打開蒐集模板</a>
    </section>
    <section class="section">
      <h2>已整理的夥伴需求</h2>
      <div class="cards">${donePeople.map(personCard).join("")}</div>
    </section>
    <section class="section">
      <h2>後續待補資料</h2>
      <div class="cards">${pendingPeople.map(personCard).join("")}</div>
    </section>
    <section class="section md">
      <article>${commonNeeds}</article>
    </section>`;
  return pageShell({
    title: "同仁需求整理總覽",
    eyebrow: "需求資料",
    intro: "這一區是課程設計與後續工具規劃資料，不是學員上課的主要操作路徑。",
    body,
    active: "needs",
  });
}

function buildWorkflowIntakePage() {
  const sourceMarkdown = existsSync(workflowIntakePath)
    ? readFileSync(workflowIntakePath, "utf8")
    : "# 工作流蒐集與 AI 評估模板\n\n模板尚未建立。";
  const body = `
    <section class="notice">
      本頁來源：<code>${escapeHtml(workflowIntakePath)}</code>。這是陪伴夥伴蒐集工作細節的共用模板，不是正式系統規格；涉及個資、帳務、個案、外部發送或正式寫回時，仍需保留人工確認。
    </section>
    <section class="section grid two">
      <article class="card accent-blue">
        <strong>先整理工作，不先導入工具</strong>
        <p>每次只挑一項真實工作，補齊觸發、資料來源、步驟、產出、例外與確認責任。</p>
      </article>
      <article class="card accent-teal">
        <strong>先判斷 AI 協助邊界</strong>
        <p>從摘要、缺漏檢查、提醒、草稿開始；外部發送、正式寫回、薪資、發票與個案判斷保留人工核准。</p>
      </article>
    </section>
    <section class="section md">
      <article>${markdownToHtml(sourceMarkdown)}</article>
    </section>`;
  return pageShell({
    title: "工作流蒐集與 AI 評估模板",
    eyebrow: "需求資料",
    intro: "陪夥伴把真實工作講清楚，再判斷哪些段落適合 AI 協助、哪些必須保留人工確認。",
    body,
    sectionClass: "md-page",
    active: "needs",
  });
}

function buildPersonPage(person) {
  const sourceMarkdown = existsSync(person.source)
    ? readFileSync(person.source, "utf8")
    : `# ${person.name}需求整理\n\n狀態：待補資料。`;
  const body = `
    <section class="notice">
      本頁來源：<code>${escapeHtml(person.source)}</code>。內容是需求整理與工作流分析，不是正式系統規格；涉及外部發送、正式資料更新、個資、金額或月結的動作仍需人工確認。
    </section>
    <section class="section">
      <div class="card accent-teal">
        <strong>${escapeHtml(person.name)}｜${escapeHtml(person.role)}</strong>
        <p>${escapeHtml(person.summary)}</p>
        <div class="tag-row">${person.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      </div>
    </section>
    <section class="section md">
      <article>${markdownToHtml(sourceMarkdown)}</article>
    </section>`;
  return pageShell({
    title: `${person.name}需求整理`,
    eyebrow: "個別需求資料",
    intro: person.summary,
    body,
    sectionClass: "md-page",
    active: "needs",
  });
}

function buildKitPage() {
  const body = `
    <section class="notice">
      這份練習包不是下載檔，而是課堂中可以直接打開、照著看與照著填的材料。90 分鐘課堂先完成共同練習；自己的低風險工作片段可留到課後再套用，並留下可重複指令與人工確認清單。
    </section>
    <section class="section next-strip">
      <div>
        <strong>你現在在第 3 步：打開練習包。</strong>
        <p class="muted">先填工作流程整理卡與共用指令模板；若不確定怎麼下第一句指令，可先回操作說明。填完後，到操作題目頁選一題實作。</p>
      </div>
      <a class="button-link primary" href="/exercises/">下一步：選操作題目</a>
    </section>
    <section class="section">
      <h2>練習包內容</h2>
      <div class="cards">
        <article class="card accent-blue"><strong>1. 工作流程整理卡</strong><p>把工作拆成開始條件、資料來源、處理步驟、人工確認點與輸出。</p></article>
        <article class="card accent-teal"><strong>2. 共用指令模板</strong><p>用同一個句型請 Codex 整理、檢查、產草稿。</p></article>
        <article class="card accent-gold"><strong>3. 四題操作任務單</strong><p>課程提醒、逐字稿內容、表格檢查、活動行政包。</p></article>
        <article class="card accent-wine"><strong>4. 成果檢查表</strong><p>確認輸出是否可用、哪些要人看、哪些需要補資料。</p></article>
        <article class="card accent-green"><strong>5. 人工確認清單</strong><p>把外部發送、正式資料更新、金額、個資與正式判斷標出來。</p></article>
        <article class="card accent-blue"><strong>6. 效果記錄表</strong><p>記錄原本花多久、Codex 幫到哪裡、下一次要怎麼改。</p></article>
      </div>
    </section>
    <section class="section grid two" id="workflow-card">
      <article class="panel">
        <h2>工作流程整理卡</h2>
        <ol>
          <li>這件工作什麼時候開始？</li>
          <li>手上有哪些資料？資料在哪裡？</li>
          <li>平常會怎麼整理、檢查或轉換？</li>
          <li>哪些地方最容易漏，或需要人判斷？</li>
          <li>最後要交付提醒、草稿、表格、文件或 checklist？</li>
        </ol>
      </article>
      <article class="panel">
        <h2>成果檢查表</h2>
        <ol>
          <li>輸出有沒有回答原本的工作問題？</li>
          <li>日期、金額、人名、單位、地點是否需要人工確認？</li>
          <li>是否清楚列出可修改使用、需人工確認、需補資料？</li>
          <li>下次再跑時，資料與指令是否足夠清楚？</li>
          <li>這次有沒有省下重複整理或找缺漏的時間？</li>
        </ol>
      </article>
    </section>
    <section class="section" id="prompt-template">
      <h2>共用指令模板</h2>
      <div class="prompt">我要處理的工作是：
我提供的資料是：
我希望你產出：
請特別檢查：
需要人工確認的地方：

如果資料不足，請列出需要補問的問題，不要自己猜。

最後請把結果分成：
1. 可修改使用
2. 需要人工確認
3. 需要補資料或暫時不適合處理</div>
    </section>
    <section class="section" id="human-checklist">
      <h2>人工確認清單</h2>
      <div class="cards">
        <article class="card soft-mint"><strong>可修改使用</strong><p>摘要、清單、草稿、檢查表、流程草圖。</p></article>
        <article class="card soft-amber"><strong>需要人工確認</strong><p>日期、金額、稱謂、收件人、對外語氣、正式欄位。</p></article>
        <article class="card soft-blush"><strong>需要保留人工決策</strong><p>外部發送、正式資料更新、個資揭露、金流、核銷或月結相關判斷。</p></article>
      </div>
    </section>
    <section class="section" id="review">
      <h2>效果記錄表</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>項目</th><th>請填寫</th></tr></thead>
          <tbody>
            <tr><td>我今天選的工作</td><td>例如：課前提醒、逐字稿摘要、表格檢查、活動行政包</td></tr>
            <tr><td>原本大約花多久</td><td>估計原本整理、檢查或寫草稿需要的時間</td></tr>
            <tr><td>Codex 幫我產出什麼</td><td>草稿、清單、表格、流程、待確認事項</td></tr>
            <tr><td>仍需人工確認</td><td>列出日期、金額、人名、對外發送、正式資料更新等</td></tr>
            <tr><td>下一次要修正</td><td>資料要補什麼、指令要改哪裡、哪些不適合交給 AI</td></tr>
          </tbody>
        </table>
      </div>
    </section>`;
  return pageShell({
    title: "課堂練習包",
    eyebrow: "學員操作材料",
    intro: "一份可直接在課堂上照著填的練習包，協助同仁把工作流講清楚、操作一次、留下可檢查成果。",
    body,
    active: "kit",
  });
}

function exerciseCard(exercise) {
  return `<article class="card accent-blue">
    <strong>${escapeHtml(exercise.name)}</strong>
    <p>${escapeHtml(exercise.outcome)}</p>
    <p style="margin-top:14px"><a class="button-link primary" href="#${exercise.slug}">看操作步驟</a></p>
  </article>`;
}

function buildExercisePage() {
  const details = exercises.map((exercise, index) => `
    <section class="section" id="${exercise.slug}">
      <div class="panel">
        <p class="eyebrow">練習 ${index + 1}</p>
        <h2>${escapeHtml(exercise.name)}</h2>
        <p class="muted">${escapeHtml(exercise.outcome)}</p>
        <div class="grid two">
          <article class="card soft-sky"><strong>先準備</strong><ul>${exercise.prepare.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
          <article class="card soft-mint"><strong>檢查成果</strong><ul>${exercise.checks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
        </div>
        <h3>操作步驟</h3>
        <ol class="steps">${exercise.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <h3>可複製指令</h3>
        <div class="prompt">${escapeHtml(exercise.prompt)}</div>
      </div>
    </section>`).join("");

  const body = `
    <section class="notice">
      四個練習都用同一個基本方法：說明工作、提供資料、指定輸出、標出人工確認、檢查後修正。課堂共同示範後，學員可先選一題理解操作方式；自己的真實工作可留到課後自行套用。
    </section>
    <section class="section next-strip">
      <div>
        <strong>你現在在第 4 步：選一題操作。</strong>
        <p class="muted">先選最接近自己工作的題目，理解準備資料、操作步驟與檢查方式；課後再用自己的素材完整跑一次。</p>
      </div>
      <a class="button-link primary" href="/kit/#review">完成後：檢查成果</a>
    </section>
    <section class="section">
      <h2>四個練習題目</h2>
      <div class="cards">${exercises.map(exerciseCard).join("")}</div>
    </section>
    ${details}`;
  return pageShell({
    title: "四個練習操作說明",
    eyebrow: "課堂實作題目",
    intro: "每題都列出準備資料、操作步驟、可複製指令與檢查方式，學員可以直接挑一題開始做。",
    body,
    active: "exercises",
  });
}

function buildPublishPage() {
  const body = `
    <section class="notice">
      這一段放在課程尾聲，定位是「作品公開化的下一步」。前面 90 分鐘先學會和 Codex 梳理工作、產出草稿與檢查表；如果之後要把成果做成可公開瀏覽的頁面或小工具，就照這頁把 GitHub repo（放網站檔案與修改紀錄的雲端專案資料夾）與 Vercel production（正式可開啟的公開網址）串起來。這不是寫程式考試，而是學會把已確認可公開的成果，安全放到一個可開啟的網址。
    </section>
    <section class="section" id="collaboration">
      <h2>不用背流程，要學會怎麼跟 Codex 協作</h2>
      <p class="muted">GitHub、Vercel、瀏覽器畫面可能會因帳號狀態而不同。學員真正要帶走的是問法：先請 Codex 拆步驟、說明會動到什麼、等自己確認後再執行，最後請 Codex 驗證結果。</p>
      <div class="deploy-flow" aria-label="Codex 協作六步驟">
        <article class="deploy-step accent-blue"><small>協作 1</small><strong>說目標</strong><p class="muted">我要做什麼、給誰看、哪些資料可以公開。</p></article>
        <article class="deploy-step accent-teal"><small>協作 2</small><strong>請它拆步驟</strong><p class="muted">先請 Codex 說明接下來會做哪些事，不急著執行。</p></article>
        <article class="deploy-step accent-gold"><small>協作 3</small><strong>確認邊界</strong><p class="muted">會改哪些檔案、會連到哪些外部服務、是否要登入授權。</p></article>
        <article class="deploy-step accent-wine"><small>協作 4</small><strong>一次做一小步</strong><p class="muted">讓 Codex 先做低風險步驟，看到結果再往下。</p></article>
        <article class="deploy-step accent-green"><small>協作 5</small><strong>看結果再回饋</strong><p class="muted">把自己看到的畫面、錯誤訊息或不懂的地方貼回去。</p></article>
        <article class="deploy-step accent-blue"><small>協作 6</small><strong>請它驗證</strong><p class="muted">要求 Codex 回報網址、截圖、noindex 與仍需人工確認的事項。</p></article>
      </div>
      <div class="prompt">我不用背完整流程，請你像專案秘書一樣帶我做。
請先幫我拆成 3 到 5 個步驟，並標出：
1. 哪些你可以直接做
2. 哪些需要我登入、授權或按確認
3. 哪些會公開到網路上
4. 每一步完成後我應該看到什麼結果
請先說明，不要直接執行。</div>
    </section>
    <section class="section">
      <h2>一張圖看完整工作流</h2>
      <pre class="mermaid">flowchart LR
  A["1. 和 Codex 說清楚目標"] --> B["2. 產出本機網站或小工具"]
  B --> C["3. 建立 GitHub repo（專案資料夾）"]
  C --> D["4. 部署到 Vercel"]
  D --> E["5. 取得正式網址"]
  E --> F["6. 手機與桌機驗證"]</pre>
      <div class="deploy-flow" aria-label="公開部署六步驟">
        <article class="deploy-step accent-blue"><small>第 1 步</small><strong>說清楚要公開的成果</strong><p class="muted">主題、資料來源、不能放的內容、希望使用者看到什麼。</p></article>
        <article class="deploy-step accent-teal"><small>第 2 步</small><strong>請 Codex 建頁面</strong><p class="muted">先做本機版本，也就是目前電腦或 Codex 工作區看得到，還不是公開網址。</p></article>
        <article class="deploy-step accent-wine"><small>第 3 步</small><strong>建立 GitHub repo</strong><p class="muted">把網站檔案、README 交接說明與修改紀錄放到雲端專案資料夾。</p></article>
        <article class="deploy-step accent-gold"><small>第 4 步</small><strong>部署到 Vercel</strong><p class="muted">從 Vercel 匯入 GitHub repo，讓網站產生可開啟的正式網址。</p></article>
        <article class="deploy-step accent-green"><small>第 5 步</small><strong>取得正式網址</strong><p class="muted">取得 production URL，確認網址可在不同裝置開啟。</p></article>
        <article class="deploy-step accent-blue"><small>第 6 步</small><strong>人工檢查後分享</strong><p class="muted">檢查無個資、無內部資料、連結與版面正常。</p></article>
      </div>
    </section>
    <section class="notice">
      先確認公開範圍：public 代表任何拿到網址的人都可能看見內容；noindex 只是請搜尋引擎不要收錄的設定，不是隱私保護。
    </section>
    <section class="section" id="accounts">
      <h2>先準備三個帳號與外掛</h2>
      <div class="account-grid">
        <article class="card accent-blue">
          <strong>GitHub 帳號</strong>
          <p>用途是放網站檔案、說明文件與每次修改紀錄。註冊後要完成 Email 驗證，才能順利建立 repo。</p>
          <p><a href="https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github">GitHub 官方帳號教學</a></p>
        </article>
        <article class="card accent-teal">
          <strong>Vercel 帳號</strong>
          <p>用途是把 GitHub repo 部署成公開網址。建議用 GitHub 登入，匯入 repo 時比較順。</p>
          <p><a href="https://vercel.com/docs/getting-started-with-vercel">Vercel 官方入門教學</a></p>
        </article>
        <article class="card accent-gold">
          <strong>Codex 外掛</strong>
          <p>外掛是讓 Codex 可以連到 GitHub、Vercel 或瀏覽器檢查的授權能力，不是讓 Codex 自己開公司帳號。</p>
          <p><a href="https://developers.openai.com/codex/plugins">Codex Plugins 官方說明</a></p>
        </article>
      </div>
    </section>
    <section class="section" id="authorization">
      <h2>遇到任何確認畫面怎麼判斷</h2>
      <p class="muted">學員不需要記住每個工具的按鈕，但要養成同一個判斷習慣：先問「會改哪裡、會送去哪裡、能不能復原」。凡是會改檔案、登入授權、公開發布、外部寄送、刪除、安裝、付款或碰到密碼金鑰，都要先停下來請 Codex 說明，再由本人確認。</p>
      <div class="cards">
        <article class="card accent-blue"><strong>可以先同意</strong><p>只讀檢查、整理草稿、產生本機檔案、開本機預覽，且沒有外部傳送或正式資料變更。</p></article>
        <article class="card accent-gold"><strong>先看清楚再同意</strong><p>會修改檔案、commit、push、啟用外掛、登入 GitHub/Vercel、部署公開頁。</p></article>
        <article class="card accent-wine"><strong>先停下來問人</strong><p>付款、改公司權限、刪除資料、上傳個資、寄外部訊息、貼密碼或金鑰、連正式系統。</p></article>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>畫面或問題</th><th>建議怎麼選</th><th>先停下來的情況</th></tr></thead>
          <tbody>
            <tr><td>Codex 要修改檔案</td><td>請 Codex 先說明會改哪些檔案、為什麼改、是否能復原；小範圍教學檔可確認後同意。</td><td>改到不認識的資料夾、正式資料、多人共用檔，或沒有說明修改內容。</td></tr>
            <tr><td>Codex 要刪除或搬移檔案</td><td>先請它列出完整路徑與原因；確認只是測試檔或可重建檔案才同意。</td><td>任何正式資料、原始逐字稿、客戶資料、帳務資料、工作成果檔。</td></tr>
            <tr><td>Codex 要安裝工具或套件</td><td>先問用途、安裝到哪裡、是否需要管理員權限；課堂除非必要，不以安裝新工具為優先。</td><td>要求系統管理員權限、安裝不熟悉軟體、改全域設定或瀏覽器擴充功能。</td></tr>
            <tr><td>Codex 要啟用外掛或連接帳號</td><td>請 Codex 先說明外掛用途與需要的權限；確認是本次任務需要，再依畫面登入授權。</td><td>要求貼上密碼、token、金鑰，或要求授權不相關服務。</td></tr>
            <tr><td>GitHub 要登入或授權</td><td>用自己的 GitHub 帳號登入；若可以選權限，選「Only select repositories」，只勾本次要用的 repo。</td><td>畫面要求存取所有 repo、組織管理權限、付款資訊，或帳號不是自己的。</td></tr>
            <tr><td>GitHub 要建立 repo</td><td>練習用可以先選自己的帳號；visibility 不確定時選 Private，要公開展示才選 Public。</td><td>repo 名稱含個資、客戶名稱、內部案名，或檔案內有未確認資料。</td></tr>
            <tr><td>Codex 要 commit / push</td><td>請 Codex 先列出會提交的檔案與摘要，確認沒有敏感資料後，再同意 commit / push。</td><td>Codex 沒說會改哪些檔案、要推到不熟的 repo，或包含 .env、金鑰、內部表單。</td></tr>
            <tr><td>Vercel 要 Import Git Repository</td><td>選剛剛建立的那個 repo；不要一次授權所有 repo。練習時選個人或課堂測試 workspace。</td><td>要選公司 team、正式 domain、付費方案，或畫面看起來不是本次 repo。</td></tr>
            <tr><td>Vercel 要 Deploy / Production</td><td>先請 Codex 檢查公開內容與 noindex；確認後再部署。靜態 HTML 專案通常先沿用預設設定。</td><td>內容還有個資、內部逐字稿、正式金額，或需要付款、改 domain、改權限。</td></tr>
            <tr><td>瀏覽器要求登入、授權或允許權限</td><td>確認網站網址、帳號是否正確；只允許本次任務需要的權限。</td><td>要求相機、麥克風、定位、下載、通知、儲存密碼，或登入不明帳號。</td></tr>
            <tr><td>要寄 Email、Slack、表單或外部訊息</td><td>先讓 Codex 只產生草稿，收件人、內容、附件都由本人檢查後再送出。</td><td>任何外部寄送、群組發文、上傳附件、表單送出、改公開分享權限。</td></tr>
            <tr><td>要處理個資、金額、正式資料</td><td>先做去識別化或只讀檢查，輸出標成草稿或待確認。</td><td>要下結論、付款、月結、正式核銷、改正式資料庫或公開個資。</td></tr>
            <tr><td>要求輸入密碼、API key、token、金鑰</td><td>不要貼給 Codex 或公開頁；需要時改用官方登入畫面或環境變數管理。</td><td>任何要求把密碼、簡訊碼、金鑰直接貼到聊天或檔案裡。</td></tr>
            <tr><td>付款、升級方案、改 domain 或公司 team</td><td>課堂不直接操作；先截圖或記下問題，回頭找主管或帳號管理者確認。</td><td>任何費用、公司設定、正式 domain、權限管理、production protection 變更。</td></tr>
          </tbody>
        </table>
      </div>
      <div class="prompt">如果畫面跳出任何授權、確認、允許、送出、刪除、安裝、部署或付款提示，請先不要急著按。
請你幫我判斷這個畫面：
1. 這個動作會改哪裡？本機、GitHub、Vercel、公司系統，還是外部服務？
2. 這個動作會把資料送去哪裡？會不會公開、寄出、上傳或分享？
3. 這個動作能不能復原？如果失敗，怎麼回到原狀？
4. 這個動作會不會碰到個資、正式資料、金額、密碼、金鑰或費用？
5. 如果安全，請告訴我應該選哪一個；如果不安全，請叫我停下來。</div>
    </section>
    <section class="section callout-row">
      <article class="panel">
        <h2>帳號申請時怎麼跟學員說</h2>
        <ol>
          <li>GitHub 和 Vercel 都可以先申請個人帳號；課堂示範或個人測試通常可從免費方案開始。</li>
          <li>公司正式對外使用時，要確認公司帳號、團隊權限、方案與資料放置規範。</li>
          <li>建立 repo 前先確認公開範圍：public 代表任何拿到網址的人都可能看見內容。</li>
          <li>Vercel production URL 代表正式可公開瀏覽；noindex 只是請搜尋引擎不要收錄，不是隱私保護。</li>
        </ol>
      </article>
      <article class="panel">
        <h2>要怎麼調動 Codex 外掛</h2>
        <div class="prompt">請檢查目前可用的 Codex 外掛。
這個任務需要 GitHub、Vercel 和 Browser 相關能力。
如果外掛尚未啟用，請先告訴我：
1. 這個外掛會用來做什麼
2. 需要我授權或登入什麼
3. 啟用後你會怎麼驗證結果
請不要自行建立外部帳號、不要付款、不要發布未經確認的內容。</div>
      </article>
    </section>
    <section class="section" id="prompts">
      <h2>具體 Codex 操作指令</h2>
      <div class="check-grid">
        <article class="panel">
          <h3>1. 請 Codex 先做本機版本</h3>
          <div class="prompt">請幫我建立一個可公開瀏覽的靜態網站。
主題是：[填入你的主題]
資料來源是：[貼上已可公開的文字或摘要]
限制是：不要放個資、不要放內部逐字稿、不要放正式帳務或敏感資料。
請先做本機版本，完成後用瀏覽器檢查手機和桌機畫面。</div>
        </article>
        <article class="panel">
          <h3>2. 請 Codex 建 GitHub repo</h3>
          <div class="prompt">請幫我檢查目前資料夾是否適合建立 Git repo。
請先列出會被提交的檔案，等我確認沒有敏感資料後，再建立 repo。
請建立 README，寫清楚這個網站的目的、資料邊界、部署方式。
等我確認後，再推到 GitHub，回報 repo 網址。
完成後我應該會看到一個 GitHub 網址，裡面有檔案列表與 README。</div>
        </article>
        <article class="panel">
          <h3>3. 請 Codex 部署到 Vercel</h3>
          <div class="prompt">請把這個 GitHub repo 連到 Vercel，並部署成 production。
部署後請回報：
1. production URL
2. deployment id 或部署紀錄編號，之後查問題用
3. 手機與桌機檢查結果
4. noindex 狀態，至少檢查 HTML meta robots；若是正式部署，再確認 robots.txt 或 X-Robots-Tag
如果 Vercel 要我按 Import、Continue 或授權 GitHub，請先停下來確認畫面。</div>
        </article>
        <article class="panel">
          <h3>4. 請 Codex 做公開前檢查</h3>
          <div class="prompt">請用公開頁檢查角度幫我驗收：
1. 網址是否可在不同裝置開啟
2. 導覽與按鈕是否能點
3. 頁面是否有明顯錯字或台灣用語不自然
4. 是否有個資、內部資料、正式金額或不該公開的內容
5. 如果是 review 階段，是否有 noindex
請列出通過項目與需要修正的項目。</div>
        </article>
      </div>
    </section>
    <section class="section grid two">
      <article class="panel">
        <h2>完成後要交出什麼</h2>
        <ul>
          <li>GitHub repo 網址</li>
          <li>Vercel production URL</li>
          <li>手機與桌機畫面檢查結果</li>
          <li>README 或簡短說明，寫清楚公開範圍與資料邊界</li>
          <li>如果還在內部 review，確認 noindex 已存在</li>
          <li>實驗效果記錄：從本機到公開網址花多久、哪一步需要人工登入、公開前修掉哪些風險</li>
        </ul>
      </article>
      <article class="panel">
        <h2>公開部署的三個不要</h2>
        <ul>
          <li>不要把個資、未整理逐字稿、內部表單、正式帳務資料放到 public repo 或公開網址。</li>
          <li>不要請 Codex 自行發送外部訊息、付款、變更公司正式系統或處理月結結論。</li>
          <li>不要用個人測試帳號承接公司正式對外服務；正式使用前要確認公司帳號與權限。</li>
        </ul>
      </article>
    </section>
    <section class="section">
      <h2>卡關時查詢</h2>
      <p class="muted">官方文件多半是英文或偏技術；看不懂時，可以請 Codex 摘要成中文步驟，但帳號、授權與權限仍由本人確認。</p>
      <div class="cards">
        <article class="card"><strong>GitHub</strong><p><a href="https://docs.github.com/en/get-started/learning-about-github/types-of-github-accounts">帳號類型與方案</a></p></article>
        <article class="card"><strong>Vercel</strong><p><a href="https://vercel.com/docs/git/vercel-for-github">用 GitHub 部署到 Vercel</a></p></article>
        <article class="card"><strong>Codex</strong><p><a href="https://developers.openai.com/codex/app/browser">Browser 外掛與頁面驗證</a></p></article>
      </div>
    </section>`;
  return pageShell({
    title: "作品公開部署工作流：GitHub repo 與 Vercel",
    eyebrow: "課程尾聲延伸",
    intro: "把 Codex 做出的頁面或小工具，整理成 GitHub repo（雲端專案資料夾），部署到 Vercel production（正式公開網址），並用人工檢查確認可以公開。",
    body,
    active: "publish",
  });
}

function writePage(path, html) {
  ensureDir(path);
  writeFileSync(path, html, "utf8");
}

writePage("public/needs/index.html", buildNeedsIndex());
writePage("public/needs/workflow-intake/index.html", buildWorkflowIntakePage());
writePage("public/learn/index.html", buildLearnPage());
for (const person of people) {
  writePage(join("public/needs", person.slug, "index.html"), buildPersonPage(person));
}
writePage("public/kit/index.html", buildKitPage());
writePage("public/exercises/index.html", buildExercisePage());
writePage("public/publish/index.html", buildPublishPage());
