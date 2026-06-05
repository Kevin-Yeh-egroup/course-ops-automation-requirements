# 課務與個案行政自動化需求總覽

這個 repo 用來統整資料蒐集同仁的 Codex 自動化需求，保留個別工作流差異，同時抽出可以共用的提醒、缺漏檢查、狀態對帳與訊息草稿模組。

首頁採三層架構：

1. 總覽頁：說明這份統整頁要怎麼讀。
2. 同仁整理結果：分別放入已完成初版整理的同仁需求，待整理者先建立位置。
3. 統整問題摘要：把已整理需求合併後，整理共同問題、優先處理順序與治理邊界，後續隨名單補齊再更新。

## 一句話結論

目前已整理的材料不應該拆成完全獨立的小工具。更好的方向是建立一套「行政案件工作台」：每位夥伴保留自己的工作頁面，底層共用資料檢查、提醒規則、狀態對帳、月結對帳與人工核准機制。

## 資料蒐集名單

| 分類 | 同仁 | 本 repo 文件 | 原公開頁 |
| --- | --- | --- | --- |
| 已完成初版整理 | 佩欣 | `people/peixin/needs-analysis.md`、`people/peixin/workflow-map.md` | <https://peixin-needs-automation-report.vercel.app> |
| 已完成初版整理 | 思宜 | `people/siyi/needs-analysis.md` | <https://siyi-infocenter-codex-workflow-repo.vercel.app> |
| 已完成初版整理 | 瑜君 | `people/yujun/needs-analysis.md` | <https://course-admin-codex-automation.vercel.app> |
| 已有既有材料整理 | 素菁 | `people/sujing/README.md`、`people/sujing/needs-analysis.md` | 先前月結工作台雛形，未公開連結 |
| 已列入，待補整理 | 怡君 | `people/yijun/README.md` | - |
| 已列入，待補整理 | 阿丸 | `people/awan/README.md` | - |
| 後續預計加入 | 雨虹 | `people/yuhong/README.md` | - |
| 後續預計加入 | 奕吟 | `people/yiyin/README.md` | - |
| 後續預計加入 | 思璇 | `people/sixuan/README.md` | - |

## 目前統整後共同問題

| 問題 | 說明 |
| --- | --- |
| 資料分散 | Google Sheet、Excel、InfoCenter、Line、Calendar、Email 與文件資料夾分散。 |
| 欄位品質不穩 | 表單內容可能粗略、缺欄、格式不一致，後續都需要人工補判斷。 |
| 提醒節點過碎 | 課前、核銷、電訪、會議、補件與發票都有不同倒數時間。 |
| 狀態不同步 | 一邊完成不代表另一邊已更新，需要跨系統對帳。 |
| 重複文字整理 | 派課摘要、補問、提醒、核銷通知、課前確認都需要固定格式草稿。 |
| 月結規則複雜 | 課務、諮詢、企劃、交通、補扣款與人員歷史累積會進到月結試算與 Ivy 輸出。 |
| 外部動作風險 | 發送、寫回、勾完成、建立事件都可能影響個資、薪資、課務或對外承諾。 |

這一版共同問題先根據已完成初版整理的佩欣、思宜、瑜君，以及先前素菁帳務/月結工具材料形成。怡君、阿丸與後續三位資料補齊後，需重新檢查與更新本段。

## 共用模組

| 模組 | 用途 |
| --- | --- |
| `shared-modules/reminder-engine.md` | 整理課務與個案追蹤共用的提醒邏輯與倒數規則 |
| `shared-modules/sheet-field-dictionary.md` | 整理 Google Sheet 欄位字典與欄位治理原則 |
| `shared-modules/status-check-rules.md` | 整理跨系統狀態對帳與缺漏檢查 |
| `shared-modules/message-draft-templates.md` | 整理 Line、Email、Calendar、補問與派課草稿模板 |
| `shared-modules/settlement-workbench.md` | 整理月結試算、個人確認包、Ivy 輸出與匯款前檢查邊界 |

## 合併策略

這是輕量合併，不刪除原本已建立的 repo。原 repo 保留歷史與舊公開網址，這個 repo 作為新的總覽入口與後續產品化討論基礎。

建議順序：

1. 先在這裡維護已整理需求總覽與共用模組。
2. 等總覽穩定後，再回到原 repo README 補上新總覽連結。
3. 若未來要做成正式工具，再把這個 repo 升級成 monorepo，加入資料讀取、排程、前端工作台與測試。

## 發布狀態

本 repo 預設為 public-with-noindex review：

- public link-accessible：可以跨裝置開啟。
- noindex/nofollow/noarchive：保留搜尋索引限制。
- no privacy guarantee：noindex 不是權限控管，內容仍應避免放入個資或敏感原文。

目前 Vercel Production URL：

<https://course-ops-automation-requirements.vercel.app>

GitHub public repo 已建立並推送 `main`：

<https://github.com/Kevin-Yeh-egroup/course-ops-automation-requirements>

## 治理原則

- 第一階段只讀取、整理、產生草稿，不自動發送。
- 外部訊息、Calendar 寫入、Google Sheet 寫回、InfoCenter 寫入，都需要人工確認。
- 涉及個資、薪資、個案、發票、交通住宿、敏感身心議題時，只保留必要摘要與來源指標。
- 每個自動化都要有 no-op 規則：資料不足、日期未確認、派課未完成時，只產生補問或待確認清單。
