# Codex 行政工作實驗課｜公開審閱與學員教材

這個 repo 目前的 production 以「Codex 行政工作實驗課」總入口為主，並提供學員上課入口、課程簡報、Codex 操作說明、練習包、操作題目與需求資料總覽。公開頁只呈現課程目的、學習成果、學員操作材料、風險控管與需求摘要，不放同仁逐字稿、個別敏感細節、內部系統操作細節或正式資料。

## Production URL

<https://course-ops-automation-requirements.vercel.app>

## 公開輸出邊界

- Vercel `outputDirectory` 設為 `public/`。
- Production 只部署總入口、學員教材頁、需求摘要頁、`robots.txt` 與安全視覺資產。
- `people/`、`shared-modules/`、`training/`、`outputs/` 等內部材料不作為 production 靜態輸出目錄。
- `noindex/nofollow/noarchive` 保留於 meta、Vercel header 與 robots.txt。
- `noindex` 不是權限控管，因此 production 首頁仍避免放入敏感資訊。

## 主管版課綱

主管版文字稿位於：

`publication/supervisor-course-outline.md`

## 課程一句話定位

一堂 90 分鐘內的入門實作課，讓同仁先用安全範例練習資料整理、缺漏檢查與草稿產出，並建立明確的人審邊界；個人工作套用與收尾整理作為課後自行探索。

## 內部資料

先前同仁需求與共用模組仍保留在 repo 內，作為內部整理與後續開發討論基礎。這些材料不應直接作為 production 分享入口。

工作流蒐集與 AI 評估模板位於：

`shared-modules/workflow-intake-ai-evaluation-template.md`

公開審閱頁位於：

`/needs/workflow-intake/`

## 治理原則

- 第一階段只讀取、整理、產生草稿，不自動發送。
- 外部訊息、Calendar 寫入、Google Sheet 寫回、InfoCenter 寫入，都需要人工確認。
- 涉及個資、薪資、個案、發票、交通住宿、敏感狀態時，只保留必要摘要與來源指標。
- 每個自動化都要有 no-op 規則：資料不足、日期未確認、派課未完成時，只產生補問或待確認清單。

## 發布後驗證

每次 production 更新後至少確認：

- Stable URL 回 `200 OK`。
- Header 含 `X-Robots-Tag: noindex, nofollow, noarchive`。
- HTML 含 `<meta name="robots" content="noindex,nofollow,noarchive">`。
- `/robots.txt` 回 `User-agent: *` 與 `Disallow: /`。
- `/people/*`、`/shared-modules/*`、`/training/*`、`/outputs/*` 不應成為可直接閱讀的 production 路徑。

## 課後作業成績單

課後作業評分與排行榜已依 Kevin 確認公開到課程網站，並保留 `noindex/nofollow/noarchive` 設定。公開頁只放去識別化學員代碼、作品層級分數、診斷摘要與具體補強建議，不放原始作業檔、逐字稿、內部系統操作細節或未去識別資料。

- 公開頁：`/leaderboard/`
- 學員層級排行榜：`leaderboard/leaderboard/leaderboard-by-student.md`
- 作品層級排行榜：`leaderboard/leaderboard/leaderboard.md`
- 成績單式回饋：`leaderboard/leaderboard/report-cards.md`
- 評分標準：`leaderboard/rubric/rubric-v2.yaml`
