# 安排影展觀賞時程

[Live Demo](https://film-scheduler.vercel.app/golden-horse-taipei)

## 特色

- 可切換明暗主題；
- 可依據名稱及日期篩選電影；
- 可操作**自訂區**以複製或刪除排程；
- 篩選後**生成區**提供可能的排程（排除完售的項目）；
- 勾選**日期區**任一項目後，其餘同名項目清空自身勾選、並降低對比；
- 勾選彼此時間衝突的項目後，項目以鮮明顏色標示自身；
- 可將勾選項目下載為 ics 檔用於匯入行事曆；
- 頁面重新整理後將載入前次編輯的結果。

## 主要技術

- Next v13
- React v18
- TypeScript v5
- Tailwind CSS v3
- Library
  - [localforage](https://localforage.github.io/localForage/)
  - [next-themes](https://github.com/pacocoursey/next-themes#readme)
