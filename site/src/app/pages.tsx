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
        <small>v0.6.20</small>
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
          {t("读与写，不必来回切换")}
          <Berry />
        </h2>
        <p>{t("在排版后的内容中直接编辑，需要精确控制时切到源码。")}</p>
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

function FeatureGrid() {
  const { t } = useLocale();
  return (
    <section id="features" className="features section-wrap">
      <SectionLabel index="02">{t("打开就读，落笔就写")}</SectionLabel>
      <div className="section-heading">
        <h2>
          {t("复杂的能力，")}
          <br />
          {t("简单地出现")}
          <Berry />
        </h2>
        <p>{t("从阅读、编辑到导出，每一步都留在同一份文档里。")}</p>
      </div>
      <div className="bento">
        <article className="feature-card feature-wide">
          <div>
            <small>DIAGRAMS & CODE</small>
            <h3>
              {t("给想法一张图，")}
              <br />
              {t("给实现一段代码")}
              <Berry />
            </h3>
            <p>{t("Mermaid、数学公式、语法高亮，无需离开文档。")}</p>
          </div>
          <div className="diagram-visual">
            <pre>{`flowchart LR\n  想法 --> 结构\n  结构 --> 作品`}</pre>
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
            <h3>{t("长文也有清楚的方向")}</h3>
            <p>{t("文件树、大纲、标题折叠、多标签，并记住每份文档的阅读位置。")}</p>
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
            <small>CONNECTED DOCS</small>
            <h3>{t("文档之间彼此相连")}</h3>
            <p>{t("链接悬停预览、front matter 标签与 Wiki 链接。")}</p>
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
            <small>RICH CONTENT</small>
            <h3>{t("粘贴进来结构还在")}</h3>
            <p>{t("表格、任务清单、脚注、提示块；从 Word、网页和 Excel 粘贴也能保留结构。")}</p>
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
            <h3>
              {t("为喜欢的文字，")}
              <br />
              {t("选一种颜色")}
              <Berry />
            </h3>
            <p>{t("字体、行距、阅读宽度、专注模式与打字机模式。")}</p>
          </div>
          <div className="theme-visual palette-screenshot">
            <img
              src={`${import.meta.env.BASE_URL}screens/shazao-color-schemes.png`}
              alt="Shazao 浅色、One Light、Tokyo Night Day、Solarized Light、GitHub Light、Catppuccin Latte 与 Gruvbox Light 配色方案"
              loading="lazy"
            />
          </div>
        </article>
        <article className="feature-card">
          <div>
            <small>EXPORT & HISTORY</small>
            <h3>{t("写完带去任何地方")}</h3>
            <p>{t("HTML、PDF、Word、EPUB 批量导出；本地历史随时比较与恢复。")}</p>
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

const gallery = [
  ["v0620-main.png", "打开就读，落笔就写", "SHAZAO LIGHT"],
  ["v0620-dark-diagram.png", "把想法画出来", "SHAZAO DARK"],
  ["v0620-code.png", "给想法一张表，给实现一段代码", "SHAZAO LIGHT"],
  ["v0620-dark-gallery.png", "用不同的图，讲不同的事", "SHAZAO DARK"],
];

const cares = [
  ["切换视图，光标闪一下", "在编辑与源码之间切换时，光标处短暂高亮，马上找到刚才写到哪里。"],
  ["按住图标拖动窗口", "标签开满、标题栏没有空白时，按住左上角的程序图标也能移动窗口。"],
  ["块的上下，都能插入空行", "代码块、表格、引用的上方和下方点一下“+”，就能插入空行继续写。"],
  ["表格列宽，拖一下就好", "按住列之间的边线左右拖动，直接调整列宽。"],
  ["大纲自动跟随展开", "滚动或移动光标时，大纲自动展开到当前标题并高亮。"],
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
      <SectionLabel index="04">{t("截图")}</SectionLabel>
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
        {cares.map(([title, desc], index) => (
          <article key={title}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <h4>{t(title)}</h4>
            <p>{t(desc)}</p>
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
          <div className="eyebrow">NATIVE MARKDOWN EDITOR</div>
          <h1>
            {t("生于风沙，")}
            <br />
            <em>
              {t("落笔成章")}
              <Berry />
            </em>
          </h1>
          <p>
            {t("从一行文字，到一份作品。")}
            <br />
            <span>{t("阅读极速秒开 · 所见即所得 · 丰富的图表编辑")}</span>
          </p>
          <div className="hero-buttons">
            <Link className="button" to="/download">
              {t("免费下载")} <ArrowIcon />
            </Link>
            <a className="button ghost" href="#features">
              {t("查看功能")}
            </a>
          </div>
          <small className="platform-line">
            {t("Windows 现已推出 · macOS 开发中 · 单文件 · 免安装 · 免账号 · 免费")}
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
      <EditorDemo />
      <FeatureGrid />
      <section id="performance" className="performance">
        <div className="performance-inner">
          <SectionLabel index="03">{t("性能")}</SectionLabel>
          <div className="perf-main">
            <h2>
              <span>1 GB</span>
              <i>→</i>
              <span>{t("约 2 秒")}</span>
            </h2>
            <p>{t("打开即显示正文，编辑与保存只处理改动部分。")}</p>
          </div>
          <div className="tech-pills">
            <span>C++20</span>
            <span>{t("原生渲染")}</span>
            <span>{t("单文件")}</span>
            <span>{t("默认不联网")}</span>
          </div>
          <h3>
            {t("不基于 Electron，")}
            <br />
            {t("不套网页壳")}
            <Berry />
          </h3>
          <div className="perf-metrics">
            {[
              ["01", "单文件"],
              ["02", "免安装"],
              ["03", "免账号"],
              ["04", "默认不联网"],
            ].map(([n, label]) => (
              <div key={n}>
                <b>{n}</b>
                <span>{t(label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Gallery />
      <section className="home-end section-wrap">
        <h2>{t("从一行文字，到一份作品。")}</h2>
        <Link className="button" to="/download">
          {t("免费下载")} <ArrowIcon />
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
        description={t("Windows 现已推出 · macOS 开发中 · 单文件 · 免安装 · 免账号 · 免费")}
      />
      <section className="download download-page section-wrap">
        <div className="download-grid">
          <article className="available">
            <small>WINDOWS</small>
            <h3>{t("现已推出")}</h3>
            <p>{t("Windows 10 / 11 · 64 位")}</p>
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
            <p>{t("即将到来")}</p>
            <a className="button ghost" href={repoUrl}>
              {t("关注进展")}
            </a>
          </article>
        </div>
        <div className="download-details">
          <article>
            <b>01</b>
            <h3>{t("单文件")}</h3>
            <p>下载后即可运行，不需要安装向导。</p>
          </article>
          <article>
            <b>02</b>
            <h3>Microsoft Store</h3>
            <p>通过应用商店安装，并自动获取后续版本。</p>
          </article>
          <article>
            <b>03</b>
            <h3>Portable</h3>
            <p>在程序旁创建 Shazao-data 文件夹，即可使用便携模式。</p>
          </article>
          <article>
            <b>04</b>
            <h3>SHA256</h3>
            <p>GitHub 发布页提供校验文件，便于验证下载完整性。</p>
          </article>
        </div>
        <div className="download-foot">
          <a href={`${repoUrl}/issues`}>
            {t("反馈问题")} · GitHub Issues <ArrowIcon />
          </a>
          <span>{t("单文件，免安装；支持便携模式。")}</span>
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
