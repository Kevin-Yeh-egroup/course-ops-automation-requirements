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

function pageShell({ title, eyebrow, intro, body, sectionClass = "" }) {
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
    body { margin: 0; background: var(--bg); color: var(--ink); line-height: 1.72; }
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
    .nav { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
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
    }
    .button-link.primary, .nav a.primary { border-color: var(--blue); background: var(--blue); color: #fff; }
    .hero {
      background: var(--navy);
      color: #fff;
      padding: clamp(42px, 8vw, 84px) 0;
    }
    .shell { width: min(1120px, calc(100% - 36px)); margin: 0 auto; }
    .hero .shell { display: grid; gap: 18px; }
    .eyebrow { margin: 0; color: #9be1d5; font-size: 0.94rem; font-weight: 900; }
    h1, h2, h3, h4, p { margin-top: 0; }
    h1 { max-width: 900px; margin-bottom: 0; font-size: clamp(2.15rem, 5vw, 4rem); line-height: 1.1; letter-spacing: 0; }
    .lead { max-width: 880px; margin-bottom: 0; color: rgba(255, 255, 255, 0.82); font-size: clamp(1.05rem, 2vw, 1.25rem); }
    main.shell { padding: 42px 0 76px; }
    .section { margin: 34px 0; }
    .cards, .grid { display: grid; gap: 16px; }
    .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .card, .panel, .md article {
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
    .md { display: grid; gap: 20px; }
    .md article { padding: clamp(20px, 4vw, 34px); }
    .md h1 { color: var(--navy); font-size: clamp(1.9rem, 4vw, 3rem); }
    .md h2 { margin-top: 34px; color: var(--navy); font-size: clamp(1.35rem, 3vw, 2rem); line-height: 1.25; }
    .md h3 { margin-top: 24px; color: var(--navy); font-size: 1.22rem; }
    .table-wrap { overflow-x: auto; margin: 16px 0 24px; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; }
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
      .cards, .grid.two { grid-template-columns: 1fr; }
      table { min-width: 640px; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="brand">Codex 行政工作實驗課</div>
    <nav class="nav" aria-label="站內導覽">
      <a href="/">課程頁</a>
      <a href="/slides/">學員簡報</a>
      <a href="/kit/">練習包</a>
      <a href="/exercises/">四個練習</a>
      <a class="primary" href="/needs/">需求整理</a>
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
    <div class="shell">版本：2026.06.09｜狀態：public-with-noindex review｜本頁可用網址瀏覽，但 noindex 不是隱私保護；公開頁不放完整逐字稿、正式資料或可識別個資。</div>
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
    <p style="margin-top:16px"><a class="button-link primary" href="./${person.slug}/">查看需求整理</a></p>
  </article>`;
}

function buildNeedsIndex() {
  const commonNeeds = existsSync(commonNeedsPath) ? markdownToHtml(readFileSync(commonNeedsPath, "utf8")) : "";
  const donePeople = people.filter((person) => person.status === "已整理");
  const pendingPeople = people.filter((person) => person.status !== "已整理");
  const body = `
    <section class="notice">
      這裡放回每位夥伴的需求整理頁，並保留辦公室共通需求摘要。這些頁面是給內部討論與課程設計使用，仍維持 noindex。
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
    eyebrow: "需求整理",
    intro: "從佩欣、思宜、怡君、瑜君、阿丸、素菁的材料整理出個別需求頁，並保留後續待補名單。",
    body,
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
    eyebrow: "個別需求頁",
    intro: person.summary,
    body,
    sectionClass: "md-page",
  });
}

function buildKitPage() {
  const body = `
    <section class="notice">
      這份練習包不是下載檔，而是課堂中可以直接打開、照著填的材料。學員可以把自己的低風險工作片段放進去操作，課後留下可重複指令與人工確認清單。
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
    <section class="section grid two">
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
    <section class="section">
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
    <section class="section">
      <h2>人工確認清單</h2>
      <div class="cards">
        <article class="card soft-mint"><strong>可修改使用</strong><p>摘要、清單、草稿、檢查表、流程草圖。</p></article>
        <article class="card soft-amber"><strong>需要人工確認</strong><p>日期、金額、稱謂、收件人、對外語氣、正式欄位。</p></article>
        <article class="card soft-blush"><strong>需要保留人工決策</strong><p>外部發送、正式資料更新、個資揭露、金流、核銷或月結相關判斷。</p></article>
      </div>
    </section>
    <section class="section">
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
      四個練習都用同一個基本方法：說明工作、提供資料、指定輸出、標出人工確認、檢查後修正。課堂共同示範後，每位學員選最接近自己工作的一題操作。
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
  });
}

function writePage(path, html) {
  ensureDir(path);
  writeFileSync(path, html, "utf8");
}

writePage("public/needs/index.html", buildNeedsIndex());
for (const person of people) {
  writePage(join("public/needs", person.slug, "index.html"), buildPersonPage(person));
}
writePage("public/kit/index.html", buildKitPage());
writePage("public/exercises/index.html", buildExercisePage());
