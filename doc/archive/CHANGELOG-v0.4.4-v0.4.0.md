# Shazao 早期版本记录 · v0.4.4 至 v0.4.0

[返回版本历史](../CHANGELOG.md#早期版本记录) · [归档 README 原文](README-public-before-20261028.md#版本历史)

## v0.4.4-rc2 — Runtime editing defect closure

- 修复 AltGr 被 Windows 表示为 `Ctrl + RightAlt` 后误触发 `Ctrl+Alt+0~6` 的问题：所有 `Ctrl+Alt` 自定义快捷键在 RightAlt/AltGr 活跃时让位给字符输入。
- 修复选中完整 Markdown 链接可见文字后按 Enter 泄漏 `](url)`；结构 Enter 现在把完整可见 inline wrapper 的隐藏语法纳入同一语义选择，覆盖链接、粗体、删除线、inline code 与受支持 inline HTML。
- 标题栏按 `ViewMode` 显示 `[锁定] / [就地编辑] / [源码编辑]`，dirty 状态只控制 `*`，不再因 ViewEditor 已激活而丢失“就地编辑”标签。
- 就地编辑 `Ctrl+A` 改为两级选择：第一次当前块，当前块已全选时第二次升级全文；全文 Copy/Cut/Delete/Paste 走 document-wide transaction。锁定直接全文，源码保持全源码。
- “快捷键配置……”改为启动新的 Shazao 窗口；配置窗口直接 SourceEdit 打开 `Shazao-shortcuts.ini`，原文档窗口不被替换。原窗口重新获得激活时自动 reload 配置。
- 新增 TC-724~TC-728 与 `tests/verify_v044_rc2.py`。

## v0.4.4-rc2 — Line-start Enter caret semantics

- **正文行首 Enter**：在正文第 0 列按 Enter 时，前面新增一个空正文段落，但 caret 继续跟随原正文并落在其新位置的第 0 列；不再主动选中新建的 `[]()` 占位空段。
- **标题行首 Enter**：同样在标题前新增普通空正文，caret 保持在原标题第 0 列；标题类型与文本不变。
- **不再依赖 block vector index**：结构编辑后用原文本在新源码中的 UTF-8 logical source offset 重新解析目标 block，再恢复 caret。这样 parser 重建/索引变化不会把 caret 错放到新空段。
- **空段连续 Enter 保持原规则**：已经处在空段时再次 Enter，caret 继续向下移动到新空段，不与“非空正文行首 Enter”混为一条规则。
- 新增 `tests/verify_enter_caret_behavior.py` 与 TC-718~TC-723，明确区分源码静态检查和 Windows GUI 实机 caret 验收。

## v0.4.3-rc9-p11 — Configurable Shortcuts / In-App Shortcut Config

- 段落默认快捷键恢复为 `Ctrl+Alt+0~6`：`Ctrl+Alt+0` 正文，`Ctrl+Alt+1~6` 为 H1~H6；仍与右键“段落”菜单共用 `WM_COMMAND -> ApplyParagraphCommand()`。
- 新增统一 `ShortcutConfig` 注册表：打开、保存、查找、复制/剪切/粘贴、撤销/重做、行内格式、段落/列表、插入、编辑模式、大纲、导航、表格操作等现有用户快捷键均由一份配置驱动。
- 首次运行在 EXE 同目录生成 `Shazao-shortcuts.ini`。可直接修改默认按键；值设为 `None` / `Off` / `Disabled` 或留空即可取消该快捷键。缺失配置项继续使用默认值；无效的显式自定义值不会偷偷恢复默认。
- 右键菜单所有已有快捷键提示改为读取当前配置；新增“快捷键配置……”入口。点击后 Shazao 自己打开 `Shazao-shortcuts.ini` 并进入源码编辑，无需外部编辑器。
- 保存快捷键配置后立即热重载，不需要重启 Shazao；配置文件不会进入“最近打开”Markdown 历史。
- 配置文件由 Shazao 自己按 UTF-8 读取/写入，不依赖 Win32 Profile API，确保中文注释与本工具源码编辑保存链路一致。
- 修复快捷键配置命令与 `CMD_INLINE_EDIT=1014` 的命令 ID 冲突，并将 Cell Undo/Redo 拆成独立可配置动作，不再隐式依赖 `Shift+Undo`。

## v0.4.3-rc9-p11 — Three-mode Back / Forward

- **三种模式统一历史**：锁定、就地编辑、源码编辑都使用同一套 NavigationLocation；历史项以 logical-source viewport anchor + caret + ViewMode 保存，不再把源码编辑的连续文本滚动位置误当成 WYSIWYG Block byte offset。
- **统一跳转入口**：大纲、文档内锚点、Find Next 均进入 `NavigateToBlock()`；就地编辑先提交当前瞬态块，源码编辑直接移动 source caret，锁定模式移动 reader caret/viewport。
- **恢复顺序固定**：Back/Forward 先进入中性的锁定投影恢复逻辑 caret，再进入历史 ViewMode，最后恢复 viewport；避免 caret 把历史阅读位置拉走。
- **状态栏立即解灰**：push/pop/forward-clear 后统一 `UpdateStatusBarState(true)`，不再依赖下一次无关重绘才更新箭头状态。
- **附带修复**：rc9-p9 的段落 PreTranslate action 数组曾有重复项且和 command 数量不一致，本版固定为严格 7 项 `正文 + H1~H6`。

## v0.4.3-rc9-p11 — Viewport Navigation History

- Back/Forward 不再只记录大纲、搜索、链接等显式跳转；滚动条拖动、较大滚轮/触控板滚动、PageUp/PageDown、Ctrl+Home/Ctrl+End 也进入同一 NavigationHistory。
- 滚动历史以 `logical source viewport anchor + client Y` 为主，不以隐藏 caret 为主。锁定、就地编辑、源码编辑三种模式共享这一坐标体系。
- 滚动条 thumb drag 是一个事务：第一次 `SB_THUMBTRACK` 捕获起点，拖动过程中不堆历史，`SB_THUMBPOSITION/SB_ENDSCROLL` 只提交一次。
- 鼠标滚轮/触控板使用 650 ms idle debounce；连续滚动合并为一个历史点，小于约半屏的轻微浏览不会污染 Back/Forward。
- viewport 历史项设置 `restoreCaret=false`。Back/Forward 恢复“刚才看到的位置”，不把页面重新拉回旧编辑光标；大纲/Find/内部链接等显式导航仍恢复 caret。
- PageUp/PageDown 作为 viewport navigation；源码编辑和就地编辑中的 Ctrl+Home/Ctrl+End 作为 caret navigation。新导航分支统一清空 Forward 栈。
- `tests/verify_navigation_gestures.py` 对滚动条事务、wheel debounce、三模式 viewport restore、Page/Home/End 和 forward-branch 语义做静态门禁。

## v0.4.3-rc9-p8 — Locked / Inline / Source Fixed Mode Strip

- 用户态三态正式命名为 **锁定（只读） / 就地编辑 / 源码编辑**；内部 `ViewMode::Browse` 也重命名为 `ViewMode::Locked`，避免 UI 语义与代码状态继续分裂。
- `Ctrl+/` 使用单一状态机：`Locked -> InlineEdit -> SourceEdit -> InlineEdit ...`。进入编辑后不再因为快捷键回到锁定；锁定是显式只读目的地。
- 状态栏右侧改为三个**固定槽位**：`锁定 | 就地 | 源码`。三个 hit rect、分隔线和顺序始终不变，仅当前状态增加文字与高亮，避免切换后按钮位置变化造成点击负担。
- 三个状态栏槽位都是直接目的地：点锁定只会进入锁定，点就地只会进入就地，点源码只会进入源码；当前槽位重复点击无状态变化。
- 新增锁定矢量图标与三态悬浮提示；锁定默认提示“当前：锁定（只读）”，编辑态提示当前状态，非当前槽位提示切换目标。
- 设置文案同步改为“打开文档后默认就地编辑（关闭=锁定）”；默认关闭时打开文档直接进入锁定。

## v0.4.3-rc9-p7 — Paragraph Command Core / Unicode-safe Block Transform

- **根因修复，不再围绕快捷键打补丁**：段落/标题命令过去把 `Block::start/end` 的 UTF-8 **字节偏移**拿去索引 `std::wstring` 的 Unicode 字符，ASCII 行偶尔正常，而中文行会因为字节数 > 字符数直接跳过替换。现在段落事务只用 byte offset 向 `Document::Text()` 取片段，随后按 Unicode 文本顺序拼接，不再混用坐标空间。
- `Ctrl+0~6`、右键“段落 → 正文/H1~H6”、标题升降、实时 Markdown block trigger 最终都汇入同一个 `ApplyParagraphCommand()` 事务。快捷键本身只负责产生 `WM_COMMAND`，不再存在第二套标题转换代码。
- 右键菜单在弹出前记录 DirectWrite 命中的 block/caret；popup 抢焦点后仍然格式化**右击的那一行**，而不是旧光标所在行。
- 多块选择改为按 Document byte range 左到右重建，保留块间空行/gap，支持中文、`√`、Markdown 链接、嵌套列表等真实文本。
- 新增 TC-689~TC-692 与 Unicode/右键目标回归检查，测试语料直接使用 `tests/fixtures/rc9-user-0921.md`。

## v0.4.3-rc9-p6 — Ctrl+0~6 Heading Shortcuts

- 段落/标题快捷键简化为 `Ctrl+0~6`：`Ctrl+0` 正文，`Ctrl+1~6` 为 H1~H6。
- 删除 Alt 依赖，避免 AltGr、`WM_SYSKEYDOWN`、输入法对组合键投递的影响。
- 主路径直接在 `PreTranslateMessage()` 中识别 `Ctrl+数字`，不再创建 Accelerator Table，最终统一进入 `ApplyParagraphCommand()`。
- `tests/fixtures/rc9-user-0921.md` 收录用户 2026-09-21 实际测试文档，回归覆盖标题、空行、嵌套列表、链接等行型。

## v0.4.3-rc9-p6 — Ctrl Heading Accelerator

- `Ctrl+0~6` 使用消息循环的直接本地识别，不创建 Accelerator Table，不依赖 Alt。
- Accelerator 只在 Shazao `InlineEdit` 消息循环中调用，不使用 `RegisterHotKey`，不会注册全局快捷键。
- 保留 scan-code fallback，并增加显式 Ctrl/Alt/Shift 状态跟踪与 `GetAsyncKeyState` 兜底。
- 主窗口与 Shazao 子编辑控件获得焦点时均进入同一 `WM_COMMAND -> ApplyParagraphCommand()` 路径。

## v0.4.3-rc9-p6 — Viewport-Preserving Window Move

- **纯移动窗口不再跳回 caret**：Win32 的 `WM_ENTERSIZEMOVE/WM_EXITSIZEMOVE` 同时用于移动与缩放。以前即使只拖标题栏换位置，退出 modal loop 时也会执行 resize anchor 恢复；若存在可见编辑 caret，就会把用户刚用滚动条选中的阅读位置强行拉回 caret。
- **区分 Move 与 Size**：进入 move/size loop 时记录当前 `scrollY`，只有期间实际收到 `WM_SIZE` 才执行原有 semantic resize-anchor 恢复；没有 `WM_SIZE` 的纯移动在松手时以 viewport/scrollbar 位置为准。
- **滚动条位置精确保留**：纯移动结束时恢复进入移动前的 `scrollY` 并同步 scrollbar，不调用 `AlignLogicalSourceOffsetToClientY()`，因此 Browse / InlineEdit / SourceEdit 都不会因为移动窗口而自动追 caret。
- **真实 resize 行为不变**：拖窗口边框、最大化/还原等实际尺寸变化继续使用冻结 source anchor + reflow envelope，保持之前的阅读锚点策略。

## v0.4.3-rc9-p3 — Continuous Edit Frame / Outline Splitter Geometry

- **移除 rc9-p2 的“splitter 里补画左边线”方案**：蓝/黄编辑模式边框重新只由 `DrawViewModeOverlay()` 一处绘制，和上/右/下三条边保持同一矩形、同一坐标系、同一生命周期。
- **Splitter 不再跨入正文**：`outlineWidth` 仍表示整个左侧 pane；ListBox 使用 `outlineWidth - splitterWidth`，splitter 占 pane 最右侧 6 DIP，并且右边缘恰好停在 `DocumentRect().left`。因此 child HWND 不再覆盖正文左边框。
- **拖动时重新布局/刷新即可**：每次宽度变化继续走 `OnResize()`，重新计算 `DocumentRect()/ContentRect()` 并 invalid 主窗口；边框随新的正文矩形整体重画，不再单独画一条“补丁线”。
- **大纲滚动条不被 splitter 覆盖**：ListBox 自己缩短到 splitter 左边，原生滚动条仍完整属于 ListBox。

## v0.4.3-rc9-p2 — Shortcut / Inline-Link Enter / Edit-Frame Regression

- `Ctrl+0~6` 增加消息循环级本地快捷键：在 `TranslateMessage` 之前消费 `WM_KEYDOWN/WM_SYSKEYDOWN`，同时识别主键盘数字、数字小键盘以及顶部数字行 scan code，避免键盘布局/IME/AltGr 风格消息让段落快捷键失效。
- 段落转换仍复用统一 `ApplyParagraphCommand()`，不会创建第二套标题修改逻辑。
- WYSIWYG 中若 caret 位于一个 inline wrapper 的**可见末尾**（如 `[这个不错](url)`、`**粗体**`、`<u>下划线</u>`），Enter 会把 split source boundary 推进到完整隐藏 closing syntax 之后，避免下一行暴露 `](url)` 或闭合 marker。
- 大纲宽度 splitter 继续跨在 outline/document 边界上，但现在会在自身 child HWND 内补画 InlineEdit 蓝色 / SourceEdit 黄色左边框，因此可调大纲不会再遮掉编辑框左边线。
- 将用户提供的 `测试文档.md` 纳入 `tests/fixtures/rc9-user-edit-regression.md`，覆盖 H1/H2/H3/H4、连续空行、嵌套列表和末尾 Markdown link。

## v0.4.3-rc9-p1 — InlineEdit Navigation / IME / Repeated Heading Hotfix

- 空段落使用的隐藏 `[]()` sentinel 在普通 Up/Down 跨块导航时不再被提交为空字符串；离开空行不会让该编辑行从解析树中消失。显式 Backspace/Delete/第二次 Enter 仍按结构命令合并或退出。
- 自绘 DirectWrite 编辑器完全接管 IME preedit：屏蔽 legacy composition popup，只保留候选窗；通过 `WM_IME_REQUEST/IMR_QUERYCHARPOSITION` + `CFS_EXCLUDE` 把候选窗锚定到真实 caret，避免中文输入时出现“正文一份 + 浮动输入框又一份”的重复/漂移。
- `Ctrl+0~6` 在本地 ViewEditor 键处理之前路由；块转换后按 source offset 重新定位，并同步 reader caret，保证同一标题连续 H1→H2→…→正文反复修改。

## v0.4.3-rc9 — Inline Editing Commands + Live Markdown Transform

- **段落/标题快捷键**：`Ctrl+0` 为正文，`Ctrl+1~6` 为 H1~H6；标题不需要先选中文字，光标位于块内即可转换。跨多个文本块选择后执行同一快捷键，会对选择触及的所有可转换块批量应用。
- **标题升降级**：`Ctrl+=` / `Ctrl+-` 在 H1~H6 与正文之间调整等级，并保持当前逻辑 caret/selection，不因 `#` 数量变化跳到行首。
- **Typora 风格行内格式**：`Ctrl+B`、`Ctrl+I`、`Ctrl+U`、`Alt+Shift+S`、`Ctrl+Shift+`` `、`Ctrl+\`。有选区时直接包裹/取消格式；无选区时切换“后续输入格式”，首次输入即写入成对 Markdown/HTML marker，但 DirectWrite 只显示最终富文本，不暴露未闭合 marker。
- **实时块转换**：在普通段落行首输入 `# `~`###### `、`> `、`- ` / `* ` / `+ `、`1. ` / `1) ` 会立即转换成标题、引用、无序/有序列表；列表项开头继续输入 `[ ] ` 会升级为任务列表。
- **实时 fenced/rule 转换**：普通段落只包含 ` ``` ` 时按 Enter 立即成为代码块并把 caret 放到代码内容；`---` / `***` / `___` + Enter 立即生成分割线并在下一段继续输入。
- **代码块快捷键**：`Ctrl+Shift+K` 对当前可编辑文本块做原地“段落 ↔ fenced code”转换，不再只是向下插入一个空代码块；当前未保存文本会包含在同一结构事务中。
- **结构命令不丢字**：表格、图片、公式块等插入命令在执行前会提交当前 ViewEditor transient text，避免刚输入的字符被结构插入覆盖。
- **统一命令路径**：快捷键、上下文菜单与实时 Markdown trigger 都落到同一套 ViewEditor + Document 事务，不创建 RichEdit 文档层。

## v0.4.3-rc8-p2 — Empty Document Editing + Scrollable Recent

- 修复新建 0-byte / BOM-only / 仅空白字符 `.md` 打开后误显示 `Shazao / 最近打开` 首页的问题。
- 空文档解析为**仅运行时存在的零长度 Paragraph**，打开本身不会修改文件；开始输入后才真正写盘。
- `Document::ReplaceRange()` 允许对 0-byte 文件进行第一次写入，源码编辑也可正常保存。
- 空文档在就地编辑和源码编辑下都有稳定的首行 caret / hit-test；开启“打开文档后直接进入就地编辑模式”时会真正激活编辑器。
- 首页“最近打开”历史仍存储最多 **20** 项；rc8-p1 首页只显示前 12 项，rc8-p2 改为完整 20 项并接入与正文一致的 Windows 原生垂直滚动条。

## v0.4.3-rc8-p1 — Outline Selection + Resizable Width

- **p1 / MSVC build hotfix**：修复大纲宽度拖动代码中 `POINT::x`（`LONG`）与 `int` 上下界直接传给 `std::clamp` 导致的 C2672/C2737。现在先显式转换为 `int`，功能行为不变。

- **修复“大纲像 Shift+方向键一样越选越多”**：实际不是 ListBox 多选，而是 owner-draw current-section 使用外部索引绘制，Win32 切换 selection 时旧行没有在新状态下再次 invalid，导致旧绿色背景残留。rc8 在鼠标切换前预发布新 current/focus，并在 `LBN_SELCHANGE` 后显式 invalid old/new row，始终只保留一个高亮。
- **点击其他标题立即清理旧状态**：current section、native focused item 继续保持分离，但每次 transition 都重绘旧/新行；折叠箭头仍只控制树层级，不误触发标题导航。
- **默认宽度保持 250 DIP**：不按标题长度自动伸缩；配置范围仍为 180~520 DIP。
- **可拖动大纲宽度**：新增独立 `Shazao.OutlineSplitter` sibling child，位于大纲/正文边界，鼠标显示左右调整光标；不占额外正文宽度，也不与 ListBox 原生垂直滚动条抢命中。
- **拖动时保持阅读位置**：Outline splitter 复用窗口 live-resize 的 source anchor 机制；正文可实时 reflow，但同一拖动手势固定一个语义阅读锚点，松手再做最终校正。
- **长标题同步重测**：开启大纲换行时，拖动宽度会重新计算 owner-draw variable row height，避免窄宽变化后的标题重叠/残影。
- **宽度记忆**：松手后保存当前宽度；双击分隔条恢复 250 DIP 默认值。

## v0.4.3-rc7 — Stable Status Bar + Selection Count

- **状态栏真正独立刷新**：状态栏继续保持 `Shazao.StatusBar` sibling child window，但修复了主文档 `RedrawWindow(... RDW_ALLCHILDREN)` 与 `OnPaint()` 每帧主动 `InvalidateRect(statusBar_)` 的级联刷新；正文 paint、滚动和 GIF frame 不再强制重绘状态栏。
- **DocumentView-only redraw**：`RedrawMarkdownSurface()` 只 invalid `ContentRect()`，使用 `RDW_NOCHILDREN`，并取消父窗口背景擦除；GIF 20 ms tick 只进入正文 Direct2D surface。
- **事件驱动状态更新**：状态栏维护轻量状态签名；只有 ViewMode、大纲、前进/后退可用性、总字数或 selection 真正变化时才 invalid 自己。
- **选中文字统计**：总字数左边新增固定右侧 lane；有选区时显示 `选中 N`，无选区时保持空白，不让 `字数 N` 与编辑/源码按钮左右跳动。
- **选择统计口径**：Browse 使用 Renderer 的可见文本；SourceEdit 统计实际可见源码；InlineEdit 对普通 inline Markdown 先投影为可见文本再统计；CR/LF、表格生成的 Tab 等结构分隔不计入。
- **GIF 回归目标**：播放 `assets/animated.gif` 时正文可持续动画，但底部状态栏保持静止；选择文字期间 GIF 播放也不能把状态栏带入每帧刷新。

## v0.4.3-rc6 — Inline Image + GIF Animation

- **True Inline Image**：普通 Paragraph / Heading / List / Quote / Table Cell 中的 `文字 ![alt](image.png) 文字` 不再暴露 `![]()`，也不再拆成独立 Block；Renderer 将图片投影成 `U+FFFC`，由 `IDWriteInlineObject` 参与同一份 DirectWrite 行布局、换行与行高计算。
- **异步真实尺寸重排**：图片未完成时先用低干扰 placeholder 占位；解码完成后按真实宽高比更新 inline object，重新测量受影响 Block / Table，并在 MainWindow 的 viewport anchor 保护区间内更新 `HeightIndex`，减少“上方图片晚加载导致当前阅读位置跳动”。
- **Inline 尺寸约束**：默认不放大原图；inline 图片最大宽度约为当前可用行宽的 72%，最大高度约为 `max(72 DIP, 4.5 × 当前字号)`，避免一个超大图把整行撑成巨型 Block。
- **GIF 真动画**：WIC 读取全部 GIF frame；按 logical screen canvas 合成 partial frame，处理透明 Alpha 与 disposal 2/3，保留每帧 delay，并读取 Netscape loop extension。Block image 与 Inline Image 共用同一帧缓存/调度链。
- **低开销动画调度**：窗口保留 20 ms 定时 tick，但只有当前 paint envelope 中确实存在仍在播放的 GIF 才触发重绘；有限循环 GIF 播放结束后自动停在末帧并停止无意义刷新。
- **图片失败诊断升级**：失败占位不再只写“图片文件无法解码”。现在显示 **源**（Markdown 原始地址）、本地图片的 **解析路径**、以及 **原因**。可区分文件不存在、无权限、路径指向目录、0 字节、WIC 格式/像素/坏图错误、HTTP 状态、WinHTTP 发送/接收/读取失败，以及“网络请求成功但响应不是可解码图片”等。
- **图片信息增强**：右键“图片信息”对 GIF 显示帧数与循环信息；现有“重新加载图片”会清理该图片所有动画帧对应的 Direct2D bitmap cache。
- **兼容链保持不变**：PNG/JPEG/WebP/BMP/TIFF 等继续走 WIC；SVG 继续走 rc5 的 Direct2D SVG content-sniff；本地 / HTTP(S) / Data URI 仍使用既有 resolver/cache 策略。

## v0.4.3-rc5 — Image Format Compatibility I

- **SVG 正式进入支持矩阵**：WIC 继续负责 PNG/JPEG/GIF/WebP 等 raster；WIC 失败后自动 sniff SVG XML，并通过 Windows 10+ `ID2D1DeviceContext5 / ID2D1SvgDocument` 渲染为 BGRA premultiplied bitmap。无需 WebView2，也不修改 Markdown。
- **本地/网络/Data URI SVG 共用一条解码链**：网络缓存文件即使扩展名是 `.img` 也按内容 sniff；`data:image/svg+xml;base64,...` 直接进入 SVG decoder。
- **复杂 SVG 基线**：支持 `viewBox`、CSS `<style>`、`<defs>/<marker>`、文字、透明背景以及 Visio 导出的额外 namespace；SVG viewport 解析支持 px/in/cm/mm/pt/pc，并设置 8192 边长/5000 万像素安全上限。
- **裸空格路径宽容读取**：除标准 `<assets/file name.png>` 与 `%20` 外，也尽量读取现实文档中的 `![](assets/file name.png)`；只有末尾是合法 quoted/parenthesized title 时才从路径中剥离 title。
- **GIF 在 rc5 的能力边界**：rc5 仅通过 WIC 稳定显示第 0 帧；完整动画由后续 rc6 实现。
- **双测试基线**：`Shazao-Complex-TestCases.md` 的 TC-100~119/122 与 Caliptra ROM README 的 13 个 `doc/svg/*.svg` 作为图片兼容回归清单。
- **块级容器图片**：`> ![](a.png)` 按 Quote 容器显示；列表 continuation 缩进图片保持层级；`- ![](a.png)` 也作为图片对象处理，不暴露 Markdown 控制符。
- **图片链接**：`[![alt](a.png)](target)` 仍是一个图片对象；Browse 单击打开 outer link，InlineEdit 使用 Ctrl+单击；双击仍保留“打开图片”语义。
- **Standalone HTML `<img>`**：识别 `src/alt/title/width`，`width` 仅作为显示宽度 hint；右键路径编辑/全文转换只改 `src` value，不重写其他 HTML 属性。
- **全文路径工具扩展**：除 Markdown `![]()` 外，也扫描 HTML `<img src=...>`；继续跳过 fenced code，批量转换仍为单次 Undo。
- **rc5 当时刻意拆分**：正文同一行 inline image 与 GIF 动画在 rc5 尚未实现；前两项已由 rc6 补齐，GitHub Source Base URL 网络回源仍留在后续版本。

## v0.4.3-rc3 — Windows SDK Build Fix

- **修复 MSVC/Windows SDK 编译失败**：`image_path.cpp` 不再包含并非标准 Windows SDK 开发头的 `normaliz.h`，改为使用 SDK 自带的 `winnls.h`；`IdnToAscii()` 仍由 `Normaliz.lib` 链接提供。
- **不改变图片功能语义**：网络图片、IDN/Punycode、Unicode/URL 路径、跨系统路径解析、单图/全文转换、本地化行为全部沿用 rc2。
- **新增静态构建守卫**：`verify_source.py` 明确禁止重新引入 `<normaliz.h>`，并要求 `<winnls.h>` + `normaliz` 链接组合存在。

## v0.4.3-rc2 — Remote Image / Path Resolver

- **原文绝不私自改写**：浏览、解析、缓存、URL Decode、跨系统映射都只发生在运行时；只有用户明确执行“编辑 / 转换 / 本地化 / 全文转换”后才写回 Markdown，并进入单次 Undo。
- **网络图片**：`http/https` 进入后台 WinHTTP 下载队列，默认使用 `%LOCALAPPDATA%\Shazao\Cache\Images` 磁盘缓存；设置可关闭网络加载或磁盘缓存。`data:image/...;base64` 也可直接解码显示。
- **Unicode / URL**：网络请求前按 URL component 做 UTF-8 percent encode，并对 Unicode host 做 IDN/Punycode；Markdown 原 URL 保持不变。已存在合法 `%XX` 不会二次编码成 `%25XX`。
- **跨系统路径兼容**：识别 Windows `C:\...`、`C:/...`、UNC、`file://`、普通相对路径、WSL `/mnt/c/...`、Git Bash/MSYS `/c/...`、Linux/macOS POSIX absolute、http/https 与 Data URI。WSL/MSYS drive path 在 Windows 内部自动映射，但不改源文件。
- **人类可读路径 UI**：图片信息同时显示原始 Markdown 地址、可读地址、路径类型、实际访问路径/请求 URL、缓存文件、像素尺寸与可移植性。右键可分别复制“原始地址”和“可读地址”。
- **单图路径工具**：右键支持“编辑图片路径、转为可读路径、URL 编码、相对路径、绝对路径、Windows 路径、`/` 路径、下载并本地化”。编辑窗口默认显示 Decode 后的可读文本，取消不修改文档。
- **全文图片路径转换**：扫描 Markdown 图片 destination（跳过 fenced code），先给转换预览，再一次性应用；支持全文可读化、URL 编码、绝对⇄相对、Windows⇄`/`，整批修改只产生一个 Undo 事务。
- **全文网络图片本地化**：按设置保存到“同目录 / `images/` / `<文档名>.assets/` / `images/<文档名>/`”；默认 `images/<文档名>/`，默认写相对路径。单张下载失败保持原 URL 不动。
- **本地化文件名**：优先使用 URL 正常文件名；没有可用名称时使用 alt / `image`，再根据实际文件 magic 推断 `.png/.jpg/.gif/.webp/.bmp/.tif`；Windows 非法字符自动清理，重名自动追加 `-2/-3/...`。
- **读取宽容、显示友好、写入显式**：中文、空格、`%XX`、反斜杠等旧文档尽量都能显示；可读模式保留 Unicode，只对会改变 Markdown/URI 语义的本地文件字符做必要编码。

## v0.4.3-rc1 — Image Interaction I

- **图片对象选择**：Browse / InlineEdit 中单击图片只选中图片对象，不暴露 Markdown 源码；选中图片使用独立 accent 边框。
- **悬浮信息**：鼠标经过已加载图片时显示 `文件名 · 像素尺寸 · title` 的低干扰浮层；损坏/网络图片占位同时显示 alt 或 Markdown 路径。
- **双击打开**：双击本地图片使用系统默认图片查看器打开；不存在/网络图片通过 Reusable Notice 给出清晰提示。
- **图片右键菜单**：增加“打开图片 / 打开所在位置 / 复制图片 / 复制图片路径 / 复制 Markdown 图片语法 / 图片信息 / 重新加载图片”。选中图片后 `Ctrl+C` 直接复制位图。
- **Alt / Title 解析**：Image block 保存 `imageAlt` / `imageTitle`，用于错误占位、悬浮信息和图片属性。
- **异步加载不跳读**：`WM_APP_IMAGE_READY` 在图片高度刷新前捕获 viewport anchor，统一重算 image heights 后恢复 anchor；上方图片晚加载不会把当前阅读段落推走。
- **仍保持本地优先**：当前不主动下载 `http/https/data:` 图片；网络图片显示明确占位，后续版本再评估缓存/权限策略。

## v0.4.2-rc4 — Stable Table Caret / Compact Table Alignment / Navigation

- **表格模式切换保留 Cell 身份**：在 `就地编辑 → 浏览 → 源码编辑 → 浏览 → 就地编辑` 等往返中，除了 source offset 之外额外保存 Table `block/row/col`；源码未移动时返回精确原 Cell 与 Cell 内 caret，不再因表头/分隔行附近的 source 映射落到 Header。
- **短表格默认左对齐**：仍保留 intrinsic width；GitHub-style 默认贴正文阅读列左侧，不再强制居中。设置 → 阅读新增“短表格居中（不勾选则左对齐）”，需要时可切回居中。
- **状态栏 Tooltip 修复**：自绘状态栏改为显式 `TTM_RELAYEVENT` 转发鼠标消息，不再依赖不稳定的 `TTF_SUBCLASS`；大纲、后退、前进、就地编辑、源码编辑都显示悬浮说明。
- **前进/后退导航**：大纲按钮右侧加入 Tabler `arrow-left / arrow-right`，支持点击和 `Alt+← / Alt+→`；记录大纲跳转、内部锚点、查找跳转、跨 Markdown 文件链接，新的跳转会清空 Forward 栈。
- **导航恢复内容位置**：历史项保存文件路径、顶部文件偏移、逻辑 source caret 与 ViewMode；Back/Forward 可跨文件回到之前阅读位置。打开新文件前只有在编辑提交成功后才写入导航栈，避免失败操作污染历史。
- **图标资源**：`assets/icons/arrow-left.svg` / `arrow-right.svg` 保留官方 Tabler SVG；运行时继续使用 Direct2D 抗锯齿矢量绘制，保持单 EXE。

## v0.4.2-rc3 — Compact Table / Selection / Table Actions

- 短/窄表格不再强制拉满阅读列：按内容测量自然宽度，接近满宽时才扩展；紧凑表格在正文列内水平居中。
- Table Header 与 Zebra 使用中性层级；Selection 使用独立蓝色语义面，Current Line 使用非常淡的暖色带，避免互相混淆。
- 矩形 Cell Selection 采用统一不透明 selection surface，不再因 Header/Zebra 底色不同而出现多种选中色。
- 表格右键菜单增加整行/整列/整表选择、列对齐、合并、拆分；`Alt+Shift+M` 合并，`Alt+Shift+U` 拆分。
- 合并信息继续使用 `shazao-table` portable metadata；拆分只删除 merge metadata，原始被覆盖单元格数据仍可恢复。
- 表格上下文禁用段落、任务与缩进类命令，避免把整个 Pipe Table 误改成普通 Markdown Block。

## v0.4.2-rc2 — Outline / GitHub-style Table Polish

- **大纲显示最终标题文本**：Outline 不再直接使用 `HeadingInfo::title` 的 Markdown 源码；改为复用 Renderer 的 `BuildInline()` projection。`**bold**`、`` `code` ``、`[label](url)`、支持的 inline HTML/entity 都只显示最终可见文字。
- **标题锚点与可见标题一致**：内部 `#anchor` 的 slug 也基于投影后的标题计算，避免 `[Label](target.md)` 把隐藏 URL 混进 anchor。
- **Table 表头/表身层级**：Header 使用轻微 accent tint，并保持 550 字重；Body 使用 GitHub README 风格的低对比交错底色，浅/深色主题分别适配。
- **交互层级不回退**：zebra/header 底色先画，之后才是 range selection、hover、current-line、inline-code、selection 与文字，因此交错行不会削弱选择/编辑反馈。
- **审计清理**：移除一次重复的 `tableLayoutCache_.clear()`；更新测试状态版本；修正 `verify_source.py` 的末尾 guard 顺序，确保 rc1/rc2 新增检查失败时不会仍然输出 `VERIFY OK`。

## v0.4.2-rc1 — Single Caret / v0.4.2 Stabilization

- **Table Cell 只保留一个 caret**：删除 Table 专用的 Direct2D“浏览态假光标”；Browse / InlineEdit 统一由 `MainWindow::UpdateViewCaret()` 管理唯一 Win32 caret，与普通 Paragraph / Heading / ListItem 的架构一致。
- **根因**：fix12 的 Table 自绘路径仍残留 `readerCell && !editingCell` 时的 `FillRectangle()` caret，而主窗口同时会为 Table Browse caret 调用 `CreateCaret/ShowCaret`，因此 Cell 内会出现两根相邻/重叠竖线。
- **保留 renderer 职责**：Table selection、current-line、inline-code、IME underline 继续由 Direct2D 绘制；只有 collapsed insertion caret 统一交给 Win32，避免再次出现双光标。
- **版本线收敛**：fix12 功能基线视为 `v0.4.2`，后续候选修复使用 `v0.4.2-rcN`，不再延续 `fixXX` 长版本名。

## v0.4.1-rc1-p4-html2-fix12 — WYSIWYG Inline Projection / Precise Links / Highlight Semantics

- **Table Cell 真正 WYSIWYG**：活动单元格不再把 `tableEditSurface_.text` 直接作为显示文本，而是复用 `BuildInline()`。`**粗体**`、`*斜体*`、`~~删除线~~`、`` `code` ``、`[label](url)`、`<u>...</u>` 等在就地编辑时只显示语义结果，Markdown marker / URL 只在源码编辑中出现。
- **隐藏 marker 保持原子性**：Cell 的鼠标命中、左右/上下移动、Home/End、caret、selection 与 IME 均通过 `visualToEdit` 做 Visual ↔ Source 边界映射，不能用方向键或 Backspace/Delete “钻进”隐藏的 `**` / `](` 等控制符。
- **格式快捷键正式接入 Unified ViewEditor**：选中文字后 `Ctrl+B`、`Ctrl+I`、`Ctrl+U`、`Alt+Shift+S`、`Ctrl+Shift+`` 分别 Toggle 加粗、斜体、下划线、删除线、行内代码；再次执行取消对应格式。底层直接修改 Markdown source，不是只改字体。
- **右键“文字格式”**：补齐加粗 / 斜体 / 下划线 / 删除线 / 行内代码 / 清除文字格式；顶部快捷按钮同样变为 Toggle。无选择时不偷偷插 marker，而使用 Reusable Notice 提示先选择文字。
- **超链接精确命中**：DirectWrite `HitTestPoint` 仍会把行尾空白映射到最近字符，因此新增实际 cluster 矩形判定。现在只有鼠标位于可见链接 label 的真实字形/cluster 区域才可点击；同一行的前后空白、隐藏 URL 区域都不会触发。
- **当前行高亮不染结构标志**：行高亮从真实 `layoutX` 开始，明确避开无序/有序列表 marker、任务 checkbox、Quote bar、Hn marker、Code line-number gutter；这些语义结构始终保持自身颜色。
- **Table inline-code 不再被行高亮染色**：Cell 当前行背景先画，inline-code chip 后画，与普通段落绘制层级一致。
- **当前行 vs 选择区分更明显**：默认 selection 改为较明确的 mint green（字形范围、实色），current-line 改为 cool blue-gray（整行范围、低透明度）；表格/代码块/普通段落统一遵守“Current line 在下、Selection 在上”的绘制顺序。
- **审计结果**：Paragraph / Heading / Quote / ListItem 原本已使用 inline projection；这次发现的显式“编辑时还原 Markdown”路径是 Table Cell，并已移除。`CodeFence` 仍故意显示 `*`、`**` 等字符，因为那里是代码内容，不是 Markdown 格式控制符。

## v0.4.1-rc1-p4-html2-fix11 — AA Vector Status + Outline Wheel First-Step

- **状态图标改为 Direct2D 抗锯齿矢量**：不再用整数 GDI `Polyline/LineTo` 直接画 16～18px 小图标；Tabler `edit`、Phosphor `code`、IconPark `mindmap-list/left` 均使用浮点坐标、round cap/join 与 `D2D1_ANTIALIAS_MODE_PER_PRIMITIVE`，斜线和曲线边缘不再出现明显锯齿。
- **DPI 尺寸跟随状态栏真实高度**：fix10 的图标尺寸曾硬上限 18 physical px，125%/150%/200% DPI 下会显得又小又糊；fix11 按实际 slot 高度约 68% 缩放，笔画宽度同步缩放。
- **保留单 EXE**：SVG 仍作为来源文件放在 `assets/icons/`，运行时不依赖外部 SVG；Direct2D 创建失败时仍有 GDI fallback。
- **大纲首个滚轮动作立即反馈**：高精度鼠标/触控板常先发送 ±30/±60，而 fix10 必须累计到 ±120 才滚动，导致第一次像卡住、第二次突然跳。fix11 识别新滚轮 gesture，首个 partial delta 立即滚 1 行，随后继续按真实 delta 累积；切换文档/重建大纲会清空残余 delta。

## v0.4.1-rc1-p4-html2-fix10 — Icon Status / Reusable Notice

- **左侧大纲**：折叠时显示 IconPark `mindmap-list`，点击展开；展开后显示 IconPark `left`，点击折叠。状态栏不再显示“大纲”文字。
- **右侧编辑控制**：Browse 只显示 Tabler `edit` 与 Phosphor `code` 两个图标；InlineEdit / SourceEdit 显示紧凑的 **`退出 + 当前模式图标`**。三态共用约 72 logical px 固定槽，字数区不随模式切换移动。
- **悬浮提示**：四种状态动作统一使用原生 tooltip，包含“展开/折叠大纲”“进入/退出就地编辑”“进入/退出源码编辑”；图标 hit target 保持 30px+，视觉分隔线紧贴控制槽。
- **图标来源固化**：`assets/icons/edit.svg`、`code.svg`、`mindmap-list.svg`、`left.svg` 保留用户指定的原始图库资源；状态栏以等价 native vector 绘制，单 EXE 运行不依赖外部 SVG 文件。
- **Reusable Notice**：新增 `ShowNotice(NoticeKind, text)` / `ClearNotice()` / `DrawNoticeOverlay()`。提示条位于标题栏下方的正文顶部居中，不改变文档布局，支持 Info / Success / Warning / Error 四种低饱和主题，自动消失，后续其他提示可直接复用。
- **链接失败反馈**：类似 `[Byte order of cryptographic fields](../../runtime/README.md#byte-order-of-cryptographic-fields)` 的相对链接若目标文件不存在，不再只有系统提示音，而是显示 `链接目标不存在：../../runtime/README.md`；缺失内部锚点、ShellExecute 失败也走同一提示组件。正常存在的链接打开逻辑保持不变。

## v0.4.1-rc1-p4-html2-fix9 — Ultra-Compact Edit Status

- 不改 fix8 已稳定的 resize / Viewport Envelope 机制，只收紧底部编辑控制。
- Browse 显示为 **`编辑: |就地|源码`**：`编辑:` 为非点击标签，两条竖线是真实分隔线，“就地”“源码”各自保持独立点击区。
- InlineEdit / SourceEdit 在同一个窄槽内分别显示 **`退出就地编辑`** / **`退出源码编辑`**，整槽居中。
- 模式槽从约 196 logical px 缩到约 **124 logical px**，三种状态宽度完全一致，因此字数区仍不会因切换模式而抖动。
- 状态字号仍为 9pt，宽度随 DPI 缩放；不使用大按钮、不增加高度。

## v0.4.1-rc1-p4-html2-fix8 — Viewport Envelope / Compact Edit Status

- 保留 fix7 的单一 source anchor，不改已经稳定的基本 resize 逻辑；新增一个**有上限的可见区域 Layout Envelope**。窗口改变宽度后，先按真实新宽度重排原先可见的源块，再恢复 anchor，避免首帧 Paint 又测出更精确高度导致第二次跳动。
- live 边框拖动只预热当前 viewport，最多 48 个 Block；最大化/恢复属于一次性 geometry change，可把预算提高到当前显示器 work-area 高度，最多 96 个 Block。不会枚举/缓存所有可能宽度。
- 浏览态状态栏由“就地编辑 / 源码编辑”简化为 **“编辑：就地  源码”**：`编辑：` 是说明文字，只有“就地”“源码”可点击；进入编辑态后仍用整个固定槽居中显示“退出就地编辑 / 退出源码编辑”。
- 状态栏模式区总宽度仍固定，切换 Browse/Inline/Source 时“字数”区域不移动。
- fix7 的大纲密度、原生滚动条、顶部 reading anchor、Heading inline-code 同字号全部保留。

## v0.4.1-rc1-p4-html2-fix7 — Outline Density / Native Scroll / Resize Reflow

- 大纲先完成真实宽度布局再测量 owner-draw 行高，并增加 0-width fallback；单行标题恢复紧凑高度，换行标题只按实际文本增高。
- 正文改回主窗口原生 `WS_VSCROLL`，与左侧大纲的原生滚动条保持同一 Windows 视觉语言，不再显示独立 scrollbar control 的宽箭头样式。
- 编辑态状态栏仍保留固定总宽度，但“退出就地编辑 / 退出源码编辑”横跨整个模式区居中显示；浏览态仍是两个等宽入口，字数区位置不变。
- live resize 在恢复 reading anchor 之前先提交新宽度 DirectWrite 布局；无可见 caret 时锚定顶部阅读行，避免横向拉伸时整屏上下跳动。
- `### 7.2 `pcie info`` 这类标题中，inline code 与同一 Hn 使用完全相同字号，只改变等宽字体、颜色与背景。
- 保留真实 `Shazao.StatusBar` child HWND、ContentRect 硬裁剪、链接点击与 Unified Source Mode 三态架构。

## v0.4.1-rc1-p4-html2-fix6 — Native Status Surface / Resize Polish

- 底部状态栏改为真正的 `Shazao.StatusBar` child HWND；Browse/Source Direct2D 绘制被 ContentRect 硬裁剪，正文/源码不再覆盖状态栏。
- 打开首个文档后立即执行 document-child layout，修复启动页“最近打开”残影占据左侧大纲区域的问题。
- live resize 不再每个 `WM_SIZE` 重算 owner-draw 大纲 item 高度，也不在拖动过程中强制重绘整个大纲，降低闪烁。
- fix6 曾使用独立正文 scrollbar control 与 88% heading inline-code 下限；这两项已在 fix7 分别被原生 `WS_VSCROLL` 和标题同字号方案取代。

## v0.4.1-rc1-p4-html2-fix5 — Status Actions / Reading Anchor / Link Navigation

- 状态栏模式操作区固定总宽度：浏览时等分“就地编辑 / 源码编辑”，切换模式时字数区域不左右波动。
- fix5 曾使用 DocumentView 客户区子滚动条并以视口约 35% 高度作为无 caret 的 reading anchor；fix7 已分别改为主窗口原生滚动条和顶部阅读行锚点。
- 蓝色/琥珀色编辑边框只包正文 ContentRect，不包含状态栏。
- 浏览模式：Markdown link、HTML `<a href>` 与裸 http/https URL 支持普通单击打开；就地编辑 / 源码编辑使用 Ctrl+单击打开链接。
- `#heading` 在 Shazao 内跳转；相对 Markdown 文件优先由 Shazao 打开，其它本地文件交给系统默认应用。

## v0.4.1-rc1-p4-html2-fix2 — 550 Emphasis Tune

- 正文保持 SemiLight(350)。
- H1~H6、Markdown `**strong**`、HTML `<strong>/<b>` 与 Table header 统一使用 numeric DirectWrite weight 550。
- 标题字号层级、正文行高、有序列表绿色 marker 均保持不变。

## v0.4.1-rc1-p4-html2-fix1 — Real-world Table Compatibility

- GFM pipe table 行允许前导空格；缩进不再生成幽灵第一列。Renderer 与 Cell source-span/caret mapper 使用同一 grammar。
- `**strong**` / `<strong>` / Table header 在该阶段恢复明确强调层级；正文仍保持 SemiLight(350)，正文行高与绿色有序列表编号不变。
- 列宽继续尊重 Shazao separator-dash hint，但增加 longest-token preferred minimum；有空间时避免 `Manufacturer` 这类普通英文单词被拆成两行。
- 完整 `测试-Shazao-sample1.md` 固化为 `tests/fixtures/Caliptra-ROM-full-sample.md`，与根目录 `Shazao-sample.md` 同时作为发布前 regression corpus。

## v0.4.1-rc1-p4-html2 — GitHub-like Reading Weight + Classic Links

- 正文 **行高保持不变**，有序列表数字的绿色样式保持不变。
- Browse 正文 DirectWrite weight 从 Normal(400) 调整为 SemiLight(350)，减少 Microsoft YaHei UI 在英文技术文档中的黑重感。
- H1~H6、`**strong**`、HTML `<b>/<strong>` 与 Table header 统一收敛到 Medium(500)，保留层级但避免过度发黑。
- Markdown link 与 HTML `<a>` 在 Browse/Table Cell 中统一为经典 `#0969DA + underline`；暗色主题为 `#4493F8 + underline`。
- 字号、正文 line spacing、段落节奏、列表编号颜色均不改变，因此不引入额外 reflow。

## v0.4.1-rc1-p4-html1 — Safe Inline HTML

- 阅读面统一解析 `<br>` / `<br/>` / `<br />` / 大小写与带属性变体；普通正文与 Table Cell 都生成真实视觉换行，源码不被改写。
- 支持安全的 presentation-only inline HTML 子集：`<b>/<strong>`、`<i>/<em>`、`<u>`、`<s>/<strike>/<del>`、`<code>/<kbd>/<tt>`、`<a>`、`<span>`；未知标签保持字面量，不执行 script/style。
- paired HTML 内继续递归解析 Markdown/HTML，例如 `<strong>Bold <em>nested</em></strong>` 与 `**bold<br>next**`。
- 支持常用 HTML entity：`&amp;`、`&lt;`、`&gt;`、`&quot;`、`&apos;`、`&nbsp;`、短横线/省略号/版权类 entity，以及十进制/十六进制 numeric character reference。
- inline HTML comment `<!-- ... -->` 在阅读面隐藏；Source 模式仍完整显示源码。
- Table visual/source caret mapper 与 Renderer 使用同一 HTML 语法，隐藏标签、entity 与 `<br>` 不得破坏 Ctrl+/ round-trip。
- 新增 `tests/fixtures/inline-html-regression.md` 与 TC-505～TC-511。

## v0.4.1-rc1-p4-table1-fix1 — Rich Table Underscore Fix

- 修复 `FUSE_UDS_SEED` / `CPTRA_I_TRNG_ENTROPY_CONFIG_0` 这类标识符中的 `_` 被错误当作 emphasis marker；合法 `_italic_` / `__bold__` 仍保留。
- 修复段落后无空行直接跟 GFM table 时，Paragraph collector 吞掉整张表的问题。
- Table Cell 支持 `**bold**`、`*italic*`、`***bold italic***`、`~~strike~~`、inline code 与 link label 的 WYSIWYG 渲染。
- `<br>` / `<br/>` / `<br />` 在 Cell 中转换为真实视觉换行并参与 row-height 测量。
- inline code 在 Cell 内使用等宽字体、代码色和淡背景。
- 格式化 Cell 进入就地编辑时保留 Markdown marker，保存不会破坏原格式；Browse caret 继续映射到 portable source。
- 新增 Caliptra ROM 复杂表格回归 fixture 与 TC-496～TC-501。

### p4 Source Markdown-aware editing / styling 基线

- SourceEdit 的 Enter 开始理解 Markdown 行结构：无序列表自动续 bullet，有序列表自动递增，Task 新项自动回到 `[ ]`，Quote 保留层级；空 list/task/quote 再按 Enter 会退出结构。
- fenced code 内 Enter 保持纯源码语义；普通缩进行（包括四空格代码）保留 indentation，不套用 WYSIWYG block split。
- `Ctrl+Left/Right` 使用真正的 whitespace / word / punctuation token 边界，不再退化为单字符移动；支持 Shift 扩选。
- 多行 selection 的 Tab / Shift+Tab 支持整行缩进/反缩进；无 selection 的 Shift+Tab 反缩进当前源码行。
- Source DirectWrite layout 增加 geometry-neutral Markdown styling：heading/list/task/quote/table/fence/强调 marker 低对比显示，link destination / autolink 使用链接色，inline/fenced code 使用 code 色；不改变字号、行高或 source offset。
- 超过 2 MiB 的 source 自动跳过可选 syntax-decoration 扫描，避免额外 O(n) presentation 成本；编辑功能不降级。
- caret / selection 单纯移动时 Renderer 不再复制整份 Source buffer，只有 source mutation 才更新缓存文本。
- `SetSourceMode()` 现在只切 representation，不再清空 WYSIWYG block/table/height cache；Browse / Source 缓存彻底隔离。
- Source 键盘导航使用 `sourceEditLayoutWidth_`，不再读取 WYSIWYG `lastContentWidth_`。

## v0.4.1-rc1-p3-fix3 — Indicator split + geometry-stable Ctrl+/

- 就地编辑右下角使用 IconPark `repair`，源码编辑使用 Tabler `code`。
- 状态图标热区直接贴编辑边框内侧，不再保留额外 4 DIP margin。
- SourceEdit paint 与 caret/hit-test 共用 `ComputeContentGeometry()`，不再使用另一套宽度。
- SourceEdit 不再写 `lastContentWidth_`，因此 Ctrl+/ 不会反复清空 WYSIWYG block height/layout cache。
- 未编辑、未移动、未主动滚动的 Ctrl+/ round trip 跳过二次 anchor 对齐，直接恢复冻结的 per-mode scrollY。

## v0.4.1-rc1-p3-fix2 — Edit-mode polish

- 编辑边框改为紧贴 DocumentView 内边缘；可在设置中关闭，线宽支持 1~3 px，默认 2 px。
- 右下角使用 IconPark `file-editing-one` 作为极轻编辑状态图标；可关闭，点击直接返回浏览。
- Browse ↔ Source 在未修改、未移动 caret/scroll 时保存两套绝对 scrollY，反复 Ctrl+/ 不再累计漂移。
- 源码编辑保持等宽字体，但字号/行高默认跟随正文，减少切换时 reflow。
- 就地编辑、源码编辑高亮 caret 所在视觉行；浏览模式也可显示/关闭同一行背景。
- 浏览 caret 在模式映射恢复后同步回 Renderer 的 collapsed selection，保证行背景与真实 caret 一致。

## v0.4.1-rc1-p3-fix1 — Exact Source Mapping / Viewport Anchor

这一阶段把 Browse / InlineEdit / SourceEdit 的定位统一到 normalized-LF source offset：

- WYSIWYG 隐藏 `#`、`**`、link URL 等 marker 时，仍保留精确 source caret；再次 `Ctrl+/` 回源码不会丢 marker 内位置。
- Table Cell 具备真实 pipe-source 映射，`\|` 与 `<br>` 按显示字符/源码字符分别换算；merged Cell 按 row-major source piece 映射。
- caret 离开屏幕后切换模式，不再把视口拉回旧 caret；改用当前 viewport 中的 source anchor 做一次绝对 Y 校正。
- SourceEdit 正文滚动重新驱动 PDF-style 大纲跟随，但命中的是 Source layout 的真实 source position，不再复用 WYSIWYG block height。
- SourceEdit 的 PageUp/PageDown 与 caret 自动滚动也会立即驱动大纲跟随，不需要等待下一次鼠标滚轮。
- 浏览模式可见 caret 只是 source caret 的 WYSIWYG proxy；隐藏语法不会改变内部真实位置。

## v0.4.1-rc1-p2-fix1 — Mode Switch / Browse Caret Polish

- 移除正文右下角不透明“就地编辑 · F2 / 源码编辑 · Ctrl+/”胶囊，避免遮挡文字；标题栏继续明确显示当前模式。
- 就地编辑 / 源码编辑只保留正文区域 1px 轻量内边框：亮色主题使用更浅的蓝/琥珀色，深色主题使用低亮度对应色。
- `Ctrl+/` 模式切换改为统一 **logical source offset + caret client Y** 锚点，只做一次绝对 scroll 校正；Renderer 不再额外套用旧 block-height anchor，消除连续切换逐次向上漂移。
- SourceEditor 进入时先把 CRLF/CR 统一成逻辑 LF 字符空间；保存时 `Document::ReplaceRange` 仍恢复原文件换行风格，避免 CRLF 文件 caret 每行多偏 1 字符。
- 浏览模式现在保留真实 Win32 caret 作为“位置标记”：单击正文即可定位，从源码/就地编辑返回后仍显示；Browse 仍拒绝字符输入，产生 selection 时 caret 隐藏。
- Source → Browse 时按同一 logical source offset 反向恢复到 WYSIWYG block/source position；Table 的精确 pipe/cell source mapping 仍留给 rc1-p3，当前安全落到表格 span 起点/首 Cell。

## v0.4.1-rc1-p2 — Full Source Editing

- 新 SourceEdit 不再按 parsed Markdown Block 维持临时编辑器，而是持有一份**全文逻辑 LF Source buffer**；Markdown 结构在输入过程中即使被新增/删除/暂时写坏，caret/selection 仍然连续有效。
- Renderer 在 SourceEdit 时直接消费同一份 transient Source buffer，并用一个 DocumentView / DirectWrite layout 完成绘制、HitTest、Selection、真实 Win32 caret 与 IME 候选窗定位；不创建 RichEdit/子 HWND。
- 支持普通输入、Enter、Tab、Backspace/Delete、方向键、Up/Down、Home/End、Ctrl+Home/End、PageUp/PageDown、鼠标点击与跨行拖选。
- 支持 `Ctrl+A/C/X/V`、右键 Cut/Copy/Paste/Delete，以及 Source-local `Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y`。
- 中文 IME 的 `GCS_COMPSTR` 作为 transient preedit 进入同一份 Source DirectWrite layout；有选择时视觉上替换选择，候选窗跟随组合串末端，`GCS_RESULTSTR` 只形成一次 undo transaction。
- SourceEdit 输入期间**不按键写磁盘**。`Ctrl+S` 或离开 SourceEdit 时才通过 `Document::ReplaceRange(PayloadStart, Size, ...)` 原子写回；保存失败保留全文 buffer、selection、caret 和 dirty 状态。
- `F2` / `Ctrl+/` / F4 / 打开新文件 / 关闭窗口都统一经过 Source 保存门，避免模式切换丢未保存源码。
- 右键“复制 Markdown 源码 / 复制为无格式文本”直接使用当前 SourceEditor selection；源码复制保持原字符，纯文本继续走 Markdown 去标记/表格 TSV 转换。
- 修复 VS 2026 / MSVC 19.51 编译错误：Outline minimal-reveal 的 `RECT::top/bottom` (`LONG`) 在进入 `std::max<int>` 前显式转换为 `int`，消除 C2672/C2737。
- p2 仍不承担 WYSIWYG caret ↔ sourceOffset 的最终精确映射；这部分按计划放在 rc1-p3。

## v0.4.1-rc1-p1 — Unified Source Mode / 三态框架

这一阶段先建立新的 **浏览 / 就地编辑 / 源码编辑** 三态架构，不再继续美化旧的全文 RichEdit 源码编辑器。三个模式都停留在同一个 `DocumentView` / 同一个滚动坐标中；旧 RichEdit 代码暂时保留作回滚，但 F2、Ctrl+/ 和右键模式菜单都不再进入它。

- **浏览**：默认 WYSIWYG 阅读状态。
- **就地编辑**：`F2` 进入/退出；继续使用现有 DirectWrite + `ViewEditor` 原地编辑。
- **源码编辑**：`Ctrl+/` 进入/退出；仍由同一 `DocumentView` 绘制，显示原始 Markdown marker、表格 pipe、图片语法、链接 URL、任务 marker、代码 fence 与 Block 之间真实空行。
- 从源码编辑按 `F2` 可直接进入就地编辑；从就地编辑按 `Ctrl+/` 可直接进入源码编辑，不要求先回浏览。
- 右键菜单只显示“要去的模式”：浏览时显示“就地编辑 / 源码编辑”，就地编辑时显示“源码编辑 / 浏览”，源码编辑时显示“就地编辑 / 浏览”；“立即编辑”正式更名为“就地编辑”。
- Source View 使用设置中的代码/等宽字体，阅读列宽、主题、滚动条和大纲仍属于原 DocumentView，不打开第二个编辑窗口。
- p1 曾使用正文内边框 + 模式胶囊；`p2-fix1` 已移除会遮挡正文的胶囊，只保留轻量 1px 内边框，当前模式由标题栏显示。
- p1 最初使用 block `ViewportAnchor`；`p2-fix1` 已升级为 logical source caret + client-Y 单次绝对校正。复杂 Table/隐藏 marker 的最终精确双向映射仍放在 rc1-p3 完成。
- 复制菜单新增 **复制 Markdown 源码** 与 **复制为无格式文本**。源码模式 `Ctrl+C` 默认复制所见 Markdown；无格式复制会去除常见 Markdown marker，表格转换为 TSV。

> **p1 历史边界：**p1 只建立 Source View 与三态框架；上述 source mutation 已在 rc1-p2 接入同一 DirectWrite surface。

## rc9-p3c PDF-style Outline Sync

- 正文滚动采用双阈值迟滞：向下滚使用约 92 DIP 的 forward activation line，向上滚使用约 118 DIP 的 backward activation line，临界位置的小幅滚轮/触控板抖动不会让相邻标题反复切换。
- 取消 p3b 的“滚到底部就强制最后可见标题”补偿；文末继续遵守同一 current-section 判定规则，多个标题同屏时不会因为 `ClampScroll()` 自动跳到最后标题。
- 大纲自身滚轮/滚动条进入 manual browsing：只浏览目录，不改变正文、不改变 current heading，也不会被普通 repaint/reflow 立刻拉回；正文下一次真实滚动后才恢复自动跟随。
- `outlineCurrentIndex_` 与 `outlineFocusedIndex_` 分离：正文 current section 负责高亮，ListBox 的点击/键盘焦点负责导航输入，避免一个 `selectedIndex` 同时承担两种语义。
- 自动跟随使用 minimal reveal，而不是每次居中：当前项已在安全区时大纲完全不滚；仅接近上下边缘时保留约 2 行余量做最小位移。
- 点击大纲仍是显式导航：正文标题落到顶部，同时立即把该标题设为 current，并重置 manual browsing。
- `WM_PAINT` 继续严格不参与大纲导航。
- `build.bat` 保持用户确认版本原样不动。

## rc9-p3b Outline Follow Stability

- 大纲 ListBox 不再直接使用 Windows “每次滚轮滚动多行”的系统默认：保留高分辨率 wheel delta 累计，每完整 `WHEEL_DELTA` 只移动 1 个大纲项，避免一次滚轮跨越数个标题。
- 正文滚动时，大纲当前标题不再绑定 `TopVisibleBlock()`；改为使用视口上方约 20%（并限制在 72~136 DIP）的阅读锚点。下一个标题进入屏幕上方阅读区后即可成为当前标题，不必等前一 section 的最后几个像素完全离屏。
- 文档到达最底部时，滚动位置会被 `ClampScroll()` 限制，最后几个标题无法顶到阅读锚点。p3b 在“确实位于 bottom”时改选当前视口中最后一个可见标题，确保最后标题可稳定高亮。
- `WM_PAINT` 不再参与大纲跟随：图片/表格布局细化、窗口露出、普通重绘都不能自行改变 outline selection；只有正文真正滚动/导航才更新 active heading，消除尾部多标题同屏时的自动跳动。
- `build.bat` 保持用户确认版本原样不动。

## rc9-p3a Caret + Table Range Selection

- 修复普通空段落连续 Enter：每次 Enter 创建下一段后，编辑 caret 随新段落向下推进，不再反复停留在第一个 `[]()` 占位段落。
- Table Cell 鼠标拖选一旦跨过 Cell 边界，自动升级为矩形 Cell Range；同一 Cell 内仍保持字符级 DirectWrite Selection。
- `Shift+Space` 选整行，`Ctrl+Space` 选整列，`Ctrl+Shift+Space` 选整表；整行后可用 `Shift+Up/Down` 连续扩展多行，整列后可用 `Shift+Left/Right` 连续扩展多列；Range Selection 与 Cell 文字 Selection 使用独立坐标状态。
- Table Range `Ctrl+C` 输出 TSV（列用 Tab、行用 CRLF），可直接粘贴到 Excel/表格工具。
- merged Cell 在 Range 绘制时按 span rectangle 命中，TSV 中 covered Cell 保持空位，避免重复 anchor 文本。
- p3a 的 Range Selection 先保持非破坏性；Cut/Delete/Paste/直接输入不会半破坏 merged span，后续结构编辑事务再消费行列 Selection。
- 修复 MSVC C4457：`GetOrCreateTableLayout(..., const Block& b, ...)` 内部 IME selection 局部变量从 `b` 改为 `selectionEnd`。
- `build.bat` 保持用户确认版本原样不动。

## rc9-p2d Cell IME + Local Undo/Redo

- 普通 Table Cell 正式接入现有 `WM_IME_* + ViewEditor` 组合输入链，不创建 RichEdit/IME 子窗口。
- `GCS_COMPSTR` 作为 transient preedit 直接进入当前 Cell 的同一份 DirectWrite layout；组合串变化会实时参与换行和 rowHeight 测量。
- IME 组合串在 Cell 内以短下划线标记；候选窗和系统 composition window 跟随组合串末端真实 caret。
- 当前有选择时，preedit 视觉上临时替换选择；只有 `GCS_RESULTSTR` 才调用 `CommitComposition()` 修改 Cell buffer。
- 一次中文上屏作为一次 ViewEditor undo transaction；`Ctrl+Z` / `Ctrl+Shift+Z` / `Ctrl+Y` 在当前 Cell 内 Undo/Redo，不穿透到 document history。
- merged Cell 继续 source-read-only：IME 会被取消，Cell-local Undo/Redo 不允许对 merged span 产生修改。
- `build.bat` 保持用户确认版本原样不动。

## rc9-p2c Cell Clipboard + Soft Break + Navigation

- Cell 内 `Ctrl+C` 复制当前选择；普通 Cell 支持 `Ctrl+X` 剪切与 `Ctrl+V` 粘贴，仍复用同一个 `ViewEditor` transient buffer。
- 多行剪贴板文本直接进入 Cell 的逻辑 LF 字符空间；保存时统一序列化为 `<br>`，不会向 pipe-table row 写入物理换行。
- `Shift+Enter` 在当前普通 Cell 内插入 soft break；显示仍是 DirectWrite 真实多行，source 保存为 `<br>`。
- `Tab / Shift+Tab` 按视觉可见 Cell 顺序前进/后退；merged Cell 只作为一个 span anchor 参与导航。
- `Enter` 移到同列下一视觉行 Cell；优先选择覆盖当前列的目标 Cell，跨 rowspan 时从 span 后一行继续。
- 导航前先提交当前 Cell；若文字改变导致 rowHeight/列布局重算，目标 Cell 必须从 reload 后的新 `TableLayoutEntry` 重新获取。
- merged Cell 允许 Copy 和导航，但 Cut/Paste/Shift+Enter 继续只读，避免覆盖被 span 隐藏的原始 Cell。
- Table IME 与 Cell-local Undo/Redo 已在 p2d 接入。
- `build.bat` 保持用户确认版本原样不动。

## rc9-p2b Cell Selection + Keyboard Editing

- Table Cell 正式接入同一个 HWND-free `ViewEditor`：不创建 RichEdit，不引入第二套表格编辑器。
- 单击定位、鼠标拖选、Shift+单击、Shift+方向键、Ctrl+A 都在 Cell 自己的 DirectWrite 字符空间完成。
- Left/Right 按 DirectWrite cluster 移动；Up/Down、Home/End 按实际换行后的视觉行移动。
- 普通字符输入、Backspace、Delete 直接修改 transient Cell text，并立即使用原 `TableLayoutEntry` 重新测量换行与 rowHeight。
- 保存时只替换当前普通 Cell 的 Markdown source span；可见换行序列化为 `<br>`，文字中的 `|` 自动转义。
- merged Cell 继续支持 caret/selection，但 p2b 对其 source mutation 保持只读，避免误删被 span 覆盖的原始 Cell 数据。
- 仅 caret/selection 改变时不使 TableLayout cache 失效；只有文字改变/切换 Cell 才重新测量。
- Clipboard、`Shift+Enter -> <br>`、IME、Cell-local Undo/Redo 仍分别留给 p2c/p2d，不在 p2b 偷跑。
- `build.bat` 保持用户确认版本原样不动。

## rc9-p2a Cell 激活 + Caret

- Edit 模式单击 Table Cell 直接激活该 Cell。
- 鼠标命中位置由 rc9-p1 的 DirectWrite `TableLayoutEntry` 直接转换成真实 Win32 caret。
- wrapped text、左/中/右对齐、空 Cell、merged Cell 都复用同一份几何。
- 滚轮、滚动条、窗口 resize、Ctrl+滚轮字体缩放和 Alt+滚轮内容宽度变化后 caret 重新定位。
- 本阶段刻意不接受文字输入、不做 Selection/Clipboard/IME，避免提前混入 p2b/p2c/p2d。
- `build.bat` 保持用户确认版本原样不动。


- 表格正式建立单一 `TableLayoutEntry`：Measure / Draw / HitTest / CellView 共用一份列宽、行高和 CellRect，不再各算一套。
- GFM separator 对齐完整解析：`:---` 左对齐、`---:` 右对齐、`:---:` 居中，并允许各列混合。
- separator 中 `-` 数量作为 Shazao 的可移植列宽 hint；不同 dash 数量按比例分配列宽，其他 Markdown 工具仍按普通表格识别。
- 没有显式宽度差异时，根据 Cell 内容做自动列宽；始终限制在阅读区宽度内，窄窗口自动换行并重新计算 rowHeight。
- `<br>` / `<br/>` / `<br />` 在 TableLayout 中显示为 Cell 内 soft break，为 rc9-p2 `Shift+Enter` 保存为 `<br>` 预留。
- 新增绿色主题 Cell hover；点击/hover/绘制严格使用同一个 CellRect，窗口 resize 后统一重建。
- `<!-- shazao-table ... -->` HTML Comment 元数据作为合并单元格兼容层：标准 Markdown 内容不删除，其他工具可继续识别原表格。
- `merge: R1C2:R1C3` 支持横向/纵向/矩形 span；被覆盖 Cell 数据仍保留，拆分时未来只需取消 span。
- 可选 `signature:` 会校验表格结构；签名失配或 span 越界/重叠时，安全回退为未合并普通表格，不猜测旧坐标。
- 本阶段只完成表格底座和命中；Cell caret/IME/Shift+Enter 编辑将在 rc9-p2 接入。

## rc8-final 收口

- p1 列表视觉、p2 列表选择、p3 跨 Block Selection 合并为一个 rc8 包。
- Paragraph / Heading / Quote / ListItem 支持跨块复制、剪切、删除、直接输入和粘贴替换。
- 跨块中文 IME 结果一次替换整个 DocumentSelection，局部 caret 不会在组合期间重新出现。
- CodeFence / Table / Image 跨结构破坏性编辑继续安全拒绝，避免破坏 Markdown wrapper。
- `Shazao-Complex-TestCases.md` 继续永久累计，不删除旧问题的回归用例。

## rc8-p3 新增

- Paragraph / Heading / Quote / ListItem 跨 Block 鼠标拖选。
- 跨块 Ctrl+C 复制 Markdown 结构；Ctrl+X / Delete / Backspace 原子删除。
- 跨块选区直接输入或 Ctrl+V 替换。
- 鼠标拖出正文上下边缘时自动滚动并继续 selection。
- CodeFence / Table / Image 的跨结构破坏性删除仍安全拒绝，避免损坏 Markdown wrapper。

## v0.4.0-rc8 目标

- 修正 rc8-p1 中无序 marker 与 task checkbox 视觉偏上的问题：统一依据第一视觉行 baseline，并向下做轻微 optical correction。
- 一级/二级/三级无序 marker 继续保持绿色实心圆 / 空心圆 / 小方块；二级空心圆不再额外上移。
- 列表内鼠标拖选可连续跨越多个 ListItem，首尾 block 的高亮实时跟手。
- Edit 模式跨 ListItem 选择时隐藏局部 Win32 caret，避免“选区 + caret”争夺视觉焦点。
- Ctrl+C 对跨 ListItem 选区复制 Markdown：保留后续项目的 `-` / `1.` / `[ ]` / `[x]` 等结构 marker。
- Ctrl+X、Backspace、Delete 对跨 ListItem 选区执行一次结构删除并立即重绘；有序列表随后重新编号。
- 单个 ListItem 内选择仍使用 ViewEditor，不改变原有局部编辑路径。

## v0.4.0-rc7 目标

rc7 把 Ordered List 正式接入与 Paragraph / Heading / Quote / Unordered List / Task List / CodeFence 相同的 DirectWrite + ViewEditor 单表面编辑核心。

- `0.` 也是真正的 ordered list，不再依赖 `orderedNumber == 0` 判断类型。
- 保留 `1.` / `1)` 原始 marker 风格。
- 行首/行中/行尾 caret、视觉行导航、IME、复制粘贴、Undo/Redo 全部复用现有 ListItem 编辑器。
- Enter 在行首/行中/行尾拆项并生成正确下一编号；后续同级 sibling 自动重编号。
- Backspace/Delete 删除或合并项目后即时重编号和重绘。
- Tab / Shift+Tab 在层级变化后同时整理移入和移出 run 的编号。
- 多行粘贴生成连续 ordered siblings。
- ordered marker gutter 按数字位数动态增长，覆盖 9→10、99→100。
- mixed ordered/unordered nesting 各层独立编号。

## rc6 及以前已完成（保留回归）

这一版继续坚持 V2 的核心约束：

> **同一个可见字符的 DRAW / MEASURE / HIT TEST / CARET / SELECTION 必须来自同一个 DirectWrite layout。**

WYSIWYG Markdown 主界面不创建 Paragraph RichEdit、Heading RichEdit、Table Cell RichEdit。浏览和编辑仍在同一个 DirectWrite / Direct2D 文档表面完成。

rc6 不扩展新的 Markdown 类型，专门收口删除和任务框交互：checkbox 切换不再重开文档；Backspace/Delete 跨 Block 改为单次原子结构编辑；空任务/无序列表继续 Backspace 会删除该行并进入上一可编辑行；所有删除路径当帧重绘。Ordered List、Table、Image 继续保持独立阶段。

### rc6 新增

- 已完整索引文档中的 checkbox 使用原位 1-byte `[ ] <-> [x]` 更新，同时同步内存快照和 taskState，**不重建 Document/Renderer**，从根因上消除勾选后上下跳一两行。
- ReloadCurrentFile 增加 `ViewportAnchor(blockIndex + intraBlockOffset)`，结构编辑导致重新解析时尽量保持同一屏幕锚点。
- Backspace/Delete 跨 Block 合并由“两次提交/两次 reload”改成**一次 ReplaceRange**，并保留当前/上一 Block 的结构语义。
- 顶层空 task / unordered-list item 继续 Backspace 会删除整行并把 caret 放到上一可编辑行尾。
- Backspace、Delete、Cut、Delete-selection 都使用立即重绘，删除后无需滚动或点击其它地方才更新。

### rc5 已完成并保留

- Task List 文本进入 V2 编辑：caret、选择、IME、Undo/Redo、Enter、Tab/Shift+Tab、Backspace/Delete、多行粘贴全部复用无序列表结构命令。
- 点击 checkbox 精确保留 `scrollY`，重新解析后恢复同一像素位置；不再只按“顶部 Block”恢复，避免跳动一两行。
- checkbox toggle 加入 document snapshot Undo/Redo。
- task Enter 新建项始终为 `[ ]`；已完成任务不会把 `[x]` 状态复制给新任务。
- 空 task 再按 Enter 退出列表成为正文；顶层 task 行首 Backspace 同样可退成正文。
- 无序列表 marker 与文字间距收紧；一级实心圆、二级空心圆、三级及以后方块，并采用更明确的嵌套缩进。

- 修复首页 `Shazao` 标题长度硬编码为 4 导致每次启动只显示 `Shaz` 的首帧问题。
- 移除 `Renderer::DrawSelection` 未使用的 `colors` 参数，消除 MSVC `C4100` warning。
- fenced code block 进入 V2 单表面编辑：鼠标定位、选择、IME、Undo/Redo、Enter 换行、Tab 四空格、多行粘贴都在同一个 DirectWrite/ViewEditor 字符空间中完成。
- 代码 fence / language label 永远位于可编辑内容范围之外；行首 Backspace 与行尾 Delete 不允许误合并到相邻 Markdown Block。
- 代码行号改成一个与代码布局共享视觉行节奏的 DirectWrite gutter layout：逻辑行首显示编号，软换行 continuation 留空，空行仍保持准确基线。
- rc3 已完成的单一 caret、Quote、无序列表、左右折叠菜单安全通道全部保留并继续作为永久回归。

## rc6 已支持的 V2 编辑能力

### 光标

- `← / →`：按 DirectWrite cluster 移动。
- `↑ / ↓`：按 **真实视觉行** 移动，不按 Markdown 源码物理行移动。
- 到 Paragraph / Heading 顶部或底部后，可进入紧邻的可编辑 Paragraph / Heading，并尽量保持原横向 X 位置。
- `Home / End`：当前视觉行首 / 行尾。
- `Ctrl+Home / Ctrl+End`：文档首个 / 末个可编辑 Paragraph / Heading。
- `Ctrl+← / Ctrl+→`：按词移动。
- caret 离开可视区域时由主文档滚动保持可见，不创建子编辑窗口。

### Enter

正文：

```text
AB|CDE
```

按 Enter 后成为两个 Paragraph：

```text
AB

|CDE
```

标题：

```text
## 标|题
```

按 Enter 后：

```text
## 标

|题
```

也就是左半保持原 Hn，右半自动变为普通正文。

标题行尾 Enter 会在标题下创建新的正文输入位置；标题行首 Enter 会在标题前创建正文输入位置，同时保留原标题。

Markdown 本身没有独立“空 Paragraph”语法。由 Enter 等**明确编辑命令**创建的空正文可暂时使用仅编辑期间存在的隐藏 sentinel；而源文件原有的 `EmptyLine` 只是结构性 separator，自 rc6 起绝不因此获得真实 WYSIWYG caret。结构块前后的临时插入点使用 source-neutral VirtualParagraph，直到真实输入才实体化。

### Block 边界删除

- Paragraph / Heading 行首 `Backspace`：和前一个紧邻可编辑 Block 合并，继承前一个 Block 类型。
- Paragraph / Heading 行尾 `Delete`：和后一个紧邻可编辑 Block 合并，保留当前 Block 类型。
- caret 合并后位于两段原内容连接处。

### 选择 / 剪贴板 / Undo

- 当前 Paragraph / Heading 内 Shift+方向键、Home、End 扩展选区。
- `Ctrl+C / X / V`、Backspace、Delete、输入覆盖选区正常。
- 多行纯文本粘贴会把粘贴换行转换为新的正文 Paragraph；在 Heading 中只有第一行留在标题，其余成为正文。
- ViewEditor 保留 Block 内 Undo/Redo。
- Enter、Block 合并以及已经提交到文件的正文修改增加轻量文档级 snapshot Undo/Redo（仅对不超过 8 MiB 的文档保存有限历史，避免大文件内存失控）。
- rc5 **不伪造跨结构块 Shift 选区**：跨 Block Shift 操作安全拒绝；真正的 document-level cross-block selection 留给后续 Selection Model 阶段。

### IME

- 中文 IME composition 仍通过主窗口处理。
- candidate / composition window 跟随 DirectWrite caret。
- composition 期间不切换排版引擎。
