# CREDITS

本仓库（oh-my-claudecode）的概念吸收记录。下列技能在设计与改写时，吸收了 [mattpocock/skills](https://github.com/mattpocock/skills) 中的概念与方法（改写为船坞词汇融入本地技能，非逐字移植）。源仓库许可证：MIT © 2026 Matt Pocock。

每个被吸收技能在此留三行判语：**吸收了什么 / 丢弃了什么 / 为什么**。技能文件尾部的致谢指针指向本文件对应的节。

---

## deep-interview ← grill-with-docs

- 来源技能：`grill-with-docs`（mattpocock/skills）
- 许可：MIT © 2026 Matt Pocock
- 吸收了什么：设计树提问法（沿决策分支逐层下钻）、frontier 协议（同一时刻只开放一个前沿问题）、事实性问题派子代理查证后再回到主线。
- 丢弃了什么：grilling 中逐份精读配套文档的仪式，改为访谈中按需引用仓库文档。
- 为什么：deep-interview 面向产出可执行的 spec，逐份精读拖慢访谈节奏；概念内核（把模糊想法磨成锋利决策）完整保留。

## drydock ← domain-modeling

- 来源技能：`domain-modeling`（mattpocock/skills）
- 许可：MIT © 2026 Matt Pocock
- 吸收了什么：术语表纪律——术语不是记录完就结束，要在设计过程中持续挑战、磨尖；决策落定时内联更新术语表与上下文；ADR 三判据（难逆转 / 缺上下文会令人意外 / 真实权衡）。
- 丢弃了什么：CONTEXT-MAP.md 多限界上下文布局——v1 场景是单仓库单上下文，铺多图是空转。
- 为什么：drydock 的锚是"设计前把地基打牢"，术语表作为活文档与单仓库范围匹配。

## harbor ← triage

- 来源技能：`triage`（mattpocock/skills）
- 许可：MIT © 2026 Matt Pocock
- 吸收了什么：验证先行（先复现/核实再派工）、needs-info 回询模板、AI 生成内容的披露行、复用检查（查重既有实现）。
- 丢弃了什么：triage 的表单式逐字段 intake，harbor 用标签门控（`in-harbor`/`needs-info`/`ready-for-human`/`ready-for-agent`）驱动流转；被拒项沉淀为 `.out-of-scope/` 知识库供未来同类请求翻旧账。
- 为什么：工厂的进货口由 tracker 标签驱动，事件流转比表单更贴合自动链。

## loft ← prototype

- 来源技能：`prototype`（mattpocock/skills）
- 许可：MIT © 2026 Matt Pocock
- 吸收了什么：原型六规则——明确标记为丢弃物、一条命令可跑、无持久化、无打磨、暴露真实状态、裁决后把可留结论存为 primary source（丢弃分支 + 上下文指针）。
- 丢弃了什么：prototype 对前端/UI 工具链的默认假设；loft 是语言级规则，不绑定任何框架。
- 为什么：loft 的职能是"散文定不了的设计问题先做一个丢得掉的东西"，六规则直接回答"怎么保持它丢得掉"。

## architecture-survey ← codebase-design

- 来源技能：`codebase-design`（mattpocock/skills）
- 许可：MIT © 2026 Matt Pocock
- 吸收了什么：深模块词汇全套（deep/shallow module、seam、hypothetical seam——只有一个 adapter 的 seam 是假想缝）、demolition test（源 deletion test 的本地化）、按杠杆排序候选、ADR 冲突纪律（与既有 ADR 矛盾的候选需说明"水变了"才可提名）。
- 丢弃了什么：源技能面向接口设计的操作指导（含 DESIGN-IT-TWICE / DEEPENING 两个扩展文档）；survey 只勘察不动手，设计动作归 drydock 与 loft。
- 为什么：architecture-survey 是 codebase-design 概念的"只读孪生"——把同一套深模块词汇用在巡检而非设计上。
