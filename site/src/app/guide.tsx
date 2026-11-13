import type { ReactNode } from "react";
import { ArrowIcon, PageHero, releaseUrl, repoUrl, storeUrl, useLocale } from "./pages";

type Text = { zh: string; tw: string; en: string };

const shot = (name: string) => `${import.meta.env.BASE_URL}screens/${name}`;

function Shot({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="doc-shot">
      <div className="screenshot">
        <img src={shot(src)} alt={alt} loading="lazy" />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Keys({ combo }: { combo: string }) {
  return (
    <span className="keys">
      {combo.split("+").map((key, index) => (
        <kbd key={index}>{key}</kbd>
      ))}
    </span>
  );
}

const sections: { id: string; title: Text }[] = [
  { id: "start", title: { zh: "快速开始", tw: "快速開始", en: "Quick start" } },
  { id: "interface", title: { zh: "界面一览", tw: "介面一覽", en: "The window" } },
  { id: "modes", title: { zh: "三种编辑模式", tw: "三種編輯模式", en: "Three editing modes" } },
  { id: "writing", title: { zh: "表格、代码与图表", tw: "表格、程式碼與圖表", en: "Tables, code & diagrams" } },
  { id: "navigation", title: { zh: "长文与多文档", tw: "長文與多文件", en: "Long & many documents" } },
  { id: "appearance", title: { zh: "外观与设置", tw: "外觀與設定", en: "Appearance & settings" } },
  { id: "export", title: { zh: "导出与历史版本", tw: "匯出與歷史版本", en: "Export & history" } },
  { id: "data", title: { zh: "数据、便携与更新", tw: "資料、便攜與更新", en: "Data, portable & updates" } },
  { id: "shortcuts", title: { zh: "常用快捷键", tw: "常用快速鍵", en: "Keyboard shortcuts" } },
  { id: "feedback", title: { zh: "反馈与更新日志", tw: "回報與更新日誌", en: "Feedback & changelog" } },
];

const shortcuts: { combo: string; label: Text }[] = [
  { combo: "Ctrl+O", label: { zh: "打开 Markdown", tw: "開啟 Markdown", en: "Open Markdown" } },
  { combo: "Ctrl+S", label: { zh: "保存", tw: "儲存", en: "Save" } },
  { combo: "Ctrl+/", label: { zh: "切换编辑模式", tw: "切換編輯模式", en: "Cycle editing mode" } },
  { combo: "F2", label: { zh: "锁定 / 就地编辑", tw: "鎖定 / 就地編輯", en: "Lock / edit in place" } },
  { combo: "Esc", label: { zh: "锁定文档", tw: "鎖定文件", en: "Lock document" } },
  { combo: "Ctrl+F", label: { zh: "查找（选区内自动只查选区）", tw: "尋找（有選取時僅在選取範圍內）", en: "Find (within selection when selected)" } },
  { combo: "Ctrl+H", label: { zh: "查找并替换", tw: "尋找並取代", en: "Find & replace" } },
  { combo: "F8", label: { zh: "显示 / 隐藏大纲", tw: "顯示 / 隱藏大綱", en: "Show / hide outline" } },
  { combo: "Ctrl+Shift+1", label: { zh: "侧栏：大纲（2 文件夹 · 3 最近 · 4 收藏）", tw: "側欄：大綱（2 資料夾 · 3 最近 · 4 收藏）", en: "Sidebar: outline (2 folder · 3 recent · 4 favorites)" } },
  { combo: "Ctrl+Alt+1", label: { zh: "一级标题（2–6 同理，0 为正文）", tw: "一級標題（2–6 同理，0 為內文）", en: "Heading 1 (2–6 likewise, 0 for body)" } },
  { combo: "Ctrl+B", label: { zh: "加粗（Ctrl+I 斜体 · Ctrl+U 下划线）", tw: "粗體（Ctrl+I 斜體 · Ctrl+U 底線）", en: "Bold (Ctrl+I italic · Ctrl+U underline)" } },
  { combo: "Ctrl+K", label: { zh: "插入链接", tw: "插入連結", en: "Insert link" } },
  { combo: "Ctrl+T", label: { zh: "插入表格", tw: "插入表格", en: "Insert table" } },
  { combo: "Ctrl+Shift+K", label: { zh: "插入代码块", tw: "插入程式碼區塊", en: "Insert code block" } },
  { combo: "Ctrl+Shift+M", label: { zh: "插入公式块", tw: "插入公式區塊", en: "Insert math block" } },
  { combo: "Ctrl+Shift+I", label: { zh: "插入图片", tw: "插入圖片", en: "Insert image" } },
  { combo: "Ctrl+Shift+X", label: { zh: "任务列表", tw: "工作清單", en: "Task list" } },
  { combo: "Ctrl+Shift+V", label: { zh: "粘贴为纯文本", tw: "貼上為純文字", en: "Paste as plain text" } },
  { combo: "Ctrl+Shift+C", label: { zh: "复制 Markdown 源码", tw: "複製 Markdown 原始碼", en: "Copy Markdown source" } },
  { combo: "Alt+Left", label: { zh: "后退（Alt+Right 前进）", tw: "上一步（Alt+Right 下一步）", en: "Back (Alt+Right forward)" } },
  { combo: "Shift+Space", label: { zh: "表格：选择整行（Ctrl+Space 整列）", tw: "表格：選取整列（Ctrl+Space 整欄）", en: "Table: select row (Ctrl+Space column)" } },
  { combo: "Alt+Shift+M", label: { zh: "表格：合并单元格（Alt+Shift+U 拆分）", tw: "表格：合併儲存格（Alt+Shift+U 分割）", en: "Table: merge cells (Alt+Shift+U split)" } },
  { combo: "Ctrl+Alt+,", label: { zh: "打开快捷键配置", tw: "開啟快速鍵設定", en: "Open shortcut config" } },
];

export function GuidePage() {
  const { locale } = useLocale();
  const L = (text: Text) => text[locale];
  const P = ({ children }: { children: Text }) => <p>{L(children)}</p>;
  const Items = ({ items }: { items: Text[] }) => (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{L(item)}</li>
      ))}
    </ul>
  );
  const Section = ({ index, id, children }: { index: number; id: string; children: ReactNode }) => (
    <article id={id}>
      <small>{String(index + 1).padStart(2, "0")}</small>
      <h2>{L(sections[index].title)}</h2>
      {children}
    </article>
  );

  return (
    <main>
      <PageHero
        eyebrow="DOCUMENTATION"
        title={L({ zh: "使用指南", tw: "使用指南", en: "Guide" })}
        description={L({
          zh: "从下载到导出，十分钟上手 Shazao。以下内容对应 v0.6.19，截图均为实际界面。",
          tw: "從下載到匯出，十分鐘上手 Shazao。以下內容對應 v0.6.19，截圖皆為實際介面。",
          en: "From download to export, get comfortable with Shazao in ten minutes. Written for v0.6.19; every screenshot is the real app.",
        })}
      />
      <section className="guide-page section-wrap">
        <aside className="docs-nav">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {L(section.title)}
            </a>
          ))}
        </aside>
        <div className="docs-content">
          <Section index={0} id="start">
            <P>
              {{
                zh: "Shazao 是一个 EXE，无需安装、无需账号，默认不联网。下载后双击运行，打开一份 Markdown 就可以开始读和写。",
                tw: "Shazao 是一個 EXE，無需安裝、無需帳號，預設不連網。下載後按兩下執行，開啟一份 Markdown 就可以開始讀和寫。",
                en: "Shazao is a single EXE: no installer, no account, offline by default. Download it, double-click, open a Markdown file and start reading and writing.",
              }}
            </P>
            <ol>
              <li>
                {L({
                  zh: "从 Microsoft Store 安装（自动更新），或在 GitHub Releases 下载 EXE / win64 ZIP。支持 Windows 10 / 11 64 位。",
                  tw: "從 Microsoft Store 安裝（自動更新），或在 GitHub Releases 下載 EXE / win64 ZIP。支援 Windows 10 / 11 64 位元。",
                  en: "Install from the Microsoft Store (updates automatically), or download the EXE / win64 ZIP from GitHub Releases. Windows 10 / 11, 64-bit.",
                })}
              </li>
              <li>
                {L({
                  zh: "运行 Shazao-markdown.exe，按 Ctrl+O 打开文件，或把 .md 文件 / 文件夹直接拖进窗口。",
                  tw: "執行 Shazao-markdown.exe，按 Ctrl+O 開啟檔案，或把 .md 檔案 / 資料夾直接拖進視窗。",
                  en: "Run Shazao-markdown.exe, press Ctrl+O, or drag a .md file or folder onto the window.",
                })}
              </li>
              <li>
                {L({
                  zh: "直接在排版后的正文里修改，Ctrl+S 保存。想先熟悉一下？打开仓库里的 demo 文件夹，从「你好，沙枣」开始。",
                  tw: "直接在排版後的內文裡修改，Ctrl+S 儲存。想先熟悉一下？開啟儲存庫裡的 demo 資料夾，從「你好，沙棗」開始。",
                  en: "Edit right in the rendered text and press Ctrl+S to save. To warm up, open the demo folder in the repository and start with “Hello, Shazao”.",
                })}
              </li>
            </ol>
            <div className="doc-actions">
              <a className="button" href={storeUrl}>
                Microsoft Store <ArrowIcon />
              </a>
              <a className="button ghost" href={releaseUrl}>
                GitHub Releases
              </a>
              <a className="button ghost" href={`${repoUrl}/tree/main/demo`}>
                {L({ zh: "演示文档", tw: "示範文件", en: "Demo documents" })}
              </a>
            </div>
          </Section>

          <Section index={1} id="interface">
            <P>
              {{
                zh: "窗口分成三块：上方是菜单与标签栏，左侧是侧栏，右侧是正文。所有面板都可以隐藏，只留下文字。",
                tw: "視窗分成三塊：上方是選單與標籤列，左側是側欄，右側是內文。所有面板都可以隱藏，只留下文字。",
                en: "The window has three parts: menu and tabs at the top, the sidebar on the left, and your document on the right. Every panel can be hidden so only the words remain.",
              }}
            </P>
            <Shot
              src="shazao-ui-outline.png"
              alt="Shazao 主窗口：左侧大纲，右侧提示块、任务清单与表格"
              caption={L({
                zh: "主窗口：标签栏、大纲、正文与底部状态栏",
                tw: "主視窗：標籤列、大綱、內文與底部狀態列",
                en: "Main window: tabs, outline, document and status bar",
              })}
            />
            <dl className="doc-legend">
              <dt>{L({ zh: "标签栏", tw: "標籤列", en: "Tabs" })}</dt>
              <dd>
                {L({
                  zh: "多文档标签，可搜索、固定和拖动排序；拖出标签栏开新窗口，拖到另一个窗口即合并。",
                  tw: "多文件標籤，可搜尋、釘選和拖曳排序；拖出標籤列開新視窗，拖到另一個視窗即合併。",
                  en: "Search, pin and reorder tabs. Drag a tab out for a new window, or onto another window to merge.",
                })}
              </dd>
              <dt>{L({ zh: "侧栏底部", tw: "側欄底部", en: "Sidebar bar" })}</dt>
              <dd>
                {L({
                  zh: "依次为：收起侧栏、文件夹、大纲、最近打开、收藏；还有“标签”面板列出 front matter 标签。",
                  tw: "依序為：收合側欄、資料夾、大綱、最近開啟、收藏；還有「標籤」面板列出 front matter 標籤。",
                  en: "Collapse sidebar, folder, outline, recent files and favorites, plus a Tags panel for front matter tags.",
                })}
              </dd>
              <dt>{L({ zh: "状态栏", tw: "狀態列", en: "Status bar" })}</dt>
              <dd>
                {L({
                  zh: "后退 / 前进、字数统计、锁定按钮与源码切换按钮（</>）。",
                  tw: "上一步 / 下一步、字數統計、鎖定按鈕與原始碼切換按鈕（</>）。",
                  en: "Back / forward, word count, the lock button and the source toggle (</>).",
                })}
              </dd>
            </dl>
          </Section>

          <Section index={2} id="modes">
            <P>
              {{
                zh: "同一份文档有三种状态，按 Ctrl+/ 循环切换，也可以点状态栏右下角的按钮。撤销记录在三种模式间统一。",
                tw: "同一份文件有三種狀態，按 Ctrl+/ 循環切換，也可以按狀態列右下角的按鈕。復原記錄在三種模式間統一。",
                en: "Every document has three states. Press Ctrl+/ to cycle, or use the buttons at the bottom right. Undo history is shared across all three.",
              }}
            </P>
            <div className="mode-cards">
              <div>
                <b>{L({ zh: "所见即所得", tw: "所見即所得", en: "WYSIWYG" })}</b>
                <p>
                  {L({
                    zh: "在排版好的内容里直接写：标题、列表、表格、图片都就地编辑。",
                    tw: "在排版好的內容裡直接寫：標題、清單、表格、圖片都就地編輯。",
                    en: "Write in the rendered page: headings, lists, tables and images are edited in place.",
                  })}
                </p>
              </div>
              <div>
                <b>{L({ zh: "源码", tw: "原始碼", en: "Source" })}</b>
                <p>
                  {L({
                    zh: "需要精确控制 Markdown 时切过来；大文件也只处理改动的部分。",
                    tw: "需要精確控制 Markdown 時切過來；大檔案也只處理改動的部分。",
                    en: "Switch here for exact Markdown control; even huge files only process what changed.",
                  })}
                </p>
              </div>
              <div>
                <b>{L({ zh: "锁定阅读", tw: "鎖定閱讀", en: "Reading lock" })}</b>
                <p>
                  {L({
                    zh: "按 Esc 锁定，避免误改；F2 回到就地编辑。",
                    tw: "按 Esc 鎖定，避免誤改；F2 回到就地編輯。",
                    en: "Press Esc to lock against accidental edits; F2 returns to editing in place.",
                  })}
                </p>
              </div>
            </div>
            <P>
              {{
                zh: "从 Word、网页、Excel 复制的富文本粘贴进来，会尽量转换成对应的 Markdown（标题、格式、链接、列表、表格和图片）；只要文字时用 Ctrl+Shift+V。",
                tw: "從 Word、網頁、Excel 複製的富文字貼上進來，會盡量轉換成對應的 Markdown（標題、格式、連結、清單、表格和圖片）；只要文字時用 Ctrl+Shift+V。",
                en: "Rich text pasted from Word, browsers or Excel is converted to matching Markdown — headings, formatting, links, lists, tables and images. Use Ctrl+Shift+V for plain text.",
              }}
            </P>
          </Section>

          <Section index={3} id="writing">
            <P>
              {{
                zh: "点进表格就会出现工具条：插入行列、对齐方式、复制表格，以及“适合页面 / 超出页面滚动”。Shift+Space 选整行，Ctrl+Space 选整列，Alt+Shift+M 合并单元格。",
                tw: "點進表格就會出現工具列：插入列欄、對齊方式、複製表格，以及「適合頁面 / 超出頁面捲動」。Shift+Space 選整列，Ctrl+Space 選整欄，Alt+Shift+M 合併儲存格。",
                en: "Click into a table to bring up its toolbar: insert rows and columns, alignment, copy, and fit-to-page or scroll. Shift+Space selects a row, Ctrl+Space a column, Alt+Shift+M merges cells.",
              }}
            </P>
            <Shot
              src="shazao-ui-table.png"
              alt="表格工具条：表格菜单、对齐按钮与复制"
              caption={L({
                zh: "表格工具条：放得下时单元格不换行，放不下时只让最长的列换行",
                tw: "表格工具列：放得下時儲存格不換行，放不下時只讓最長的欄換行",
                en: "Table toolbar: cells stay on one line when they fit; only the longest column wraps",
              })}
            />
            <Items
              items={[
                {
                  zh: "代码块：Ctrl+Shift+K 插入，自带语法高亮，工具条可选语言、自动换行与复制。",
                  tw: "程式碼區塊：Ctrl+Shift+K 插入，內建語法高亮，工具列可選語言、自動換行與複製。",
                  en: "Code blocks: Ctrl+Shift+K. Syntax highlighting built in; the toolbar sets the language, wrapping and copy.",
                },
                {
                  zh: "Mermaid：流程图、时序图、状态图、类图、ER 图、甘特图、思维导图、Git 图、C4、时间线、象限图、XY 图等直接显示；图中文字可以拖选复制。",
                  tw: "Mermaid：流程圖、循序圖、狀態圖、類別圖、ER 圖、甘特圖、心智圖、Git 圖、C4、時間軸、象限圖、XY 圖等直接顯示；圖中文字可以拖選複製。",
                  en: "Mermaid: flowcharts, sequence, state, class, ER, Gantt, mindmap, Git graph, C4, timeline, quadrant and XY charts render inline — and their text can be selected and copied.",
                },
                {
                  zh: "数学公式：Ctrl+Shift+M 插入公式块，支持常用 LaTeX 与 amssymb 符号。",
                  tw: "數學公式：Ctrl+Shift+M 插入公式區塊，支援常用 LaTeX 與 amssymb 符號。",
                  en: "Math: Ctrl+Shift+M inserts a math block, with common LaTeX and amssymb symbols.",
                },
                {
                  zh: "图片：粘贴或 Ctrl+Shift+I 插入，单击图片可编辑源码、缩放；右键“替换图片 ▸ 从剪贴板”可直接换成刚截的图。",
                  tw: "圖片：貼上或 Ctrl+Shift+I 插入，按一下圖片可編輯原始碼、縮放；右鍵「取代圖片 ▸ 從剪貼簿」可直接換成剛截的圖。",
                  en: "Images: paste or press Ctrl+Shift+I. Click an image to edit its source or resize; right-click › Replace image › From clipboard swaps in a fresh screenshot.",
                },
                {
                  zh: "也支持任务清单、脚注、引用式链接与 Tip / Note 等提示块。",
                  tw: "也支援工作清單、註腳、參考式連結與 Tip / Note 等提示區塊。",
                  en: "Task lists, footnotes, reference links and Tip / Note callouts are supported too.",
                },
              ]}
            />
            <Shot
              src="shazao-ui-code.png"
              alt="代码块语法高亮与大纲中的代码章节"
              caption={L({
                zh: "代码块：语法高亮、语言标签与工具条",
                tw: "程式碼區塊：語法高亮、語言標籤與工具列",
                en: "Code blocks: highlighting, language tag and toolbar",
              })}
            />
          </Section>

          <Section index={4} id="navigation">
            <P>
              {{
                zh: "几百页的技术文档也能保持方向：大纲跟随当前位置高亮，标题可以折叠，每份文件都会记住上次读到哪里。",
                tw: "幾百頁的技術文件也能保持方向：大綱跟隨目前位置高亮，標題可以摺疊，每份檔案都會記住上次讀到哪裡。",
                en: "Stay oriented even in a several-hundred-page spec: the outline follows your position, headings fold, and each file remembers where you stopped reading.",
              }}
            </P>
            <Shot
              src="shazao-ui-long-doc.png"
              alt="长篇技术文档：多级大纲与文中图片"
              caption={L({
                zh: "长篇英文规范：多级大纲、标题折叠与图片",
                tw: "長篇英文規範：多級大綱、標題摺疊與圖片",
                en: "A long specification: nested outline, folding headings and images",
              })}
            />
            <Items
              items={[
                {
                  zh: "大纲位置：设置 ▸ 大纲，可放在左侧（与文件上下排列）、右侧单独一栏，或与文件切换显示。F8 开合。",
                  tw: "大綱位置：設定 ▸ 大綱，可放在左側（與檔案上下排列）、右側單獨一欄，或與檔案切換顯示。F8 開合。",
                  en: "Outline position: Settings › Outline — left (stacked with files), its own right-hand column, or toggled with files. F8 shows or hides it.",
                },
                {
                  zh: "最近打开按今天 / 昨天 / 最近 7 天 / 更早分组；常用文件可加入收藏。",
                  tw: "最近開啟依今天 / 昨天 / 最近 7 天 / 更早分組；常用檔案可加入收藏。",
                  en: "Recent files are grouped by today, yesterday, last 7 days and earlier; keep favorites close at hand.",
                },
                {
                  zh: "文档标签：在 front matter 写 tags: [a, b]，标签会显示在正文上方；侧栏“标签”面板列出文件夹里的全部标签。",
                  tw: "文件標籤：在 front matter 寫 tags: [a, b]，標籤會顯示在內文上方；側欄「標籤」面板列出資料夾裡的全部標籤。",
                  en: "Tags: write tags: [a, b] in front matter and they appear above the text; the Tags panel lists every tag in the folder.",
                },
                {
                  zh: "链接预览：鼠标停在链接上，可预览网页、文件、图片、文件夹或文档中的标题；也支持 Wiki 链接。",
                  tw: "連結預覽：滑鼠停在連結上，可預覽網頁、檔案、圖片、資料夾或文件中的標題；也支援 Wiki 連結。",
                  en: "Link previews: hover a link to preview a web page, file, image, folder or heading. Wiki links work too.",
                },
                {
                  zh: "大文件：1 GB 文件约 2 秒显示正文；64 MB 以上的文件在后台保存，标题栏显示“正在保存…”。",
                  tw: "大檔案：1 GB 檔案約 2 秒顯示內文；64 MB 以上的檔案在背景儲存，標題列顯示「正在儲存…」。",
                  en: "Huge files: a 1 GB file shows its text in about 2 seconds; files over 64 MB save in the background while the title bar says “Saving…”.",
                },
              ]}
            />
          </Section>

          <Section index={5} id="appearance">
            <P>
              {{
                zh: "设置窗口左上角可以直接搜索选项。外观里分别为浅色和深色各选一套配色，跟随 Windows 切换；点选配色立即预览整个窗口，「取消」恢复原样。",
                tw: "設定視窗左上角可以直接搜尋選項。外觀裡分別為淺色和深色各選一套配色，跟隨 Windows 切換；點選配色立即預覽整個視窗，「取消」恢復原樣。",
                en: "Search any option from the top-left of Settings. Under Appearance, pick one scheme for light and one for dark — they follow Windows. Clicking a scheme previews the whole window; Cancel restores it.",
              }}
            </P>
            <Shot
              src="shazao-ui-settings.png"
              alt="设置 ▸ 外观：深色配色方案，包括 Shazao 深色、Dracula、One Dark、Tokyo Night、Tokyo Night Storm、Nord"
              caption={L({
                zh: "设置 ▸ 外观：Shazao、Dracula、One Dark、Tokyo Night、Nord 等配色，也可自定义颜色",
                tw: "設定 ▸ 外觀：Shazao、Dracula、One Dark、Tokyo Night、Nord 等配色，也可自訂顏色",
                en: "Settings › Appearance: Shazao, Dracula, One Dark, Tokyo Night, Nord and more — or customise the colors",
              })}
            />
            <Items
              items={[
                {
                  zh: "界面语言：跟随系统 / 简体中文 / 繁體中文 / English，语言包是 languages 目录下的外部文件。",
                  tw: "介面語言：跟隨系統 / 简体中文 / 繁體中文 / English，語言套件是 languages 目錄下的外部檔案。",
                  en: "Interface language: follow system, Simplified Chinese, Traditional Chinese or English. Language packs are plain files in the languages folder.",
                },
                {
                  zh: "字体与版面：字体、行距、正文宽度（可随窗口宽度）与正文位置（居中 / 靠左 / 靠右）。",
                  tw: "字型與版面：字型、行距、內文寬度（可隨視窗寬度）與內文位置（置中 / 靠左 / 靠右）。",
                  en: "Fonts & layout: typeface, line height, text width (up to the window width) and alignment (centre, left or right).",
                },
                {
                  zh: "专注模式与打字机模式；每个文件夹可以有自己的外观。",
                  tw: "專注模式與打字機模式；每個資料夾可以有自己的外觀。",
                  en: "Focus and typewriter modes; each folder can keep its own appearance.",
                },
                {
                  zh: "只有点「确定」才会保存设置与快捷键；「取消」保持原样。",
                  tw: "只有按「確定」才會儲存設定與快速鍵；「取消」保持原樣。",
                  en: "Settings and shortcuts are saved only when you press OK; Cancel leaves everything as it was.",
                },
              ]}
            />
          </Section>

          <Section index={6} id="export">
            <P>
              {{
                zh: "写完的文档可以导出为 HTML、PDF、Word 与 EPUB；HTML / PDF 可以复用 CSS 模板批量导出。图片可以用 Base64 内嵌，导出为单个 Markdown 文件，方便分享。",
                tw: "寫完的文件可以匯出為 HTML、PDF、Word 與 EPUB；HTML / PDF 可以重複使用 CSS 範本批次匯出。圖片可以用 Base64 內嵌，匯出為單一 Markdown 檔案，方便分享。",
                en: "Export finished documents to HTML, PDF, Word or EPUB; HTML and PDF can be batch-exported with a reusable CSS template. Images can be embedded as Base64 for a single shareable Markdown file.",
              }}
            </P>
            <div className="format-visual">
              <span>HTML</span>
              <span>PDF</span>
              <span>DOCX</span>
              <span>EPUB</span>
            </div>
            <P>
              {{
                zh: "每次保存都会留下本地历史版本：侧栏的历史面板里可以查看、与当前内容比较，并一键恢复。",
                tw: "每次儲存都會留下本機歷史版本：側欄的歷史面板裡可以檢視、與目前內容比較，並一鍵還原。",
                en: "Saving keeps local history: open the history panel to view an older version, compare it with the current text and restore it.",
              }}
            </P>
          </Section>

          <Section index={7} id="data">
            <Items
              items={[
                {
                  zh: "历史、草稿、恢复副本、图片缓存、持久撤销和阅读状态默认保存在 %LOCALAPPDATA%\\Shazao，可在 设置 ▸ 数据与存储 中管理。",
                  tw: "歷史、草稿、復原副本、圖片快取、持久復原和閱讀狀態預設儲存在 %LOCALAPPDATA%\\Shazao，可在 設定 ▸ 資料與儲存 中管理。",
                  en: "History, drafts, recovery copies, image cache, persistent undo and reading positions live in %LOCALAPPDATA%\\Shazao by default; manage them in Settings › Data & storage.",
                },
                {
                  zh: "便携模式：在 EXE 旁边新建 Shazao-data 文件夹，所有数据都保存在里面，适合放进 U 盘。",
                  tw: "便攜模式：在 EXE 旁邊新增 Shazao-data 資料夾，所有資料都儲存在裡面，適合放進隨身碟。",
                  en: "Portable mode: create a Shazao-data folder next to the EXE and everything is stored there — ready for a USB stick.",
                },
                {
                  zh: "只有获取网络图片和检查更新时才会联网。帮助 ▸ 检查更新… 下载新版本后按 SHA256SUMS 校验；也可设为每周检查（默认关闭）。",
                  tw: "只有取得網路圖片和檢查更新時才會連網。說明 ▸ 檢查更新… 下載新版本後依 SHA256SUMS 驗證；也可設為每週檢查（預設關閉）。",
                  en: "Shazao only goes online to fetch web images or check for updates. Help › Check for updates… verifies downloads against SHA256SUMS; weekly checks are optional (off by default).",
                },
                {
                  zh: "INI、快捷键与用户词典都保留可编辑入口；升级不会直接删除旧数据。",
                  tw: "INI、快速鍵與使用者詞典都保留可編輯入口；升級不會直接刪除舊資料。",
                  en: "The INI, shortcuts and user dictionary stay editable, and upgrades never silently delete old data.",
                },
              ]}
            />
          </Section>

          <Section index={8} id="shortcuts">
            <P>
              {{
                zh: "以下为默认快捷键。可以在 设置 ▸ 快捷键 中修改，或按 Ctrl+Alt+, 打开快捷键配置文件，保存后立即生效。",
                tw: "以下為預設快速鍵。可以在 設定 ▸ 快速鍵 中修改，或按 Ctrl+Alt+, 開啟快速鍵設定檔，儲存後立即生效。",
                en: "These are the defaults. Change them in Settings › Shortcuts, or press Ctrl+Alt+, to edit the shortcut file — changes apply as soon as you save.",
              }}
            </P>
            <div className="shortcut-table">
              {shortcuts.map((item) => (
                <div key={item.combo}>
                  <Keys combo={item.combo} />
                  <span>{L(item.label)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section index={9} id="feedback">
            <P>
              {{
                zh: "遇到显示错误、编辑问题或有功能建议，欢迎在 GitHub Issues 或小众软件论坛反馈。每个版本的新功能、修复与已知问题都记录在更新日志中。",
                tw: "遇到顯示錯誤、編輯問題或有功能建議，歡迎在 GitHub Issues 或小眾軟體論壇回報。每個版本的新功能、修正與已知問題都記錄在更新日誌中。",
                en: "Found a rendering glitch, an editing problem, or have an idea? Tell us on GitHub Issues or the Appinn forum. Every release's features, fixes and known issues are in the changelog.",
              }}
            </P>
            <div className="doc-actions">
              <a className="button" href={`${repoUrl}/issues`}>
                GitHub Issues <ArrowIcon />
              </a>
              <a className="button ghost" href={`${repoUrl}/blob/main/doc/CHANGELOG.md`}>
                {L({ zh: "更新日志", tw: "更新日誌", en: "Changelog" })}
              </a>
              <a className="button ghost" href={`${repoUrl}/blob/main/doc/PUBLIC_ROADMAP.md`}>
                {L({ zh: "开发计划", tw: "開發計畫", en: "Roadmap" })}
              </a>
            </div>
          </Section>
        </div>
      </section>
    </main>
  );
}
