# Design Skills Matrix

以互動矩陣視覺化設計師的技能全貌——哪些是強項、哪些想繼續發展、哪些已不在優先清單。

**Live demo:** https://yode0419.github.io/design-matrix/

## 使用方式

1. 從左側清單點擊一項技能（84 項，9 個分類，支援新增自訂技能）
2. 在右側矩陣上點擊放置
3. 已放置的點可直接拖曳移動，或點擊後按 ✕ 刪除
4. 點擊 **查看結果** 進入結果模式，查看象限說明與 Sweet Spot 分析

所有放置結果自動儲存於瀏覽器 `localStorage`，重新整理不會遺失。

## 矩陣軸向

|  | Want to Do More | Want to Do Less |
|--|----------------|----------------|
| **Expert** | ⭐ Sweet Spot | 能做但沒熱情 |
| **Still Learning** | 優先學習目標 | 不感興趣 |

右上角「🍒 Cherry on Top」為最頂尖技能區。靠近中心軸的學習中技能標記為 ⚠️ Danger Zone（容易分心）。

## 功能

- **說明模式**：點擊說明按鈕，於矩陣旁顯示軸向說明卡片與四段專業程度區塊框線，側邊欄同步顯示使用步驟
- **結果模式**：六個區域 toggle（Q1–Q4 / 危險地帶 / 甜蜜點），點擊高亮對應區塊並顯示說明卡片
- **分享**：將所有放置位置、自訂技能、分類顏色編碼至 URL hash，可複製連結分享
- **匯出／匯入**：支援 JSON 格式匯出與匯入
- **自訂技能**：可新增自訂技能並選擇分類，持久化至 localStorage
- **分類顏色**：點擊分類色塊可自訂顏色，持久化至 localStorage
- **格線切換**：可開關背景格線輔助定位

## 本機執行

直接用瀏覽器開啟 `index.html`，無需安裝任何套件或執行 build。

## 技術

純靜態：HTML + CSS + Vanilla JavaScript，無任何外部依賴。  
圖示使用 [Google Material Symbols Rounded](https://fonts.google.com/icons)。

## Credit

原始框架由 [Maigen Thomas](https://www.figma.com/@maigen) 設計 · [Design Skills Matrix on Figma Community](https://www.figma.com/community/file/1142203484282738794/design-skills-matrix)
