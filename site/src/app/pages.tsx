import { createContext, useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";

export const releaseUrl = "https://github.com/yakoye/Shazao-markdown/releases/latest";
export const repoUrl = "https://github.com/yakoye/Shazao-markdown";
const appinnUrl = "https://meta.appinn.net/t/topic/93080/";
export const storeUrl = "https://apps.microsoft.com/detail/9ntw7mf81l2x?hl=en-US&gl=AU";

type Locale = "zh" | "tw" | "en";

const translations: Record<string, { tw: string; en: string }> = {
  特性: { tw: "特性", en: "Features" },
  首页: { tw: "首頁", en: "Home" },
  性能: { tw: "效能", en: "Performance" },
  故事: { tw: "故事", en: "Story" },
  下载: { tw: "下載", en: "Download" },
  使用指南: { tw: "使用指南", en: "Guide" },
  博客: { tw: "部落格", en: "Blog" },
  更新日志: { tw: "更新日誌", en: "Changelog" },
  查看更新: { tw: "查看更新", en: "View updates" },
  更多: { tw: "更多", en: "More" },
  免费下载: { tw: "免費下載", en: "Free download" },
  "生于风沙，": { tw: "生於風沙，", en: "Born of the desert," },
  落笔成章: { tw: "落筆成章", en: "crafted into words" },
  "从一行文字，到一份作品。": {
    tw: "從一行文字，到一份作品。",
    en: "From one line of text to a finished work.",
  },
  "阅读极速秒开 · 所见即所得 · 丰富的图表编辑": {
    tw: "閱讀極速秒開 · 所見即所得 · 豐富的圖表編輯",
    en: "Instant reading · WYSIWYG editing · Rich diagrams",
  },
  查看功能: { tw: "查看功能", en: "Explore features" },
  "Windows 现已推出 · macOS 开发中 · 单文件 · 免安装 · 免账号 · 免费": {
    tw: "Windows 現已推出 · macOS 開發中 · 單檔案 · 免安裝 · 免帳號 · 免費",
    en: "Available for Windows · macOS in development · Single file · No install · No account · Free",
  },
  试一试: { tw: "試一試", en: "Try it" },
  "读与写，不必来回切换": {
    tw: "讀與寫，不必來回切換",
    en: "Read and write without switching contexts",
  },
  "在排版后的内容中直接编辑，需要精确控制时切到源码。": {
    tw: "在排版後的內容中直接編輯，需要精確控制時切到原始碼。",
    en: "Edit directly in the rendered document, then switch to source when precision matters.",
  },
  所见即所得: { tw: "所見即所得", en: "WYSIWYG" },
  源码: { tw: "原始碼", en: "Source" },
  锁定阅读: { tw: "鎖定閱讀", en: "Reading mode" },
  只读: { tw: "唯讀", en: "Read only" },
  "打开就读，落笔就写": { tw: "打開就讀，落筆就寫", en: "Open to read. Start typing to write." },
  "复杂的能力，": { tw: "複雜的能力，", en: "Powerful features," },
  简单地出现: { tw: "簡單地出現", en: "simply presented" },
  "从阅读、编辑到导出，每一步都留在同一份文档里。": {
    tw: "從閱讀、編輯到匯出，每一步都留在同一份文件裡。",
    en: "Read, edit, and export without leaving your document.",
  },
  "给想法一张图，": { tw: "給想法一張圖，", en: "Diagram the idea," },
  给实现一段代码: { tw: "給實作一段程式碼", en: "code the implementation" },
  "Mermaid、数学公式、语法高亮，无需离开文档。": {
    tw: "Mermaid、數學公式、語法高亮，無需離開文件。",
    en: "Mermaid, math, and syntax highlighting—inside the document.",
  },
  长文也有清楚的方向: { tw: "長文也有清楚的方向", en: "Stay oriented in long documents" },
  文档之间彼此相连: { tw: "文件之間彼此相連", en: "Connect every document" },
  粘贴进来结构还在: { tw: "貼上進來結構還在", en: "Paste without losing structure" },
  "为喜欢的文字，": { tw: "為喜歡的文字，", en: "Give your words" },
  选一种颜色: { tw: "選一種顏色", en: "a color of their own" },
  写完带去任何地方: { tw: "寫完帶去任何地方", en: "Take your work anywhere" },
  "打开即显示正文，编辑与保存只处理改动部分。": {
    tw: "開啟即顯示正文，編輯與儲存只處理改動部分。",
    en: "Content appears immediately. Editing and saving process only what changed.",
  },
  "不基于 Electron，": { tw: "不基於 Electron，", en: "No Electron," },
  不套网页壳: { tw: "不套網頁殼", en: "no web wrapper" },
  截图: { tw: "截圖", en: "Screenshots" },
  "还有更多配色，可以慢慢挑。": {
    tw: "還有更多配色，可以慢慢挑。",
    en: "More themes are ready when you want them.",
  },
  名称由来: { tw: "名稱由來", en: "The name" },
  "五月，沙枣花开，": { tw: "五月，沙棗花開，", en: "In May, shazao blossoms," },
  整个房间都是它的味道: { tw: "整個房間都是它的味道", en: "and their scent fills the room" },
  "—— 来自作者的故事": { tw: "—— 來自作者的故事", en: "— A note from the maker" },
  "一种植物，": { tw: "一種植物，", en: "One plant," },
  一个地方: { tw: "一個地方", en: "one place" },
  快速开始: { tw: "快速開始", en: "Quick start" },
  基础编辑: { tw: "基礎編輯", en: "Editing basics" },
  导出与发布: { tw: "匯出與發佈", en: "Export and publish" },
  内容整理中: { tw: "內容整理中", en: "Coming soon" },
  "先留好入口，完整使用指南将在这里持续补充。": {
    tw: "先留好入口，完整使用指南將在這裡持續補充。",
    en: "The structure is ready. The full guide will be expanded here over time.",
  },
  阅读文章: { tw: "閱讀文章", en: "Read article" },
  "我为什么做 Shazao": { tw: "我為什麼做 Shazao", en: "Why I built Shazao" },
  "在小众软件发布的自荐介绍，记录产品最初的样子和想法。": {
    tw: "在小眾軟體發佈的自薦介紹，記錄產品最初的樣子和想法。",
    en: "The original introduction on Appinn, sharing the first ideas behind Shazao.",
  },
  开发手记: { tw: "開發手記", en: "Development notes" },
  "关于性能、原生开发与设计取舍。": {
    tw: "關於效能、原生開發與設計取捨。",
    en: "Notes on performance, native development, and product decisions.",
  },
  随笔与故事: { tw: "隨筆與故事", en: "Essays and stories" },
  "关于西北、写作，以及一款小工具如何慢慢长大。": {
    tw: "關於西北、寫作，以及一款小工具如何慢慢長大。",
    en: "Writing, the northwest, and how a small tool gradually grew.",
  },
  现已推出: { tw: "現已推出", en: "Available now" },
  开发中: { tw: "開發中", en: "In development" },
  即将到来: { tw: "即將到來", en: "Coming soon" },
  下载Windows版: { tw: "下載 Windows 版", en: "Download for Windows" },
  微软应用商店: { tw: "Microsoft Store", en: "Microsoft Store" },
  关注进展: { tw: "關注進展", en: "Follow progress" },
  "单文件，免安装；支持便携模式。": {
    tw: "單檔案，免安裝；支援便攜模式。",
    en: "Single file, no installation, with portable mode support.",
  },
  反馈问题: { tw: "回報問題", en: "Report an issue" },
  把想法画出来: { tw: "把想法畫出來", en: "Turn ideas into diagrams" },
  "给想法一张表，给实现一段代码": {
    tw: "給想法一張表，給實作一段程式碼",
    en: "A table for the idea, code for the implementation",
  },
  "为喜欢的文字，选一种颜色": {
    tw: "為喜歡的文字，選一種顏色",
    en: "Give your favorite words a color",
  },
  "我来自西北的一座小城。": {
    tw: "我來自西北的一座小城。",
    en: "I come from a small city in northwest China.",
  },
  "想用一种植物代表那个地方，也代表一种我熟悉的精神，于是选择了沙枣。": {
    tw: "想用一種植物代表那個地方，也代表一種我熟悉的精神，於是選擇了沙棗。",
    en: "I wanted a plant to represent that place and a spirit I knew well, so I chose shazao.",
  },
  "沙枣是西北很常见的植物。耐旱、耐风沙、耐盐碱，在贫瘠的土地上也能生长。": {
    tw: "沙棗是西北很常見的植物。耐旱、耐風沙、耐鹽鹼，在貧瘠的土地上也能生長。",
    en: "Shazao is common in the northwest. It withstands drought, wind, sand, and saline soil, and grows where the land is poor.",
  },
  "每年五月前后，沙枣花开，香气飘得很远。小时候，大人会折几枝带回家插在屋里，整个房间都是沙枣花的味道。":
    {
      tw: "每年五月前後，沙棗花開，香氣飄得很遠。小時候，大人會折幾枝帶回家插在屋裡，整個房間都是沙棗花的味道。",
      en: "Around May, shazao blossoms carry their scent far away. When I was young, adults brought branches home, filling the whole room with their fragrance.",
    },
  "所以这个软件叫 Shazao。": {
    tw: "所以這個軟體叫 Shazao。",
    en: "That is why this software is called Shazao.",
  },
  "对我来说，它不只是一个名字，也是对西北、故乡和生活记忆的一点纪念。": {
    tw: "對我來說，它不只是一個名字，也是對西北、故鄉和生活記憶的一點紀念。",
    en: "To me, it is more than a name. It is a small remembrance of the northwest, home, and everyday life.",
  },
  "后记：最开始，只是想做一个打开 Markdown 比较舒服的小工具。后来慢慢加入了编辑、表格、图片、导出、Mermaid、大纲和搜索，现在它已经能陪你日常阅读和写作。":
    {
      tw: "後記：最開始，只是想做一個打開 Markdown 比較舒服的小工具。後來慢慢加入了編輯、表格、圖片、匯出、Mermaid、大綱和搜尋，現在它已經能陪你日常閱讀和寫作。",
      en: "Afterword: It began as a small, comfortable way to open Markdown. Editing, tables, images, export, Mermaid, outlines, and search followed. Now it can stay with you for everyday reading and writing.",
    },
  "关于产品、开发和故乡的文章，会慢慢写在这里。": {
    tw: "關於產品、開發和故鄉的文章，會慢慢寫在這裡。",
    en: "Articles about the product, development, and home will collect here over time.",
  },
  "从一行文字，": { tw: "從一行文字，", en: "From one line of text" },
  到一份作品: { tw: "到一份作品", en: "to a finished work" },
  单文件: { tw: "單檔案", en: "Single file" },
  免安装: { tw: "免安裝", en: "No install" },
  免账号: { tw: "免帳號", en: "No account" },
  默认不联网: { tw: "預設不連網", en: "Offline by default" },
  原生渲染: { tw: "原生渲染", en: "Native rendering" },
  "文件树、大纲、标题折叠、多标签，并记住每份文档的阅读位置。": {
    tw: "檔案樹、大綱、標題摺疊、多標籤，並記住每份文件的閱讀位置。",
    en: "File tree, outline, collapsible headings, tabs, and remembered reading positions.",
  },
  "链接悬停预览、front matter 标签与 Wiki 链接。": {
    tw: "連結懸停預覽、front matter 標籤與 Wiki 連結。",
    en: "Link previews, front matter tags, and Wiki links.",
  },
  "表格、任务清单、脚注、提示块；从 Word、网页和 Excel 粘贴也能保留结构。": {
    tw: "表格、工作清單、註腳、提示區塊；從 Word、網頁和 Excel 貼上也能保留結構。",
    en: "Tables, tasks, footnotes, callouts, and structure-preserving paste from Word, web, and Excel.",
  },
  "字体、行距、阅读宽度、专注模式与打字机模式。": {
    tw: "字型、行距、閱讀寬度、專注模式與打字機模式。",
    en: "Fonts, line height, reading width, focus mode, and typewriter mode.",
  },
  "HTML、PDF、Word、EPUB 批量导出；本地历史随时比较与恢复。": {
    tw: "HTML、PDF、Word、EPUB 批次匯出；本機歷史隨時比較與還原。",
    en: "Export HTML, PDF, Word, and EPUB in batches; compare and restore local history.",
  },
  "纸与 S": { tw: "紙與 S", en: "Paper and S" },
  从一行文字开始: { tw: "從一行文字開始", en: "It starts with one line" },
  枝头的沙枣: { tw: "枝頭的沙棗", en: "The shazao fruit" },
  写到这里落下一颗沙枣: { tw: "寫到這裡落下一顆沙棗", en: "A shazao lands at the end" },
  沙丘: { tw: "沙丘", en: "Dunes" },
  生于风沙: { tw: "生於風沙", en: "Born of the desert" },
  "来自西北的颜色，但不止于“乡土”": {
    tw: "來自西北的顏色，但不止於「鄉土」",
    en: "Colors from the northwest, without being confined to nostalgia",
  },
  "约 2 秒": { tw: "約 2 秒", en: "about 2 sec" },
  "Windows 10 / 11 · 64 位": { tw: "Windows 10 / 11 · 64 位元", en: "Windows 10 / 11 · 64-bit" },
  更多细节: { tw: "更多細節", en: "A closer look" },
  查看使用指南: { tw: "查看使用指南", en: "Read the guide" },
  "用不同的图，讲不同的事": { tw: "用不同的圖，講不同的事", en: "A different diagram for each story" },
  段落抓手与表格工具条: { tw: "段落抓手與表格工具列", en: "Block handles and the table toolbar" },
  "Chrome 式标签，一起变窄": { tw: "Chrome 式標籤，一起變窄", en: "Chrome-style tabs that shrink together" },
  "源码视图，随时切换": { tw: "原始碼檢視，隨時切換", en: "Source view, one keystroke away" },
  "插入 ▸ 图表：8 个 Mermaid 模板": { tw: "插入 ▸ 圖表：8 個 Mermaid 範本", en: "Insert › Diagram: eight Mermaid templates" },
  "设置：配色方案即点即预览": { tw: "設定：配色方案即點即預覽", en: "Settings: preview a theme in one click" },
  "切换视图，光标闪一下": { tw: "切換檢視，游標閃一下", en: "The caret flashes on switch" },
  "在编辑与源码之间切换时，光标处短暂高亮，马上找到刚才写到哪里。": { tw: "在編輯與原始碼之間切換時，游標處短暫高亮，馬上找到剛才寫到哪裡。", en: "Switching between edit and source briefly highlights the caret, so you instantly see where you were." },
  "按住图标拖动窗口": { tw: "按住圖示拖動視窗", en: "Drag the window by its icon" },
  "标签开满、标题栏没有空白时，按住左上角的程序图标也能移动窗口。": { tw: "標籤開滿、標題列沒有空白時，按住左上角的程式圖示也能移動視窗。", en: "When tabs fill the title bar, hold the app icon at the top-left to move the window." },
  "块的上下，都能插入空行": { tw: "區塊的上下，都能插入空行", en: "Room above and below every block" },
  "代码块、表格、引用的上方和下方点一下“+”，就能插入空行继续写。": { tw: "程式碼區塊、表格、引用的上方和下方點一下「+」，就能插入空行繼續寫。", en: "Click + above or below a code block, table or quote to add an empty line and keep writing." },
  "表格列宽，拖一下就好": { tw: "表格欄寬，拖一下就好", en: "Resize columns by dragging" },
  "按住列之间的边线左右拖动，直接调整列宽。": { tw: "按住欄之間的邊線左右拖動，直接調整欄寬。", en: "Drag the border between table columns to set their width." },
  "大纲自动跟随展开": { tw: "大綱自動跟隨展開", en: "The outline follows along" },
  "滚动或移动光标时，大纲自动展开到当前标题并高亮。": { tw: "捲動或移動游標時，大綱自動展開到目前標題並高亮。", en: "As you scroll or move the caret, the outline expands to the current heading and highlights it." },
  贴心细节: { tw: "貼心細節", en: "Thoughtful touches" },
  "那些用久了才会发现的小事。": { tw: "那些用久了才會發現的小事。", en: "Small things you notice the longer you use it." },
  "约 9 MB": { tw: "約 9 MB", en: "≈ 9 MB" },
  "单个 EXE，UPX 版约 3.7 MB": { tw: "單個 EXE，UPX 版約 3.7 MB", en: "single EXE; UPX build ≈ 3.7 MB" },
  "0.46 秒": { tw: "0.46 秒", en: "0.46 s" },
  "启动到可以操作（中位数）": { tw: "啟動到可以操作（中位數）", en: "launch to responsive (median)" },
  "1 GB → 1.8 秒": { tw: "1 GB → 1.8 秒", en: "1 GB → 1.8 s" },
  "显示正文；4 GB 约 8.8 秒": { tw: "顯示正文；4 GB 約 8.8 秒", en: "to first text; 4 GB ≈ 8.8 s" },
  "12 万个标题": { tw: "12 萬個標題", en: "120,000 headings" },
  "大纲 0.6 秒可用，F8 开合 0.1 秒": { tw: "大綱 0.6 秒可用，F8 開合 0.1 秒", en: "outline ready in 0.6 s, F8 in 0.1 s" },
  "100 万个公式": { tw: "100 萬個公式", en: "1,000,000 formulas" },
  "45 MB 文档 0.67 秒打开，滚动每帧 3 毫秒": { tw: "45 MB 文件 0.67 秒開啟，滾動每幀 3 毫秒", en: "45 MB file opens in 0.67 s, 3 ms per frame" },
  "50 个文件": { tw: "50 個檔案", en: "50 files" },
  "一次拖入 0.4～0.9 秒全部打开": { tw: "一次拖入 0.4～0.9 秒全部開啟", en: "dropped at once, open in 0.4–0.9 s" },
  "只处理改动的部分": { tw: "只處理改動的部分", en: "Only touch what changed" },
  "改一个字只重新解析附近的块；64 MB 以上的文档分段多线程解析；超过 8 MB 的文件保存时只写改动的那一段；64 MB 以上在后台保存，失败可重试。": { tw: "改一個字只重新解析附近的塊；64 MB 以上的文件分段多執行緒解析；超過 8 MB 的檔案儲存時只寫改動的那一段；64 MB 以上在後臺儲存，失敗可重試。", en: "Typing re-parses only the nearby blocks; documents over 64 MB parse in parallel segments; files over 8 MB save only the changed range, and files over 64 MB save in the background with retry on failure." },
  "文字不会丢": { tw: "文字不會丟", en: "Your text stays safe" },
  "自动历史快照（默认每 10 分钟、每文档 50 份），可比较、恢复；停顿时写恢复副本；持久撤销在关闭后仍可用；删除图片按引用计数，最后一处引用删掉才进回收站。": { tw: "自動歷史快照（預設每 10 分鐘、每文件 50 份），可比較、恢復；停頓時寫恢復副本；持久撤銷在關閉後仍可用；刪除圖片按引用計數，最後一處引用刪掉才進回收站。", en: "Automatic history snapshots (every 10 minutes, 50 per document) you can compare and restore; recovery copies while you pause; undo that survives closing; deleted images go to the Recycle Bin only when the last reference is gone." },
  "只在加载网络图片和检查更新时联网，检查更新默认关闭；下载的新版本按 SHA256SUMS 校验。没有账号，没有统计。": { tw: "只在載入網路圖片和檢查更新時聯網，檢查更新預設關閉；下載的新版本按 SHA256SUMS 校驗。沒有賬號，沒有統計。", en: "Shazao goes online only to load web images and to check for updates (off by default); downloads are verified against SHA256SUMS. No account, no analytics." },
  "界面自己画": { tw: "介面自己畫", en: "A UI drawn by hand" },
  "C++20、Win32、DirectWrite、Direct2D、WIC，不用 Electron，也不需要 WebView2。标题栏、标签、细滚动条、图标都自己绘制，直线落在整像素上，高缩放下不发虚。": { tw: "C++20、Win32、DirectWrite、Direct2D、WIC，不用 Electron，也不需要 WebView2。標題欄、標籤、細捲軸、圖示都自己繪製，直線落在整畫素上，高縮放下不發虛。", en: "C++20, Win32, DirectWrite, Direct2D and WIC — no Electron, no WebView2. Title bar, tabs, thin scrollbars and icons are drawn directly, snapped to whole pixels so they stay crisp at high DPI." },
  "每版都整版回归": { tw: "每版都整版迴歸", en: "Full regression every release" },
  "62 项核心测试，近 400 步界面自动化回归，三种语言的界面文字逐条校验；公式按 KaTeX 支持表 997 例与 MathJax 2635 个官方测例对照。发布说明如实写出没通过的项和已知问题。": { tw: "62 項核心測試，近 400 步介面自動化迴歸，三種語言的介面文字逐條校驗；公式按 KaTeX 支援表 997 例與 MathJax 2635 個官方測例對照。釋出說明如實寫出沒透過的項和已知問題。", en: "62 core tests, a UI regression of nearly 400 steps, and every interface string checked in three languages; math is checked against KaTeX’s 997 examples and MathJax’s 2,635 official tests. Release notes list what failed and what is still known to be broken." },
  "跟着反馈改": { tw: "跟著反饋改", en: "Built from feedback" },
  "v0.6.20 一版处理了小众软件论坛 154～176 楼和 GitHub #22～#32；v0.6.21 起因是论坛 180、184、185 楼的公式问题。提问题，下一版就能看到结果。": { tw: "v0.6.20 一版處理了小眾軟體論壇 154～176 樓和 GitHub #22～#32；v0.6.21 起因是論壇 180、184、185 樓的公式問題。提問題，下一版就能看到結果。", en: "v0.6.20 answered Appinn forum posts 154–176 and GitHub issues #22–#32; v0.6.21 started from formula reports in posts 180, 184 and 185. Report a problem and you’ll usually see it in the next release." },
  "图表和公式，直接显示": { tw: "圖表和公式，直接顯示", en: "Diagrams and math, rendered inline" },
  "流程图、时序图、甘特图、思维导图、ER 图等 Mermaid 图表；KaTeX 支持表 997 个示例全部能读，physics、mhchem 化学式也行；图里的文字能选中复制。": { tw: "流程圖、時序圖、甘特圖、思維導圖、ER 圖等 Mermaid 圖表；KaTeX 支援表 997 個示例全部能讀，physics、mhchem 化學式也行；圖裡的文字能選中複製。", en: "Mermaid flowcharts, sequence, Gantt, mindmap, ER and more; all 997 KaTeX examples render, plus physics and mhchem chemistry; text inside diagrams can be selected and copied." },
  "几百页也不迷路": { tw: "幾百頁也不迷路", en: "Hundreds of pages, still oriented" },
  "文件树、大纲（左侧 / 右侧 / 切换）、标题折叠，大纲随位置自动展开；每份文件记住读到哪里。": { tw: "檔案樹、大綱（左側 / 右側 / 切換）、標題摺疊，大綱隨位置自動展開；每份檔案記住讀到哪裡。", en: "File tree, outline (left, right or toggled) and folding headings; the outline follows your position, and each file remembers where you stopped." },
  "链接悬停就能看": { tw: "連結懸停就能看", en: "Hover a link to look inside" },
  "网页、图片、文件夹、标题，以及文本和 Markdown 文件开头 14 行；front matter 标签和 Wiki 链接把文档连起来。": { tw: "網頁、圖片、資料夾、標題，以及文字和 Markdown 檔案開頭 14 行；front matter 標籤和 Wiki 連結把文件連起來。", en: "Web pages, images, folders, headings, and the first 14 lines of text or Markdown files; front matter tags and Wiki links tie documents together." },
  "从 Word、Excel、网页粘贴": { tw: "從 Word、Excel、網頁貼上", en: "Paste from Word, Excel and the web" },
  "标题、列表、链接、表格和图片尽量转成 Markdown；Excel 单元格超出表格时自动补行补列。": { tw: "標題、列表、連結、表格和圖片儘量轉成 Markdown；Excel 單元格超出表格時自動補行補列。", en: "Headings, lists, links, tables and images become Markdown; pasting more Excel cells than fit extends the table." },
  "17 套配色，浅深各选": { tw: "17 套配色，淺深各選", en: "17 schemes, light and dark" },
  "Shazao、Dracula、One Dark、Tokyo Night、Nord、Solarized、GitHub、Catppuccin 等；字体、行距、正文宽度、专注与打字机模式；界面有简体、繁體和 English。": { tw: "Shazao、Dracula、One Dark、Tokyo Night、Nord、Solarized、GitHub、Catppuccin 等；字型、行距、正文寬度、專注與打字機模式；介面有簡體、繁體和 English。", en: "Shazao, Dracula, One Dark, Tokyo Night, Nord, Solarized, GitHub, Catppuccin and more; fonts, spacing, text width, focus and typewriter modes; UI in Simplified, Traditional Chinese and English." },
  "写完带走": { tw: "寫完帶走", en: "Take it anywhere" },
  "HTML、单文件 HTML、PDF（带书签，长表格跨页接排）、Word、EPUB，图片内嵌的单个 .md；CSS 模板批量导出。": { tw: "HTML、單檔案 HTML、PDF（帶書籤，長表格跨頁接排）、Word、EPUB，圖片內嵌的單個 .md；CSS 模板批次匯出。", en: "HTML, single-file HTML, PDF (with bookmarks; long tables flow across pages), Word, EPUB, and a single .md with images embedded; batch export with a CSS template." },
  "这么小的体积真的无敌了": { tw: "這麼小的體積真的無敵了", en: "Tiny and unbeatable." },
  "卧槽，好久没见到过这么精品的了。打开速度极快，而且非常轻量": { tw: "臥槽，好久沒見到過這麼精品的了。開啟速度極快，而且非常輕量", en: "Haven’t seen something this polished in ages. Opens incredibly fast and is very light." },
  "很快，更新快、启动快，替换掉tinta、typora及其它md阅读、编辑器了": { tw: "很快，更新快、啟動快，替換掉tinta、typora及其它md閱讀、編輯器了", en: "Fast updates, fast start — it replaced Tinta, Typora and my other Markdown tools." },
  "真的很棒，在此之前我一直用 sublime text 编辑 md 文档……我看中的是资源消耗和响应速度": { tw: "真的很棒，在此之前我一直用 sublime text 編輯 md 文件……我看中的是資源消耗和響應速度", en: "Really great. I used Sublime Text for Markdown before… what I care about is resource use and responsiveness." },
  "好用！！使用轻快，功能全面，目前在我的使用场景已经替代Typora了": { tw: "好用！！使用輕快，功能全面，目前在我的使用場景已經替代Typora了", en: "Light, complete, and it has replaced Typora for what I do." },
  "沙枣真是越用越顺手": { tw: "沙棗真是越用越順手", en: "The more I use Shazao, the better it feels." },
  "打开就读，": { tw: "開啟就讀，", en: "Open to read," },
  "落笔就写": { tw: "落筆就寫", en: "type to write" },
  "Windows 原生 Markdown 阅读与编辑器。": { tw: "Windows 原生 Markdown 閱讀與編輯器。", en: "A native Markdown reader and editor for Windows." },
  "一个约 9 MB 的 EXE，0.46 秒启动；直接在排版好的页面里编辑，1 GB 的文件约 2 秒显示正文。": { tw: "一個約 9 MB 的 EXE，0.46 秒啟動；直接在排版好的頁面裡編輯，1 GB 的檔案約 2 秒顯示正文。", en: "One ≈ 9 MB EXE that starts in 0.46 s. Edit right in the rendered page; a 1 GB file shows its text in about 2 seconds." },
  "v0.6.21 · Windows 10 / 11 64 位 · 免安装 · 免账号 · 默认不联网 · 免费": { tw: "v0.6.21 · Windows 10 / 11 64 位 · 免安裝 · 免賬號 · 預設不聯網 · 免費", en: "v0.6.21 · Windows 10 / 11 64-bit · No install · No account · Offline by default · Free" },
  "本机实测数据，来自各版本发布说明。": { tw: "本機實測資料，來自各版本釋出說明。", en: "Measured on the developer’s machine; figures come from each release’s notes." },
  "实测": { tw: "實測", en: "Measured" },
  "同一份文档，三种视图": { tw: "同一份文件，三種檢視", en: "One document, three views" },
  "编辑视图里直接改排版后的内容；Ctrl+/ 切到源码，光标处会闪一下；Esc 锁定只读。三种视图共用一套撤销。": { tw: "編輯檢視裡直接改排版後的內容；Ctrl+/ 切到原始碼，游標處會閃一下；Esc 鎖定只讀。三種檢視共用一套撤銷。", en: "Edit the rendered page directly; Ctrl+/ switches to source and flashes the caret; Esc locks it read-only. All three views share one undo history." },
  "功能": { tw: "功能", en: "Features" },
  "日常要用的，都在一个窗口里": { tw: "日常要用的，都在一個視窗裡", en: "What you use every day, in one window" },
  "阅读、编辑、图表、导出，不用装插件。": { tw: "閱讀、編輯、圖表、匯出，不用裝外掛。", en: "Reading, editing, diagrams and export — no plugins to install." },
  "怎么做的": { tw: "怎麼做的", en: "How it’s built" },
  "专门为快和稳做的设计": { tw: "專門為快和穩做的設計", en: "Designed to be fast and dependable" },
  "不基于 Electron，不需要 WebView2，不套网页壳。": { tw: "不基於 Electron，不需要 WebView2，不套網頁殼。", en: "No Electron, no WebView2, no web wrapper." },
  "用户怎么说": { tw: "使用者怎麼說", en: "What users say" },
  "来自小众软件论坛的真实反馈": { tw: "來自小眾軟體論壇的真實反饋", en: "Real feedback from the Appinn forum" },
  "查看全部讨论": { tw: "檢視全部討論", en: "Read the whole thread" },
  "免费下载 v0.6.21": { tw: "免費下載 v0.6.21", en: "Free download v0.6.21" },
  "v0.6.21 · Windows 10 / 11 · 64 位": { tw: "v0.6.21 · Windows 10 / 11 · 64 位", en: "v0.6.21 · Windows 10 / 11 · 64-bit" },
  "还在开发，暂无预计时间": { tw: "還在開發，暫無預計時間", en: "In development, no date yet" },
  "Shazao-markdown.exe 约 9.5 MB，下载后双击运行，不需要安装向导。": { tw: "Shazao-markdown.exe 約 9.5 MB，下載後雙擊執行，不需要安裝嚮導。", en: "Shazao-markdown.exe is about 9.5 MB: download, double-click, done — no installer." },
  "商店版自动更新；新版本在商店审核通过后上架。": { tw: "商店版自動更新；新版本在商店稽核透過後上架。", en: "The Store version updates itself; new releases appear after Store review." },
  "在 EXE 旁边新建 Shazao-data 文件夹，设置、历史版本和缓存都存在里面，整个文件夹放进 U 盘就能带走。": { tw: "在 EXE 旁邊新建 Shazao-data 資料夾，設定、歷史版本和快取都存在裡面，整個資料夾放進 U 盤就能帶走。", en: "Create a Shazao-data folder next to the EXE and settings, history and caches live there — copy the folder to a USB stick and go." },
  "每个版本附 SHA256SUMS；ZIP 约 8 MB，含版本说明、第三方声明和约 3.7 MB 的 UPX 压缩版。": { tw: "每個版本附 SHA256SUMS；ZIP 約 8 MB，含版本說明、第三方宣告和約 3.7 MB 的 UPX 壓縮版。", en: "Every release ships SHA256SUMS. The ≈ 8 MB ZIP adds release notes, third-party notices and a ≈ 3.7 MB UPX build." },
  "只在加载网络图片和检查更新时联网；检查更新默认关闭。": { tw: "只在載入網路圖片和檢查更新時聯網；檢查更新預設關閉。", en: "Online only for web images and update checks; update checks are off by default." },
  "最新版 v0.6.21 · Windows 10 / 11 64 位 · 免安装 · 免账号 · 免费": { tw: "最新版 v0.6.21 · Windows 10 / 11 64 位 · 免安裝 · 免賬號 · 免費", en: "Latest v0.6.21 · Windows 10 / 11 64-bit · No install · No account · Free" },
  "便携模式": { tw: "便攜模式", en: "Portable mode" },
  沙米: { tw: "沙米", en: "Sand" },
  枝绿: { tw: "枝綠", en: "Branch green" },
  枣红: { tw: "棗紅", en: "Shazao red" },
  沙黄: { tw: "沙黃", en: "Dune gold" },
  夜墨: { tw: "夜墨", en: "Night ink" },
};

const LocaleContext = createContext<{ locale: Locale; t: (text: string) => string }>({
  locale: "zh",
  t: (text) => text,
});

export function useLocale() {
  return useContext(LocaleContext);
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`} role="img" aria-label="Shazao 沙枣">
      <img
        className="logo-light"
        src={`${import.meta.env.BASE_URL}brand/shazao-icon-light.svg`}
        alt=""
      />
      <img
        className="logo-dark"
        src={`${import.meta.env.BASE_URL}brand/shazao-icon-dark.svg`}
        alt=""
      />
    </span>
  );
}

function Berry() {
  return <i className="berry" aria-hidden="true" />;
}

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span>{index}</span>
      <span>/</span>
      <b>{children}</b>
      <i />
    </div>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 6l6 6-6 6" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

const themes = [
  { id: "sand", label: "沙米" },
  { id: "light", label: "浅色" },
  { id: "green", label: "枝绿" },
  { id: "night", label: "夜墨" },
  { id: "dark", label: "深色" },
];

function Header({
  theme,
  setTheme,
  locale,
  setLocale,
}: {
  theme: string;
  setTheme: (value: string) => void;
  locale: Locale;
  setLocale: (value: Locale) => void;
}) {
  const { t } = useLocale();
  const closeMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.closest("details")?.removeAttribute("open");
  };
  return (
    <header>
      <Link className="nav-brand" to="/">
        <Logo />
        <span>
          Shazao <b>沙枣</b>
        </span>
        <small>v0.6.21</small>
      </Link>
      <nav className="nav-primary">
        <NavLink to="/" end>
          {t("首页")}
        </NavLink>
        <NavLink to="/download">{t("下载")}</NavLink>
        <NavLink to="/guide">{t("使用指南")}</NavLink>
        <NavLink to="/blog">{t("博客")}</NavLink>
      </nav>
      <div className="nav-actions">
        <details className="nav-menu mobile-menu" name="header-menu">
          <summary aria-label="Navigation">•••</summary>
          <div className="nav-dropdown">
            <Link to="/" onClick={closeMenu}>
              {t("首页")}
            </Link>
            <Link to="/download" onClick={closeMenu}>
              {t("下载")}
            </Link>
            <Link to="/guide" onClick={closeMenu}>
              {t("使用指南")}
            </Link>
            <Link to="/blog" onClick={closeMenu}>
              {t("博客")}
            </Link>
          </div>
        </details>
        <details className="nav-menu language-menu" name="header-menu">
          <summary aria-label="切换语言">
            <span>文</span>
            <b>A</b>
          </summary>
          <div className="nav-dropdown language-dropdown">
            {(["zh", "en", "tw"] as Locale[]).map((item) => (
              <button
                key={item}
                className={locale === item ? "active" : ""}
                onClick={(event) => {
                  setLocale(item);
                  closeMenu(event);
                }}
              >
                <span className="language-flag" aria-hidden="true">
                  {item === "zh" ? "🇨🇳" : item === "tw" ? "🇹🇼" : "🇺🇸"}
                </span>
                <span>{item === "zh" ? "简体中文" : item === "tw" ? "繁體中文" : "English"}</span>
              </button>
            ))}
          </div>
        </details>
        <div className="theme-picker" aria-label="主题颜色">
          {themes.map((item) => (
            <button
              key={item.id}
              className={theme === item.id ? "active" : ""}
              data-color={item.id}
              onClick={() => setTheme(item.id)}
              aria-label={`切换到${item.label}主题`}
              title={item.label}
            />
          ))}
        </div>
        <a className="github-link" href={repoUrl} aria-label="GitHub">
          <GithubIcon />
        </a>
      </div>
    </header>
  );
}

const markdownSource = `# 你好，沙枣

从一行文字，到一份作品。

> 打开就能读，落笔就能写。

- [x] 整理今天的想法
- [ ] 把它写成自己的故事

\`\`\`mermaid
想法 --> 文字 --> 作品
\`\`\``;

function EditorDemo() {
  const { t } = useLocale();
  const [mode, setMode] = useState<"visual" | "source" | "locked">("visual");
  const [source, setSource] = useState(markdownSource);
  return (
    <section className="try-section section-wrap">
      <SectionLabel index="01">{t("试一试")}</SectionLabel>
      <div className="try-heading">
        <h2>
          {t("同一份文档，三种视图")}
          <Berry />
        </h2>
        <p>{t("编辑视图里直接改排版后的内容；Ctrl+/ 切到源码，光标处会闪一下；Esc 锁定只读。三种视图共用一套撤销。")}</p>
      </div>
      <div className="demo-window">
        <div className="demo-toolbar">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <div className="mode-tabs">
            {[
              ["visual", t("所见即所得")],
              ["source", t("源码")],
              ["locked", t("锁定阅读")],
            ].map(([id, label]) => (
              <button
                key={id}
                className={mode === id ? "active" : ""}
                onClick={() => setMode(id as typeof mode)}
              >
                {label}
              </button>
            ))}
          </div>
          <span>你好，沙枣.md</span>
        </div>
        <div className="demo-body">
          <aside>
            <small>OUTLINE</small>
            <b>你好，沙枣</b>
            <span>打开就能读</span>
            <span>从想法到作品</span>
          </aside>
          <div className={`editor-stage ${mode}`}>
            {mode === "source" ? (
              <textarea
                value={source}
                onChange={(event) => setSource(event.target.value)}
                aria-label="Markdown 源码编辑器"
              />
            ) : (
              <article contentEditable={mode === "visual"} suppressContentEditableWarning>
                <h3>你好，沙枣</h3>
                <p className="lead">从一行文字，到一份作品。</p>
                <blockquote>打开就能读，落笔就能写。</blockquote>
                <label>
                  <input type="checkbox" defaultChecked disabled={mode === "locked"} />{" "}
                  整理今天的想法
                </label>
                <label>
                  <input type="checkbox" disabled={mode === "locked"} /> 把它写成自己的故事
                </label>
                <div className="mini-flow">
                  <span>想法</span>
                  <i>→</i>
                  <span>文字</span>
                  <i>→</i>
                  <span>作品</span>
                </div>
              </article>
            )}
            {mode === "locked" && <span className="locked-badge">{t("只读")}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

const facts = [
  ["约 9 MB", "单个 EXE，UPX 版约 3.7 MB"],
  ["0.46 秒", "启动到可以操作（中位数）"],
  ["1 GB → 1.8 秒", "显示正文；4 GB 约 8.8 秒"],
  ["12 万个标题", "大纲 0.6 秒可用，F8 开合 0.1 秒"],
  ["100 万个公式", "45 MB 文档 0.67 秒打开，滚动每帧 3 毫秒"],
  ["50 个文件", "一次拖入 0.4～0.9 秒全部打开"],
];

const designPoints = [
  ["只处理改动的部分", "改一个字只重新解析附近的块；64 MB 以上的文档分段多线程解析；超过 8 MB 的文件保存时只写改动的那一段；64 MB 以上在后台保存，失败可重试。"],
  ["文字不会丢", "自动历史快照（默认每 10 分钟、每文档 50 份），可比较、恢复；停顿时写恢复副本；持久撤销在关闭后仍可用；删除图片按引用计数，最后一处引用删掉才进回收站。"],
  ["默认不联网", "只在加载网络图片和检查更新时联网，检查更新默认关闭；下载的新版本按 SHA256SUMS 校验。没有账号，没有统计。"],
  ["界面自己画", "C++20、Win32、DirectWrite、Direct2D、WIC，不用 Electron，也不需要 WebView2。标题栏、标签、细滚动条、图标都自己绘制，直线落在整像素上，高缩放下不发虚。"],
  ["每版都整版回归", "62 项核心测试，近 400 步界面自动化回归，三种语言的界面文字逐条校验；公式按 KaTeX 支持表 997 例与 MathJax 2635 个官方测例对照。发布说明如实写出没通过的项和已知问题。"],
  ["跟着反馈改", "v0.6.20 一版处理了小众软件论坛 154～176 楼和 GitHub #22～#32；v0.6.21 起因是论坛 180、184、185 楼的公式问题。提问题，下一版就能看到结果。"],
];

const voices = [
  ["这么小的体积真的无敌了", "flintt", "92"],
  ["卧槽，好久没见到过这么精品的了。打开速度极快，而且非常轻量", "xmmdg", "31"],
  ["很快，更新快、启动快，替换掉tinta、typora及其它md阅读、编辑器了", "foolsic", "32"],
  ["真的很棒，在此之前我一直用 sublime text 编辑 md 文档……我看中的是资源消耗和响应速度", "jxcangel", "53"],
  ["好用！！使用轻快，功能全面，目前在我的使用场景已经替代Typora了", "YUIoTer", "37"],
  ["沙枣真是越用越顺手", "kat", "64"],
];

function FeatureGrid() {
  const { t } = useLocale();
  return (
    <section id="features" className="features section-wrap">
      <SectionLabel index="02">{t("功能")}</SectionLabel>
      <div className="section-heading">
        <h2>
          {t("日常要用的，都在一个窗口里")}
          <Berry />
        </h2>
        <p>{t("阅读、编辑、图表、导出，不用装插件。")}</p>
      </div>
      <div className="bento">
        <article className="feature-card feature-wide">
          <div>
            <small>DIAGRAMS & MATH</small>
            <h3>{t("图表和公式，直接显示")}</h3>
            <p>{t("流程图、时序图、甘特图、思维导图、ER 图等 Mermaid 图表；KaTeX 支持表 997 个示例全部能读，physics、mhchem 化学式也行；图里的文字能选中复制。")}</p>
          </div>
          <div className="diagram-visual">
            <pre>{`flowchart LR\n  想法 --> 结构\n  结构 --> 作品\n\n$$\\ce{2H2 + O2 -> 2H2O}$$`}</pre>
            <div className="flowchart">
              <span>想法</span>
              <i>→</i>
              <span>结构</span>
              <i>→</i>
              <span>作品</span>
            </div>
          </div>
        </article>
        <article className="feature-card">
          <div>
            <small>NAVIGATION</small>
            <h3>{t("几百页也不迷路")}</h3>
            <p>{t("文件树、大纲（左侧 / 右侧 / 切换）、标题折叠，大纲随位置自动展开；每份文件记住读到哪里。")}</p>
          </div>
          <div className="tree-visual">
            <b>▾ 项目</b>
            <span>　README.md</span>
            <span>　设计笔记.md</span>
            <span className="active">　写作计划.md</span>
          </div>
        </article>
        <article className="feature-card">
          <div>
            <small>LINK PREVIEW</small>
            <h3>{t("链接悬停就能看")}</h3>
            <p>{t("网页、图片、文件夹、标题，以及文本和 Markdown 文件开头 14 行；front matter 标签和 Wiki 链接把文档连起来。")}</p>
          </div>
          <div className="link-visual">
            <span>[[ 西北的植物 ]]</span>
            <div>
              <b>西北的植物</b>
              <p>沙枣耐旱、耐风沙……</p>
            </div>
          </div>
        </article>
        <article className="feature-card">
          <div>
            <small>PASTE</small>
            <h3>{t("从 Word、Excel、网页粘贴")}</h3>
            <p>{t("标题、列表、链接、表格和图片尽量转成 Markdown；Excel 单元格超出表格时自动补行补列。")}</p>
          </div>
          <div className="table-visual">
            <span>项目</span>
            <span>状态</span>
            <b>阅读体验</b>
            <b>完成</b>
            <b>导出模板</b>
            <b>进行中</b>
          </div>
        </article>
        <article className="feature-card appearance">
          <div>
            <small>APPEARANCE</small>
            <h3>{t("17 套配色，浅深各选")}</h3>
            <p>{t("Shazao、Dracula、One Dark、Tokyo Night、Nord、Solarized、GitHub、Catppuccin 等；字体、行距、正文宽度、专注与打字机模式；界面有简体、繁體和 English。")}</p>
          </div>
          <div className="theme-visual palette-screenshot">
            <img
              src={`${import.meta.env.BASE_URL}screens/v0620-settings-light.png`}
              alt="Shazao 设置中的浅色配色方案"
              loading="lazy"
            />
          </div>
        </article>
        <article className="feature-card">
          <div>
            <small>EXPORT & HISTORY</small>
            <h3>{t("写完带走")}</h3>
            <p>{t("HTML、单文件 HTML、PDF（带书签，长表格跨页接排）、Word、EPUB，图片内嵌的单个 .md；CSS 模板批量导出。")}</p>
          </div>
          <div className="format-visual">
            <span>HTML</span>
            <span>PDF</span>
            <span>DOCX</span>
            <span>EPUB</span>
          </div>
        </article>
      </div>
    </section>
  );
}

function FactStrip() {
  const { t } = useLocale();
  return (
    <section className="fact-strip section-wrap" aria-label={t("实测")}>
      <div className="fact-grid">
        {facts.map(([value, label]) => (
          <div key={value}>
            <b>{t(value)}</b>
            <span>{t(label)}</span>
          </div>
        ))}
      </div>
      <p>{t("本机实测数据，来自各版本发布说明。")}</p>
    </section>
  );
}

function DesignSection() {
  const { t } = useLocale();
  return (
    <section id="performance" className="performance">
      <div className="performance-inner">
        <SectionLabel index="03">{t("怎么做的")}</SectionLabel>
        <h3>
          {t("专门为快和稳做的设计")}
          <Berry />
        </h3>
        <p className="design-sub">{t("不基于 Electron，不需要 WebView2，不套网页壳。")}</p>
        <div className="tech-pills">
          <span>C++20</span>
          <span>Win32</span>
          <span>DirectWrite</span>
          <span>Direct2D</span>
          <span>WIC</span>
        </div>
        <div className="design-grid">
          {designPoints.map(([title, desc], index) => (
            <article key={title}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <h4>{t(title)}</h4>
              <p>{t(desc)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Voices() {
  const { t } = useLocale();
  return (
    <section className="voices section-wrap">
      <SectionLabel index="06">{t("用户怎么说")}</SectionLabel>
      <div className="detail-heading voices-heading">
        <h3>
          {t("来自小众软件论坛的真实反馈")}
          <Berry />
        </h3>
        <a href={appinnUrl}>
          {t("查看全部讨论")} <ArrowIcon />
        </a>
      </div>
      <div className="voice-grid">
        {voices.map(([quote, user, post]) => (
          <a key={post} className="voice" href={`${appinnUrl}${post}`}>
            <p>“{t(quote)}”</p>
            <span>— {user} · #{post}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

const gallery = [
  ["v0620-main.png", "打开就读，落笔就写", "SHAZAO LIGHT"],
  ["v0620-dark-diagram.png", "把想法画出来", "SHAZAO DARK"],
  ["v0620-code.png", "给想法一张表，给实现一段代码", "SHAZAO LIGHT"],
  ["v0620-dark-gallery.png", "用不同的图，讲不同的事", "SHAZAO DARK"],
];

const cares = [
  ["切换视图，光标闪一下", "在编辑与源码之间切换时，光标处短暂高亮，马上找到刚才写到哪里。", "care-caret-flash.gif"],
  ["按住图标拖动窗口", "标签开满、标题栏没有空白时，按住左上角的程序图标也能移动窗口。", "care-drag-icon.gif"],
  ["块的上下，都能插入空行", "代码块、表格、引用的上方和下方点一下“+”，就能插入空行继续写。", "care-insert-line.gif"],
  ["表格列宽，拖一下就好", "按住列之间的边线左右拖动，直接调整列宽。", "care-column-drag.gif"],
  ["大纲自动跟随展开", "滚动或移动光标时，大纲自动展开到当前标题并高亮。", "care-outline-follow.gif"],
];

const details = [
  ["v0620-table.png", "段落抓手与表格工具条", "0.6.20"],
  ["v0620-tabs.png", "Chrome 式标签，一起变窄", "0.6.20"],
  ["v0620-source.png", "源码视图，随时切换", "SOURCE"],
  ["v0620-menu-insert.png", "插入 ▸ 图表：8 个 Mermaid 模板", "INSERT"],
  ["v0620-settings-dark.png", "设置：配色方案即点即预览", "SETTINGS"],
];

function Gallery() {
  const { t } = useLocale();
  return (
    <section id="screenshots" className="gallery section-wrap">
      <SectionLabel index="05">{t("截图")}</SectionLabel>
      <div className="gallery-grid">
        {gallery.map(([image, title, theme]) => (
          <figure key={image}>
            <div className="screenshot">
              <img
                src={`${import.meta.env.BASE_URL}screens/${image}`}
                alt={`${t(title)}，${theme}`}
                loading="lazy"
              />
            </div>
            <figcaption>
              <b>{t(title)}</b>
              <span>{theme}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="gallery-note">{t("还有更多配色，可以慢慢挑。")}</p>
      <div className="detail-heading">
        <h3>
          {t("更多细节")}
          <Berry />
        </h3>
        <Link to="/guide">
          {t("查看使用指南")} <ArrowIcon />
        </Link>
      </div>
      <div className="detail-grid">
        {details.map(([image, title, tag]) => (
          <figure key={image}>
            <div className="screenshot">
              <img src={`${import.meta.env.BASE_URL}screens/${image}`} alt={t(title)} loading="lazy" />
            </div>
            <figcaption>
              <b>{t(title)}</b>
              <span>{tag}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="detail-heading care-heading">
        <h3>
          {t("贴心细节")}
          <Berry />
        </h3>
        <span>{t("那些用久了才会发现的小事。")}</span>
      </div>
      <div className="care-grid">
        {cares.map(([title, desc, gif], index) => (
          <article key={title}>
            <div className="care-media">
              <img
                src={`${import.meta.env.BASE_URL}screens/${gif}`}
                alt={t(title)}
                loading="lazy"
              />
            </div>
            <div className="care-text">
              <small>{String(index + 1).padStart(2, "0")}</small>
              <h4>{t(title)}</h4>
              <p>{t(desc)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Story() {
  const { t } = useLocale();
  return (
    <section id="story">
      <div className="story-quote">
        <p>
          {t("五月，沙枣花开，")}
          <br />
          {t("整个房间都是它的味道")}
          <Berry />
        </p>
        <span>{t("—— 来自作者的故事")}</span>
      </div>
      <div className="story-body section-wrap">
        <SectionLabel index="07">{t("名称由来")}</SectionLabel>
        <div className="story-grid">
          <article className="story-copy">
            <h2>
              {t("一种植物，")}
              <br />
              {t("一个地方")}
              <Berry />
            </h2>
            <p>
              {t("我来自西北的一座小城。")}
              <br />
              {t("想用一种植物代表那个地方，也代表一种我熟悉的精神，于是选择了沙枣。")}
            </p>
            <p>{t("沙枣是西北很常见的植物。耐旱、耐风沙、耐盐碱，在贫瘠的土地上也能生长。")}</p>
            <p>
              {t(
                "每年五月前后，沙枣花开，香气飘得很远。小时候，大人会折几枝带回家插在屋里，整个房间都是沙枣花的味道。",
              )}
            </p>
            <p>
              {t("所以这个软件叫 Shazao。")}
              <br />
              {t("对我来说，它不只是一个名字，也是对西北、故乡和生活记忆的一点纪念。")}
            </p>
            <p className="afterword">
              {t(
                "后记：最开始，只是想做一个打开 Markdown 比较舒服的小工具。后来慢慢加入了编辑、表格、图片、导出、Mermaid、大纲和搜索，现在它已经能陪你日常阅读和写作。",
              )}
            </p>
          </article>
          <div className="symbol-story">
            <div>
              <Logo className="story-logo" />
              <p>
                <b>{t("纸与 S")}</b>
                <small>{t("从一行文字开始")}</small>
              </p>
            </div>
            <div>
              <span className="fruit-symbol">
                <i />
              </span>
              <p>
                <b>{t("枝头的沙枣")}</b>
                <small>{t("写到这里落下一颗沙枣")}</small>
              </p>
            </div>
            <div>
              <span className="dune-symbol">
                <i />
                <i />
              </span>
              <p>
                <b>{t("沙丘")}</b>
                <small>{t("生于风沙")}</small>
              </p>
            </div>
          </div>
        </div>
        <div className="palette-title">
          <h3>{t("来自西北的颜色，但不止于“乡土”")}</h3>
        </div>
        <div className="palette-row">
          {[
            ["沙米", "#F6E9D4"],
            ["枝绿", "#6A8B50"],
            ["枣红", "#B8321A"],
            ["沙黄", "#D29834"],
            ["夜墨", "#25221F"],
          ].map(([name, color]) => (
            <div
              key={color}
              style={{ backgroundColor: color }}
              className={color === "#25221F" || color === "#B8321A" ? "light-text" : ""}
            >
              <b>{t(name)}</b>
              <span>{color}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLocale();
  return (
    <footer>
      <div className="footer-brand">
        <Logo />
        <b>Shazao 沙枣</b>
        <span>{t("从一行文字，到一份作品。")}</span>
      </div>
      <div>
        <Link to="/">{t("首页")}</Link>
        <Link to="/download">{t("下载")}</Link>
        <Link to="/guide">{t("使用指南")}</Link>
        <Link to="/blog">{t("博客")}</Link>
        <a href={`${repoUrl}/issues`}>{t("反馈问题")}</a>
      </div>
      <small>© {new Date().getFullYear()} Shazao</small>
    </footer>
  );
}

export function RootLayout() {
  const [theme, setTheme] = useState("sand");
  const [locale, setLocale] = useState<Locale>("zh");
  const t = (text: string) => (locale === "zh" ? text : translations[text]?.[locale] || text);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale === "tw" ? "zh-TW" : "en";
  }, [locale]);

  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      <div className="site-shell">
        <Header theme={theme} setTheme={setTheme} locale={locale} setLocale={setLocale} />
        <Outlet />
        <Footer />
      </div>
    </LocaleContext.Provider>
  );
}

export function HomePage() {
  const { t } = useLocale();
  return (
    <main>
      <section id="top" className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow">NATIVE MARKDOWN EDITOR · WINDOWS</div>
          <h1>
            {t("打开就读，")}
            <br />
            <em>
              {t("落笔就写")}
              <Berry />
            </em>
          </h1>
          <p>
            {t("Windows 原生 Markdown 阅读与编辑器。")}
            <br />
            <span>{t("一个约 9 MB 的 EXE，0.46 秒启动；直接在排版好的页面里编辑，1 GB 的文件约 2 秒显示正文。")}</span>
          </p>
          <div className="hero-buttons">
            <Link className="button" to="/download">
              {t("免费下载 v0.6.21")} <ArrowIcon />
            </Link>
            <a className="button ghost" href="#features">
              {t("查看功能")}
            </a>
          </div>
          <small className="platform-line">
            {t("v0.6.21 · Windows 10 / 11 64 位 · 免安装 · 免账号 · 默认不联网 · 免费")}
          </small>
        </div>
        <div className="hero-product">
          <div className="product-window">
            <img
              src={`${import.meta.env.BASE_URL}screens/v0620-main.png`}
              alt="Shazao 浅色主题产品界面"
            />
          </div>
          <svg
            className="dune-line"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 96C190 28 362 38 528 92C696 24 910 8 1200 82" />
          </svg>
        </div>
      </section>
      <FactStrip />
      <EditorDemo />
      <FeatureGrid />
      <DesignSection />
      <Gallery />
      <Voices />
      <section className="home-end section-wrap">
        <h2>{t("从一行文字，到一份作品。")}</h2>
        <Link className="button" to="/download">
          {t("免费下载 v0.6.21")} <ArrowIcon />
        </Link>
      </section>
    </main>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero section-wrap">
      <div className="eyebrow">{eyebrow}</div>
      <h1>
        {title}
        <Berry />
      </h1>
      <p>{description}</p>
    </section>
  );
}

export function BlogPage() {
  const { t } = useLocale();
  return (
    <main>
      <PageHero
        eyebrow="JOURNAL"
        title={t("博客")}
        description={t("关于产品、开发和故乡的文章，会慢慢写在这里。")}
      />
      <section className="blog-page section-wrap">
        <div className="blog-grid">
          <a className="blog-card featured" href={appinnUrl}>
            <small>APPINN · 2025</small>
            <h3>{t("我为什么做 Shazao")}</h3>
            <p>{t("在小众软件发布的自荐介绍，记录产品最初的样子和想法。")}</p>
            <span>
              {t("阅读文章")} <ArrowIcon />
            </span>
          </a>
          <Link className="blog-card" to="/blog/shazao-story">
            <small>BRAND STORY</small>
            <h3>{t("名称由来")}</h3>
            <p>{t("关于西北、写作，以及一款小工具如何慢慢长大。")}</p>
            <span>
              {t("阅读文章")} <ArrowIcon />
            </span>
          </Link>
          <article className="blog-card">
            <small>DEV NOTES</small>
            <h3>{t("开发手记")}</h3>
            <p>{t("关于性能、原生开发与设计取舍。")}</p>
            <span>{t("内容整理中")}</span>
          </article>
          <article className="blog-card">
            <small>WRITING</small>
            <h3>{t("随笔与故事")}</h3>
            <p>{t("关于西北、写作，以及一款小工具如何慢慢长大。")}</p>
            <span>{t("内容整理中")}</span>
          </article>
        </div>
      </section>
    </main>
  );
}

export function StoryPage() {
  return (
    <main>
      <Story />
    </main>
  );
}

export function DownloadPage() {
  const { t } = useLocale();
  return (
    <main>
      <PageHero
        eyebrow="DOWNLOAD"
        title={t("下载")}
        description={t("最新版 v0.6.21 · Windows 10 / 11 64 位 · 免安装 · 免账号 · 免费")}
      />
      <section className="download download-page section-wrap">
        <div className="download-grid">
          <article className="available">
            <small>WINDOWS</small>
            <h3>{t("现已推出")}</h3>
            <p>{t("v0.6.21 · Windows 10 / 11 · 64 位")}</p>
            <div className="store-buttons">
              <a className="button" href={storeUrl}>
                {t("微软应用商店")} <ArrowIcon />
              </a>
              <a className="button ghost" href={releaseUrl}>
                {t("下载Windows版")}
              </a>
            </div>
          </article>
          <article>
            <small>macOS</small>
            <h3>{t("开发中")}</h3>
            <p>{t("还在开发，暂无预计时间")}</p>
            <a className="button ghost" href={repoUrl}>
              {t("关注进展")}
            </a>
          </article>
        </div>
        <div className="download-details">
          <article>
            <b>01</b>
            <h3>{t("单文件")}</h3>
            <p>{t("Shazao-markdown.exe 约 9.5 MB，下载后双击运行，不需要安装向导。")}</p>
          </article>
          <article>
            <b>02</b>
            <h3>Microsoft Store</h3>
            <p>{t("商店版自动更新；新版本在商店审核通过后上架。")}</p>
          </article>
          <article>
            <b>03</b>
            <h3>{t("便携模式")}</h3>
            <p>{t("在 EXE 旁边新建 Shazao-data 文件夹，设置、历史版本和缓存都存在里面，整个文件夹放进 U 盘就能带走。")}</p>
          </article>
          <article>
            <b>04</b>
            <h3>SHA256</h3>
            <p>{t("每个版本附 SHA256SUMS；ZIP 约 8 MB，含版本说明、第三方声明和约 3.7 MB 的 UPX 压缩版。")}</p>
          </article>
        </div>
        <div className="download-foot">
          <a href={`${repoUrl}/issues`}>
            {t("反馈问题")} · GitHub Issues <ArrowIcon />
          </a>
          <span>{t("只在加载网络图片和检查更新时联网；检查更新默认关闭。")}</span>
        </div>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="not-found section-wrap">
      <span>404</span>
      <h1>页面没有找到。</h1>
      <Link className="button" to="/">
        返回首页
      </Link>
    </main>
  );
}
