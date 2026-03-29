# 🚀 如何让新 AI 模型快速接手项目？

为了让新的 AI 模型（如 Claude 3.5, GPT-4o, 或 Cursor Agent）在几秒钟内理解 **Doc-Viewer** 的“过度极简主义”设计灵魂和技术架构，您可以按照以下三种方式进行：

---

### 1. 如果您使用 Cursor / VSCode AI (推荐)
**它是全自动的。**
由于我们已经在 `.cursor/rules/` 目录下创建了 `.mdc` 规则文件，当您在这些工具中提问时：
- AI 会自动关联 `visual-style.mdc` 和 `tech-stack.mdc`。
- 它会自动知道：**禁止使用 Emoji**、必须使用 **Lucide 图标**、必须使用 **Plus Jakarta Sans 字体** 以及 **全宽布局**。

> **触发技巧**：只需输入 `@rules` 或直接提问，AI 就会在后台参考这些规范。

---

### 2. 如果您使用网页版 AI (ChatGPT / Claude.ai)
**“投喂”核心上下文文件。**
只需将以下文件上传或其内容粘贴给 AI：
1. **`docs/AI_CONTEXT.md`**：这是项目的“灵魂指南”。
2. **`src/index.css`**：这让 AI 知道所有的颜色变量和排版细节。

**您可以直接发送这段话给它：**
> “我正在开发 Doc-Viewer 项目。请先阅读项目中的 `docs/AI_CONTEXT.md` 以了解我的‘过度极简主义’设计语言、核心配色（Slate/Blue）和图标规范。所有后续代码必须严格遵守这些风格。”

---

### 3. 如果您使用 Agent 类型的 AI (类似 Antigravity)
**发出明确的“阅读指令”。**
在对话开始时，直接下达预指令：
> “请先深度阅读 `docs/AI_CONTEXT.md` 和 `.cursor/rules/` 下的所有规范。在理解我的设计审美和代码组织方式之前，不要修改任何代码。”

---

### 💡 核心原则总结
- ** icons**: 永远使用 `lucide-react` (stroke=2.5)。
- **Layout**: 永远保持全宽（Full-width），仪表盘已更名为“概览”。
- **Cleanliness**: 移除所有冗余的边框和默认颜色，追求极致的留白与质感。

*本指南已存入项目中的 `docs/AI_ONBOARDING.md`。*
