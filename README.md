# Codex 行政工作實驗課｜主管版課綱

這個 repo 目前的 production 首頁改為主管閱讀用的「Codex 行政工作實驗課」課綱頁。公開頁只呈現課程目的、學習成果、三小時安排、學員完成品、風險控管與主管決策點，不放同仁逐字稿、個別需求細節、內部系統操作細節或正式資料。

## Production URL

<https://course-ops-automation-requirements.vercel.app>

## 公開輸出邊界

- Vercel `outputDirectory` 設為 `public/`。
- Production 只部署主管版課程頁、`robots.txt` 與安全視覺資產。
- `people/`、`shared-modules/`、`training/`、`outputs/` 等內部材料不作為 production 靜態輸出目錄。
- `noindex/nofollow/noarchive` 保留於 meta、Vercel header 與 robots.txt。
- `noindex` 不是權限控管，因此 production 首頁仍避免放入敏感資訊。

## 主管版課綱

主管版文字稿位於：

`publication/supervisor-course-outline.md`

## 課程一句話定位

一堂 3 小時的入門實作課，讓同仁用安全範例與低風險素材練習資料整理、缺漏檢查與草稿產出，並建立明確的人審邊界。

## 內部資料

先前同仁需求與共用模組仍保留在 repo 內，作為內部整理與後續開發討論基礎。這些材料不應直接作為 production 分享入口。

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
