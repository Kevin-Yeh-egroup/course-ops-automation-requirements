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
    slug: "ops-report-radar",
    name: "真實案例一：日週月報營運雷達",
    outcome: "把日報、週報、月報會用到的 Gmail、Google Ads、好理家在後台與電子報訊號，整理成可檢查的營運摘要。",
    situation: "這個案例一開始看起來只是「每天要看很多數字和信」。真正困難的是來源很多，而且可信度不一樣。Gmail 有真人回覆與系統通知，Google Ads 有投放數字，好理家在後台有實際使用狀態，電子報則是外部學習素材。如果直接請 Codex 做結論，很容易把已確認、部分確認和還沒讀到的資料混在一起。",
    purpose: "把每天、每週、每月要看的訊號分層，最後整理成可以交付、可以追問的報表。",
    journey: [
      "我先把問題說成「我需要一份今天可以信任的營運狀態」，而不是「幫我把所有數據整理好」。",
      "接著把資料來源拆開：Gmail、Google Ads、好理家在後台、電子報，以及既有的日報、週報、月報。",
      "第一版整理後，我再補充一個重點：報表要標清楚資料狀態，哪些已確認、哪些只有部分確認、哪些目前還讀不到。",
      "後來流程逐漸固定：日報看今日狀態與異常，週報看趨勢與管理摘要，月報看累積成果與需要決策的地方。",
    ],
    needStatement: [
      "目的：確認今天、這週、這個月的營運狀態是否正常。",
      "資料：Gmail、Google Ads、好理家在後台、電子報，以及既有報表。",
      "風險：不要把未確認資料寫成結論，也不要漏掉 Ads 或後台異常。",
      "先請 Codex 做的事：分來源整理、標出資料狀態、產出報表草稿，並列出需要人工重看的地方。",
    ],
    workflow: ["先打開 Gmail，看有沒有真人回覆、系統通知或重要回饋", "再看 Google Ads 的花費、點擊與異常", "打開好理家在後台，確認實際使用狀態", "對照既有日報、週報、月報，補上缺漏或差異", "整理成可回報的摘要，標出還沒確認的資料"],
    codexHelp: ["把 Gmail、Ads、後台與電子報分成不同訊號", "整理今日異常、週趨勢與月累積重點", "標出已確認、部分確認、目前讀不到的資料", "把電子報整理成可審閱的觀察卡，而不是直接變成決策"],
    humanCheck: ["Google Ads 數字是否真的來自當天後台", "好理家在後台是否已成功開啟並確認", "Gmail 回饋是否需要真人回覆", "週報或月報結論是否有足夠證據", "哪些資料只能先標成待補"],
    learnerTakeaway: "學員要學到的是：報表不是把所有資料塞成一段結論，而是先說清楚來源、證據與限制。Codex 可以協助整理與寫草稿，但數字、異常、決策與對外說法仍要由人把關。",
  },
  {
    slug: "transcript-content",
    name: "真實案例二：逐字稿變成文章與通知草稿",
    outcome: "把錄影或逐字稿整理成可審閱的文章素材，並留下處理狀態與待確認事項。",
    situation: "這不是單純把逐字稿改成文章。真實工作會先遇到幾個問題：錄影檔能不能處理、逐字稿是否完整、文章要放進哪個內容流程、哪一筆已完成、哪一筆還在等確認。如果沒有把狀態整理清楚，後面很容易重複處理或漏掉素材。",
    purpose: "把影片到文章的中間流程攤開，讓檔案狀態、文章草稿與待確認事項都能被追蹤。",
    journey: [
      "我先請 Codex 幫我盤點錄影與管理表，而不是直接叫它寫文章。",
      "接著把流程拆成：找檔案、確認狀態、整理逐字稿、產文章草稿、回寫管理表。",
      "中間發現排序、標題與狀態很重要；如果不整理清楚，後面就不知道哪一筆已完成。",
      "最後我把可處理的錄影先批次處理，未確認的部分留在管理表，避免混在一起。",
    ],
    needStatement: [
      "讀者：文章最後要給一般民眾、學員，還是內部同仁看。",
      "資料：錄影檔、逐字稿、管理表與文章位置在哪裡。",
      "先做哪一步：先整理摘要、先做文章草稿，或先確認缺少哪些資料。",
      "限制：不能自動發布、不能改變講者原意，也不能忽略待確認事實。",
    ],
    workflow: ["先確認錄影檔與逐字稿是否齊全", "手動整理重點與可用段落", "打開管理表確認這筆內容目前狀態", "寫出文章草稿或摘要，再標出待確認句子", "回到管理表更新進度，避免下次重複處理"],
    codexHelp: ["整理逐字稿重點", "把口語內容改成文章草稿", "列出需要人工查證的內容", "協助回顧哪些素材已處理、哪些還沒完成"],
    humanCheck: ["講者原意是否保留", "人名、日期與專有名詞是否正確", "內容是否適合公開", "文章是否真的可以放進正式流程"],
    learnerTakeaway: "學員要學到的是：內容工作不是貼上文字請 AI 改寫而已，要先說明讀者、用途、素材狀態與審稿邊界。",
  },
  {
    slug: "sheet-status",
    name: "真實案例三：自定義名詞與派薪前檢查",
    outcome: "把候選名詞、修正對照與派薪前資料整理成審閱包，讓人可以清楚判斷下一步。",
    situation: "這個案例很容易被誤會成讓 AI 判斷薪資。實際上，我做的是比較保守的整理：先把候選名詞、修正對照、事件狀態與派薪前資料攤開，讓人看得到依據，再決定是否寫入正式系統。",
    purpose: "讓承辦人看清楚哪些名詞可能可以納入、哪些已存在、哪些缺證據、哪些派薪前還不能動。",
    journey: [
      "我先讓 Codex 讀取目前仍在處理中的項目，整理成一份可審閱清單。",
      "第一版不直接執行，而是先分成可納入、不可納入、已存在、需要補證據。",
      "確認規則後，我才把可執行的批次獨立出來；正式新增、關閉事件與薪資建立都要另外確認。",
      "做完後還要留下前後證據，知道哪一筆為什麼被處理、哪一筆為什麼暫停。",
    ],
    needStatement: [
      "影響範圍：名詞資料、事件狀態與派薪前確認。",
      "判斷依據：候選名詞、修正對照、工作類型、日期與狀態。",
      "不能代決定的事：正式新增、關閉事件、建立薪資。",
      "先請 Codex 做的事：整理證據、分組、標記疑點、列出待確認項目。",
    ],
    workflow: ["先打開候選名詞與事件清單", "對照既有名詞，確認是否已存在或疑似重複", "查看事件狀態、工作類型與日期", "手動整理可處理、待補證據、先暫停的項目", "正式新增、關閉事件或派薪前，再請人複查"],
    codexHelp: ["把大量候選資料整理成清楚分類", "找出已存在或疑似重複項目", "標出缺證據與低信心資料", "產出承辦人可以審閱的確認包"],
    humanCheck: ["是否真的可以新增正式名詞", "是否符合派薪資格", "是否可以關閉事件", "是否要建立薪資或暫停處理"],
    learnerTakeaway: "學員要學到的是：牽涉正式紀錄或薪資時，Codex 先做整理與提示，不直接替人下結論。",
  },
  {
    slug: "event-admin",
    name: "真實案例四：課程改版包與交接清單",
    outcome: "把模糊的改版想法整理成教材改版包，讓投影片、練習題與上課流程一致。",
    situation: "這個案例就是這份教材本身。原本的課程有課務、逐字稿、表格與活動行政，但你覺得還是不夠像真實工作。後來我們改用你在 Codex 裡實際做過的工作，去識別化後包裝成學生能理解的情境。",
    purpose: "讓學員看到教材如何從模糊感受變成可上課材料：先說哪裡不真實，再找真實案例，最後改投影片、練習頁與檢查方式。",
    journey: [
      "你先說：課程與練習題太不實際，希望學生看到可以做到什麼、怎麼做、怎麼確認。",
      "我先從你的工作記錄中找可去識別化的案例，再和原本四個情境對照。",
      "你再指定案例三改成自定義名詞與派薪前檢查、案例四改成課程改版。",
      "後續我們又調整呈現方式：先講情境與歷程，再講工作切分，避免一開始就堆很多專有名詞。",
    ],
    needStatement: [
      "問題：學生會覺得題目不真實、太像練習題。",
      "方向：改用真實工作去識別化，包裝成可上課的情境。",
      "範圍：案例、投影片、練習頁、課程說明與檢查方式。",
      "限制：不要露出敏感資料，也不要讓學員以為可以全自動。",
    ],
    workflow: ["先看原本教材哪裡不夠貼近真實工作", "回想最近實際做過哪些 Codex 工作", "挑出可以去識別化、也適合上課的案例", "手動改投影片、練習頁與課綱文字", "最後逐頁檢查案例是否一致、語氣是否適合學員"],
    codexHelp: ["整理你提出的口語需求", "把案例對照到原本課程架構", "改寫成學員能懂的情境", "同步更新多個教材頁面並檢查連結"],
    humanCheck: ["案例是否真的代表你的工作", "語氣是否適合學員", "是否過度技術化", "是否有不該公開的內部資訊"],
    learnerTakeaway: "學員要學到的是：和 Codex 合作時，可以先說感受與目標，再一輪一輪把教材、流程或文件修到可用。",
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
  { key: "concepts", label: "Agent / Skill", href: "/concepts/" },
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

function sentenceParagraphs(value) {
  return (String(value).match(/[^。！？]+[。！？]?/g) || [String(value)])
    .map((part) => part.trim())
    .filter(Boolean);
}

function renderScenario(value) {
  return sentenceParagraphs(value)
    .map((part) => `<p>${escapeHtml(part)}</p>`)
    .join("");
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
    .scenario-card {
      display: grid;
      gap: 10px;
      margin: 18px 0;
      border: 1px solid #c7d5da;
      border-left: 6px solid var(--teal);
      border-radius: var(--radius);
      padding: 18px 20px;
      background: #f0faf8;
      color: #254d49;
    }
    .scenario-card strong {
      color: var(--navy);
      font-size: 1.04rem;
    }
    .scenario-body {
      display: grid;
      gap: 8px;
    }
    .scenario-body p {
      margin: 0;
      line-height: 1.78;
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
      這頁是給上課當天使用的入口。照順序走就好：先看簡報，再看操作說明，接著打開練習包與真實案例題；最後再用白話理解 Agent / Skill。
    </section>
    <section class="section">
      <h2>上課照這五步走</h2>
      <div class="path">
        <article class="path-card accent-blue">
          <small>第 1 步</small>
          <div><strong>看課程簡報</strong><p class="muted">先理解真實行政案例裡，Codex 能協助到什麼程度。</p></div>
          <a class="button-link primary" href="/slides/">開始看簡報</a>
        </article>
        <article class="path-card accent-teal">
          <small>第 2 步</small>
          <div><strong>看操作說明</strong><p class="muted">先完成 Codex 安裝、登入、練習資料夾與第一次開啟確認。</p></div>
          <a class="button-link primary" href="/guide/">看操作說明</a>
        </article>
        <article class="path-card accent-wine">
          <small>第 3 步</small>
          <div><strong>打開練習包</strong><p class="muted">把自己的工作填進需求說明卡、流程卡與確認清單。</p></div>
          <a class="button-link primary" href="/kit/">打開練習包</a>
        </article>
        <article class="path-card accent-gold">
          <small>第 4 步</small>
          <div><strong>選一題真實案例</strong><p class="muted">從日週月報營運雷達、逐字稿、名詞/派薪檢查、課程改版包中選一題。</p></div>
          <a class="button-link primary" href="/exercises/">選操作題目</a>
        </article>
        <article class="path-card accent-green">
          <small>第 5 步</small>
          <div><strong>課後自行探索</strong><p class="muted">課堂先學共同操作；課後再把自己的工作套入練習包，整理成果與確認責任。</p></div>
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
        <p>如果你是學員，優先使用這四個頁面：課程簡報、操作說明、練習包、操作題目。練習題不是考卷，而是從真實工作拆出來的範例；迷路時回到「上課入口」。</p>
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
    intro: "把課程簡報、練習包與四個真實案例題整理成一條路徑，讓學員知道如何溝通、如何操作、如何檢查。",
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
        <p class="muted">後續陪夥伴補工作細節時，先用同一份模板整理觸發、資料來源、步驟、產出、確認責任與 AI 協助邊界，再決定是否進入沙盒實驗。</p>
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
      本頁來源：<code>${escapeHtml(workflowIntakePath)}</code>。這是陪伴夥伴蒐集工作細節的共用模板，不是正式系統規格；涉及個資、帳務、個案、外部發送或正式寫回時，仍需保留人工核准。
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
    intro: "陪夥伴把真實工作講清楚，再判斷哪些段落適合 AI 協助、哪些必須由人確認。",
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
      本頁來源：<code>${escapeHtml(person.source)}</code>。內容是需求整理與工作流分析，不是正式系統規格；涉及外部發送、正式資料更新、個資、金額或月結的動作仍需人工核准。
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
      這份練習包不是要大家背固定句子，而是幫學員把一件工作說清楚：為什麼要做、手上有什麼、平常怎麼做、哪裡容易出錯、最後要交付什麼。
    </section>
    <section class="section next-strip">
      <div>
        <strong>你現在在第 3 步：打開練習包。</strong>
        <p class="muted">先填需求說明卡與工作流程整理卡。填完後，到操作題目頁看真實案例，再回來檢查自己的工作是否說清楚。</p>
      </div>
      <a class="button-link primary" href="/exercises/">下一步：選操作題目</a>
    </section>
    <section class="section">
      <h2>練習包內容</h2>
      <div class="cards">
        <article class="card accent-blue"><strong>1. 工作流程整理卡</strong><p>把工作拆成開始條件、資料來源、處理步驟、確認責任與輸出。</p></article>
        <article class="card accent-teal"><strong>2. 需求說明卡</strong><p>用白話說清楚目的、資料、希望 Codex 協助的範圍與不能做的事。</p></article>
        <article class="card accent-gold"><strong>3. 四題真實案例任務單</strong><p>日週月報營運雷達、逐字稿內容、名詞/派薪檢查、課程改版包。</p></article>
        <article class="card accent-wine"><strong>4. 互動歷程整理卡</strong><p>記錄自己怎麼和 Codex 來回修正，哪些地方越講越清楚。</p></article>
        <article class="card accent-green"><strong>5. 確認清單</strong><p>把外部發送、正式資料更新、金額、個資與正式判斷標出來。</p></article>
        <article class="card accent-blue"><strong>6. 工具化程度</strong><p>知道一次性整理、固定做法與分步協助的差別。</p></article>
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
          <li>我要怎麼跟同事或主管說明這不是全自動，而是可檢查的草稿或清單？</li>
        </ol>
      </article>
      <article class="panel">
        <h2>成果檢查表</h2>
        <ol>
          <li>輸出有沒有回答原本的工作問題？</li>
          <li>日期、金額、人名、單位、地點是否需要人確認？</li>
          <li>是否清楚列出可修改使用、需確認、需補資料？</li>
          <li>下次再跑時，資料與需求說明是否足夠清楚？</li>
          <li>這次有沒有省下重複整理或找缺漏的時間？</li>
        </ol>
      </article>
    </section>
    <section class="section" id="need-card">
      <h2>需求說明卡</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>要說清楚的事</th><th>學員可以這樣想</th></tr></thead>
          <tbody>
            <tr><td>我要達到的目的</td><td>這件工作最後要讓誰比較省力？要避免什麼漏掉？</td></tr>
            <tr><td>目前手上有什麼</td><td>有表格、錄音、逐字稿、訊息紀錄、舊教材，還是只有口頭需求？</td></tr>
            <tr><td>平常怎麼做</td><td>先做哪一步？中間要看哪些資料？最後要交付什麼？</td></tr>
            <tr><td>最容易出錯的地方</td><td>日期、人名、金額、對外語氣、正式資料更新，哪一種最不能錯？</td></tr>
            <tr><td>希望 Codex 先協助哪裡</td><td>先整理、先分類、先找缺漏、先做草稿，還是先幫我拆步驟？</td></tr>
            <tr><td>哪些一定要人確認</td><td>凡是發送、寫回、公開、定案、派薪、個資與正式承諾，都要先停下來確認。</td></tr>
          </tbody>
        </table>
      </div>
    </section>
    <section class="section" id="communication-template">
      <h2>互動歷程整理卡</h2>
      <div class="cards">
        <article class="card accent-blue"><strong>第一輪</strong><p>我先說明情境和目的，不急著要求 Codex 給最後答案。</p></article>
        <article class="card accent-teal"><strong>第二輪</strong><p>我看 Codex 的整理結果，補充資料來源、缺漏、對象與不能做的事。</p></article>
        <article class="card accent-gold"><strong>第三輪</strong><p>我請 Codex 把工作切成流程，並列出需要人確認的地方。</p></article>
      </div>
    </section>
    <section class="section" id="concepts-link">
      <h2>工具化程度</h2>
      <div class="next-strip">
        <div>
          <strong>這裡只先判斷做到哪一步。</strong>
          <p class="muted">是一次性整理、固定做法，還是未來可能分步協助？完整說明放在下一頁，避免在練習包重複講一遍。</p>
        </div>
        <a class="button-link primary" href="/concepts/">看 Agent / Skill 說明頁</a>
      </div>
    </section>
    <section class="section" id="human-checklist">
      <h2>確認清單</h2>
      <div class="cards">
        <article class="card soft-mint"><strong>可修改使用</strong><p>摘要、清單、草稿、檢查表、流程草圖。</p></article>
        <article class="card soft-amber"><strong>需要人確認</strong><p>日期、金額、稱謂、收件人、對外語氣、正式欄位。</p></article>
        <article class="card soft-blush"><strong>需要保留人工決策</strong><p>外部發送、正式資料更新、個資揭露、金流、核銷或月結相關判斷。</p></article>
      </div>
    </section>
    <section class="section" id="review">
      <h2>效果記錄表</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>項目</th><th>請填寫</th></tr></thead>
          <tbody>
            <tr><td>我今天選的工作</td><td>例如：日週月報營運雷達、逐字稿摘要、名詞/派薪檢查、課程改版包</td></tr>
            <tr><td>原本大約花多久</td><td>估計原本整理、檢查或寫草稿需要的時間</td></tr>
            <tr><td>Codex 幫我產出什麼</td><td>草稿、清單、表格、流程、待確認事項</td></tr>
            <tr><td>這份輸出要怎麼交代</td><td>我要怎麼讓同事、主管或窗口看懂：這是草稿、檢查清單，還是待確認資料</td></tr>
            <tr><td>仍需確認</td><td>列出日期、金額、人名、對外發送、正式資料更新等</td></tr>
            <tr><td>下一次要修正</td><td>資料要補什麼、流程要切得更細，或哪裡需要更早請人確認</td></tr>
          </tbody>
        </table>
      </div>
    </section>`;
  return pageShell({
    title: "課堂練習包",
    eyebrow: "學員操作材料",
    intro: "一份可直接在課堂上照著填的練習包，協助同仁把真實工作講清楚、拆成流程、留下可檢查成果與確認點。",
    body,
    active: "kit",
  });
}

function buildConceptsPage() {
  const body = `
    <section class="notice">
      這頁只做一件事：讓學員分清楚一次性需求、Skill 與 Agent。課堂不要求現場建立正式工具。
    </section>
    <section class="section">
      <h2>先用一個例子理解</h2>
      <div class="grid two">
        <article class="card soft-sky"><strong>第一次做</strong><p>你先跟 Codex 說明情境：我有一份逐字稿，要整理成文章草稿，請先列重點與需要確認的事。</p></article>
        <article class="card soft-mint"><strong>做過幾次後</strong><p>你發現每次都會要求讀者、用途、摘要、待確認事實與人工審閱，這些穩定規則就可以整理成方法。</p></article>
      </div>
    </section>
    <section class="section grid two">
      <article class="panel">
        <h2>Skill 是什麼</h2>
        <p>Skill 可以先把它想成「工作方法小抄」。當同一類事情做過幾次後，你會知道每次都要交代哪些資料、要產出什麼格式、哪些地方一定要人看。把這些固定下來，下次就不用重新解釋一大段。</p>
        <ul>
          <li>適合重複但不太複雜的工作。</li>
          <li>重點是固定語氣、格式、檢查項目與不能做的事。</li>
          <li>它不代表會自動送出、寫回系統或取代人判斷。</li>
        </ul>
      </article>
      <article class="panel">
        <h2>Agent 是什麼</h2>
        <p>Agent 可以先把它想成「有任務邊界的工作助理」。它不只是改一句話，而是依照你給的目的，連續做幾個步驟：先看資料、整理狀態、列出問題、產出草稿，再提醒你哪些地方要確認。</p>
        <ul>
          <li>適合有多個步驟、會遇到例外的工作。</li>
          <li>需要說清楚資料來源、完成標準、停止點與確認責任。</li>
          <li>正式自動化前，要另外確認權限、風險與責任分工。</li>
        </ul>
      </article>
    </section>
    <section class="section">
      <h2>兩者差在哪裡</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>問題</th><th>Skill</th><th>Agent</th></tr></thead>
          <tbody>
            <tr><td>適合什麼</td><td>格式固定、規則清楚、每次都很像的工作。</td><td>步驟比較多、要看狀態、需要中途停下確認的工作。</td></tr>
            <tr><td>要先準備什麼</td><td>常用格式、輸出樣子、檢查清單。</td><td>工作目標、資料來源、流程、停止規則、確認責任。</td></tr>
            <tr><td>今天課堂做到哪裡</td><td>先知道哪些做法值得整理成方法。</td><td>先知道哪些工作未來可能適合設計成助理流程。</td></tr>
          </tbody>
        </table>
      </div>
    </section>
    <section class="section grid two">
      <article class="panel">
        <h2>怎麼判斷要不要升級</h2>
        <ol>
          <li>這件事是否已經重複做過兩三次？</li>
          <li>每次要提供的資料是否差不多？</li>
          <li>輸出格式是否能說清楚？</li>
          <li>哪些地方要停下來確認，是否已經很明確？</li>
          <li>如果 Codex 做錯，能不能容易看出來並修正？</li>
        </ol>
      </article>
      <article class="panel">
        <h2>課堂先不要急著做什麼</h2>
        <ol>
          <li>不要一開始就要求全自動。</li>
          <li>不要把正式發送、寫回系統、派薪或公開發布交給 Codex 自己決定。</li>
          <li>不要把還沒穩定的做法包成長期工具。</li>
          <li>先把情境、流程與確認責任說清楚，再討論是否需要 Skill 或 Agent。</li>
        </ol>
      </article>
    </section>
    <section class="section next-strip">
      <div>
        <strong>回到案例時，請只問一件事。</strong>
        <p class="muted">這題目前停在一次性整理、固定做法，還是未來可能分步協助？</p>
      </div>
      <a class="button-link primary" href="/exercises/">回到四個案例</a>
    </section>`;
  return pageShell({
    title: "Agent / Skill 白話說明",
    eyebrow: "概念說明",
    intro: "給非資訊背景學員看的簡明說明：先理解三種程度，再回到自己的工作判斷適合做到哪一步。",
    body,
    active: "concepts",
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
        <section class="scenario-card">
          <strong>情境先看懂</strong>
          <div class="scenario-body">${renderScenario(exercise.situation)}</div>
        </section>
        <div class="grid two">
          <article class="card soft-sky"><strong>我要達到的目的</strong><p>${escapeHtml(exercise.purpose)}</p></article>
          <article class="card soft-amber"><strong>如果不用 Codex，平常我會怎麼做</strong><ol>${exercise.workflow.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></article>
        </div>
        <h3>我跟 Codex 互動的歷程</h3>
        <ol class="steps">${exercise.journey.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <h3>我怎麼把需求說清楚</h3>
        <ol class="steps">${exercise.needStatement.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <h3>Codex 可以協助到哪裡</h3>
        <ol class="steps">${exercise.codexHelp.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <h3>仍然要由人確認</h3>
        <ol class="steps">${exercise.humanCheck.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <article class="card accent-teal"><strong>這題要學會的切分</strong><p>${escapeHtml(exercise.learnerTakeaway)}</p></article>
      </div>
    </section>`).join("");

  const body = `
    <section class="notice">
      四個練習都從真實行政工作改寫。每一題先看情境，再看我怎麼和 Codex 來回互動、怎麼把工作切開、哪些地方仍要確認。重點不是背固定句子，而是學會把需求說清楚。
    </section>
    <section class="section next-strip">
      <div>
        <strong>你現在在第 4 步：選一題真實案例操作。</strong>
        <p class="muted">先選最接近自己工作的題目，照著看情境、目的、原本流程、互動歷程與確認點。課後再用自己的工作素材重新描述一次。</p>
      </div>
      <a class="button-link primary" href="/concepts/">下一步：看 Agent / Skill</a>
    </section>
    <section class="section">
      <h2>四個真實案例題目</h2>
      <div class="cards">${exercises.map(exerciseCard).join("")}</div>
    </section>
    ${details}`;
  return pageShell({
    title: "四個真實案例操作說明",
    eyebrow: "課堂實作題目",
    intro: "每題都先用情境帶入，再呈現目的、原本流程、互動歷程與仍需確認的地方。",
    body,
    active: "exercises",
  });
}

function buildPublishPage() {
  const body = `
    <section class="notice">
      這一段放在課程尾聲，定位是「作品公開化的下一步」。前面 90 分鐘先學會和 Codex 梳理工作、產出草稿與檢查表；如果之後要把成果做成可公開瀏覽的頁面或小工具，就照這頁把 GitHub repo（放網站檔案與修改紀錄的雲端專案資料夾）與 Vercel production（正式可開啟的公開網址）串起來。這不是寫程式考試，而是學會把已確認可公開的成果，安全放到一個可開啟的網址。
    </section>
    <section class="section" id="terms">
      <h2>先把五個常見術語翻成白話</h2>
      <p class="muted">學員不用背指令，只要先知道每個字代表哪一種動作。真正要做之前，都可以請 Codex 用白話再說一次。</p>
      <div class="cards">
        <article class="card accent-blue"><strong>repo</strong><p>雲端專案資料夾。網站檔案、圖片、README 與修改紀錄都放在這裡。</p></article>
        <article class="card accent-teal"><strong>commit</strong><p>存一個修改紀錄。像幫這次修改拍照，順手寫一句「這次改了什麼」。</p></article>
        <article class="card accent-wine"><strong>push</strong><p>把本機修改上傳到 GitHub。也就是把自己電腦裡的新版交到雲端資料夾。</p></article>
        <article class="card accent-gold"><strong>pull</strong><p>把 GitHub 上的最新版拉回來。開始修改前先同步，避免拿舊版本繼續改。</p></article>
        <article class="card accent-green"><strong>deploy</strong><p>發布成可開啟的網址。Vercel 會讀取 repo 裡的成果，產生可以分享或檢查的頁面。</p></article>
      </div>
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
        <article class="deploy-step accent-blue"><small>協作 6</small><strong>請它驗證</strong><p class="muted">要求 Codex 回報網址、截圖、noindex 與仍需人確認的事項。</p></article>
      </div>
      <div class="cards">
        <article class="card soft-sky"><strong>開場先說目的</strong><p>這份成果是給誰看、希望別人看完知道什麼、哪些資料可以公開。</p></article>
        <article class="card soft-mint"><strong>先請 Codex 拆步驟</strong><p>先看它會怎麼安排工作，再決定哪一步可以做、哪一步要先停下來。</p></article>
        <article class="card soft-amber"><strong>遇到登入或公開先停</strong><p>凡是授權、發布、刪除、外部寄送或付款，都先回到本人確認。</p></article>
        <article class="card soft-blush"><strong>每一步都要看結果</strong><p>完成後要看得到網址、畫面、檔案清單、檢查結果或仍需人確認的地方。</p></article>
      </div>
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
      <div class="cards">
        <article class="card soft-sky"><strong>會改哪裡</strong><p>本機檔案、GitHub、Vercel、公司系統，還是外部服務。</p></article>
        <article class="card soft-mint"><strong>資料會去哪裡</strong><p>會不會公開、寄出、上傳、分享，或讓其他人看得到。</p></article>
        <article class="card soft-amber"><strong>能不能復原</strong><p>如果按下去失敗，是否能回到原狀，誰可以幫忙復原。</p></article>
        <article class="card soft-blush"><strong>是否碰到敏感資料</strong><p>個資、正式資料、金額、密碼、金鑰、費用或公司權限都要先停。</p></article>
      </div>
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
        <h2>要怎麼理解 Codex 外掛</h2>
        <p>外掛可以先理解成「讓 Codex 看得到或做得到某些事情的授權」。上課不用背外掛名稱，只要確認三件事：這個外掛要用來做什麼、需要登入哪個帳號、啟用後會怎麼驗證。</p>
        <ul>
          <li>GitHub 類能力：用來建立或查看專案檔案與修改紀錄。</li>
          <li>Vercel 類能力：用來把已確認可公開的成果變成網址。</li>
          <li>Browser 類能力：用來實際打開頁面、檢查手機與桌機畫面。</li>
        </ul>
      </article>
    </section>
    <section class="section" id="prompts">
      <h2>公開前需求說明卡</h2>
      <div class="check-grid">
        <article class="panel">
          <h3>1. 先說成果要給誰看</h3>
          <ul>
            <li>主題是什麼，使用者看完要知道什麼。</li>
            <li>資料來源是否已確認可以公開。</li>
            <li>哪些內容不能放上公開頁，例如個資、內部逐字稿、正式帳務或敏感資料。</li>
            <li>先做本機版本，完成後再看手機和桌機畫面。</li>
          </ul>
        </article>
        <article class="panel">
          <h3>2. 再確認會留下哪些檔案</h3>
          <ul>
            <li>先看會被提交的檔案清單。</li>
            <li>確認沒有敏感資料後，再建立 GitHub repo。</li>
            <li>README 要寫清楚網站目的、資料邊界與後續維護方式。</li>
            <li>完成後要看得到 GitHub 網址、檔案列表與 README。</li>
          </ul>
        </article>
        <article class="panel">
          <h3>3. 發布前先確認邊界</h3>
          <ul>
            <li>Vercel 會把成果變成可開啟網址，發布前先確認內容可以公開。</li>
            <li>如果畫面要求 Import、Continue 或授權 GitHub，先確認這是不是本次 repo。</li>
            <li>完成後要看得到 production URL 與部署紀錄。</li>
            <li>review 階段要確認 noindex；正式公開前仍要人工看內容。</li>
          </ul>
        </article>
        <article class="panel">
          <h3>4. 最後看公開前檢查</h3>
          <ul>
            <li>網址是否可在不同裝置開啟。</li>
            <li>導覽與按鈕是否能點。</li>
            <li>是否有明顯錯字或台灣用語不自然。</li>
            <li>是否有個資、內部資料、正式金額或不該公開的內容。</li>
            <li>哪些已通過，哪些還需要人工修正。</li>
          </ul>
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
writePage("public/concepts/index.html", buildConceptsPage());
writePage("public/exercises/index.html", buildExercisePage());
writePage("public/publish/index.html", buildPublishPage());
