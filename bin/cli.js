#!/usr/bin/env node

import path from "path"
import fs from "fs"
import chalk from "chalk"
import ora from "ora"
import figlet from "figlet"
import gradient from "gradient-string"
import boxen from "boxen"
import { select, input, checkbox, confirm } from "@inquirer/prompts"

import {
  getDomainKey,
  getRules,
  getCategories,
  getCategoryRules,
} from "../knowledge/index.js"
import { TYPES, PRESETS } from "../lib/presets.js"

// ── Banner ──
function showBanner() {
  const title = figlet.textSync("Cybermen", { font: "Small" })
  const colored = gradient.pastel(title)
  console.log(
    boxen(
      `${colored}\n\n  ${chalk.dim("蒸馏万物，赛博永生")}            v0.2.0`,
      {
        padding: 1,
        borderStyle: "round",
        borderColor: "cyan",
      },
    ),
  )
  console.log()
}

// ── 工具函数 ──
function writeFile(filePath, content) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, content, "utf8")
}

function stepTitle(num, text) {
  console.log(`\n${chalk.cyan.bold(`  ◆ 第${num}步：${text}`)}\n`)
}

function progress(text) {
  console.log(`\n  ${chalk.dim("✦")} ${chalk.italic(text)}`)
}

function divider() {
  console.log(chalk.cyan("\n" + "─".repeat(50)))
}

// ── 知识库选择 ──
async function selectFromRules(rules, hint) {
  if (rules.length === 0) return []

  console.log(`\n  ${hint}\n`)
  const choices = rules.map((rule) => ({
    name: `${rule.title}  ${chalk.dim(rule.desc)}`,
    value: rule,
  }))

  const selected = await checkbox({
    message: "选择适用的（空格选择，回车确认）",
    choices,
    theme: {
      prefix: chalk.cyan("  ?"),
    },
  })

  return selected.map((rule) => ({
    title: rule.title,
    scenario: rule.scenario,
    steps: rule.steps,
  }))
}

// ── 生成器 ──
function generateIdentity(ctx) {
  const typeLabel = TYPES.find((t) => t.key === ctx.typeKey)?.label || "赛博人"
  return `---
name: ${ctx.name}
description: ${ctx.description}
type: ${ctx.typeKey}
---

# ${ctx.name} — ${typeLabel}档案

## 我是谁
${ctx.description}

## 触发词
${ctx.triggers}

## 领域
${ctx.domain}

## 核心能力
${ctx.capabilities}

## 原则
${ctx.principles || "- 按照设定行事\n- 保持人格一致性\n- 尊重边界"}`
}

function generateStyle(ctx) {
  const p = PRESETS[ctx.typeKey]?.step6 || {}
  const labels = (p.questions || []).map((q) => q.text.replace(/[?？]$/, ""))
  return `# ${ctx.name} 的风格

## ${labels[0] || "沟通方式"}
${ctx.communicationStyle || "根据实际情况调整"}

## ${labels[1] || "行事风格"}
${ctx.decisionStyle || "根据实际情况调整"}

## ${labels[2] || "态度"}
${ctx.perfectionism || "适中"}

## 其他特征
${ctx.otherStyle || "无"}`
}

function generateMethod(name, title, content) {
  return `# Skill: ${title}

## 触发场景
${content.scenario || "待补充"}

## 执行步骤
${content.steps || "待补充"}`
}

function generateBoundary(name, title, content) {
  return `# Rule: ${title}

${content}`
}

function generateDecision(name, decision, why, impact) {
  return `## ${decision}

**原因**: ${why}

**影响**: ${impact || "待评估"}`
}

// ── 蒸馏流程 ──
async function distill() {
  divider()
  console.log(chalk.bold("\n  选择你要创造的赛博人类型\n"))

  // 选择人格类型
  const typeKey = await select({
    message: "你想蒸馏什么?",
    choices: TYPES.map((t) => ({
      name: `${t.emoji}  ${t.label} ${chalk.dim("— " + t.desc)}`,
      value: t.key,
    })),
    theme: {
      prefix: chalk.cyan("  ?"),
    },
  })

  const preset = PRESETS[typeKey]

  const ctx = {
    typeKey,
    name: "",
    description: "",
    triggers: "",
    domain: "",
    capabilities: "",
    principles: "",
    methods: [],
    boundaries: [],
    decisions: [],
    communicationStyle: "",
    decisionStyle: "",
    perfectionism: "",
    otherStyle: "",
    importPath: "",
  }

  divider()

  // ── 第一步：名字和身份 ──
  stepTitle("一", preset.step1.title)
  ctx.name = await input({
    message: "名称:",
    theme: { prefix: chalk.cyan("  ?") },
  })
  if (!ctx.name) {
    console.log(chalk.red("\n  名称不能为空，蒸馏取消\n"))
    process.exit(0)
  }
  ctx.description = await input({
    message: preset.step1.descPrompt,
    theme: { prefix: chalk.cyan("  ?") },
  })
  ctx.triggers = await input({
    message: preset.step1.triggerPrompt,
    default: ctx.name,
    theme: { prefix: chalk.cyan("  ?") },
  })

  progress(preset.step1.awaken(ctx.name))

  // ── 第二步 ──
  stepTitle("二", preset.step2.title)
  for (const p of preset.step2.prompts) {
    ctx[p.key] = await input({
      message: p.text,
      theme: { prefix: chalk.cyan("  ?") },
    })
  }

  progress(preset.step2.progress(ctx.name))

  // ── 第三步 ──
  stepTitle("三", preset.step3.title)

  if (preset.step3.useKnowledge) {
    const addMode = await select({
      message: "选择添加方式:",
      choices: [
        { name: "从预置知识库中选择", value: "kb" },
        { name: "手动输入", value: "manual" },
        { name: "跳过", value: "skip" },
      ],
      theme: { prefix: chalk.cyan("  ?") },
    })

    if (addMode === "kb") {
      if (typeKey === "tech") {
        const domains = preset.step3.domains || []
        const domain = await select({
          message: "选择领域:",
          choices: domains.map((d) => ({ name: d, value: d })),
          theme: { prefix: chalk.cyan("  ?") },
        })
        const kbKey = getDomainKey(domain)
        const rules = getRules(kbKey)
        const selected = await selectFromRules(
          rules,
          `以下是${domain}常见规范:`,
        )
        ctx.methods.push(...selected)
      } else {
        const categories = getCategories(typeKey)
        if (categories.length > 0) {
          const category = await select({
            message: "选择类别:",
            choices: categories.map((c) => ({ name: c, value: c })),
            theme: { prefix: chalk.cyan("  ?") },
          })
          const rules = getCategoryRules(typeKey, category)
          const selected = await selectFromRules(
            rules,
            `以下是预置的${category}特征:`,
          )
          ctx.methods.push(...selected)
        } else {
          console.log(chalk.dim("  该类型暂无预置知识库，请手动输入"))
        }
      }
    } else if (addMode === "manual") {
      let adding = true
      while (adding) {
        const title = await input({
          message: preset.step3.manual.titlePrompt,
          theme: { prefix: chalk.cyan("  ?") },
        })
        const scenario = await input({
          message: preset.step3.manual.scenarioPrompt,
          theme: { prefix: chalk.cyan("  ?") },
        })
        const steps = await input({
          message: preset.step3.manual.stepsPrompt,
          theme: { prefix: chalk.cyan("  ?") },
        })
        ctx.methods.push({ title, scenario, steps })

        adding = await confirm({
          message: "继续添加?",
          default: false,
          theme: { prefix: chalk.cyan("  ?") },
        })
      }
    }
  } else {
    const addMode = await select({
      message: "选择添加方式:",
      choices: [
        { name: "手动输入", value: "manual" },
        { name: "跳过", value: "skip" },
      ],
      theme: { prefix: chalk.cyan("  ?") },
    })
    if (addMode === "manual") {
      let adding = true
      while (adding) {
        const title = await input({
          message: preset.step3.manual.titlePrompt,
          theme: { prefix: chalk.cyan("  ?") },
        })
        const scenario = await input({
          message: preset.step3.manual.scenarioPrompt,
          theme: { prefix: chalk.cyan("  ?") },
        })
        const steps = await input({
          message: preset.step3.manual.stepsPrompt,
          theme: { prefix: chalk.cyan("  ?") },
        })
        ctx.methods.push({ title, scenario, steps })

        adding = await confirm({
          message: "继续添加?",
          default: false,
          theme: { prefix: chalk.cyan("  ?") },
        })
      }
    }
  }

  const unique = await input({
    message: preset.step3.uniquePrompt,
    theme: { prefix: chalk.cyan("  ?") },
  })
  if (unique) {
    ctx.methods.push({
      title: "自定义",
      scenario: "根据场景判断",
      steps: unique,
    })
  }

  progress(preset.step3.progress(ctx.name))

  // ── 第四步 ──
  stepTitle("四", preset.step4.title)
  console.log(chalk.dim(`  ${preset.step4.hint}`))
  console.log(chalk.dim(`  ${preset.step4.hint2}\n`))

  let addingDecisions = true
  while (addingDecisions) {
    const decision = await input({
      message: preset.step4.decisionPrompt,
      theme: { prefix: chalk.cyan("  ?") },
    })
    if (!decision) break

    const why = await input({
      message: preset.step4.whyPrompt,
      theme: { prefix: chalk.cyan("  ?") },
    })
    const impact = await input({
      message: preset.step4.impactPrompt,
      default: "",
      theme: { prefix: chalk.cyan("  ?") },
    })
    ctx.decisions.push({ decision, why, impact })

    addingDecisions = await confirm({
      message: "继续添加?",
      default: false,
      theme: { prefix: chalk.cyan("  ?") },
    })
  }

  progress(preset.step4.progress(ctx.name))

  // ── 第五步 ──
  stepTitle("五", preset.step5.title)
  console.log(chalk.dim(`  ${preset.step5.hint}`))
  console.log(chalk.dim(`  ${preset.step5.hint2}\n`))

  let addingBoundaries = true
  while (addingBoundaries) {
    const boundary = await input({
      message: preset.step5.prompt,
      theme: { prefix: chalk.cyan("  ?") },
    })
    if (!boundary) break

    ctx.boundaries.push(boundary)
    addingBoundaries = await confirm({
      message: "继续添加?",
      default: false,
      theme: { prefix: chalk.cyan("  ?") },
    })
  }

  progress(preset.step5.progress(ctx.name))

  // ── 第六步 ──
  stepTitle("六", preset.step6.title)

  for (const q of preset.step6.questions) {
    ctx[q.key] = await select({
      message: q.text,
      choices: q.options.map((o) => ({ name: o, value: o })),
      theme: { prefix: chalk.cyan("  ?") },
    })
  }

  ctx.otherStyle = await input({
    message: preset.step6.otherPrompt,
    default: "无",
    theme: { prefix: chalk.cyan("  ?") },
  })

  progress(preset.step6.progress(ctx.name))

  // ── 第七步 ──
  stepTitle("七", preset.step7.title)
  console.log(chalk.dim(`  ${preset.step7.hint}`))
  console.log(chalk.dim(`  ${preset.step7.hint2}\n`))

  ctx.importPath = await input({
    message: preset.step7.prompt,
    default: "",
    theme: { prefix: chalk.cyan("  ?") },
  })

  if (ctx.importPath) {
    progress(preset.step7.progress(ctx.name))
  }

  // ── 生成文件 ──
  divider()
  const spinner = ora({
    text: chalk.cyan("正在生成赛博人档案..."),
    spinner: "dots12",
    color: "cyan",
  }).start()

  const outputDir = path.join(process.cwd(), "cybermen", ctx.name)
  let fileCount = 0

  writeFile(path.join(outputDir, "identity.md"), generateIdentity(ctx))
  fileCount++

  writeFile(path.join(outputDir, "style.md"), generateStyle(ctx))
  fileCount++

  if (ctx.methods.length > 0) {
    ctx.methods.forEach((m) => {
      const fileName = `${m.title.replace(/[^a-zA-Z\u4e00-\u9fff]/g, "").toLowerCase()}.skill`
      writeFile(
        path.join(outputDir, "methods", fileName),
        generateMethod(ctx.name, m.title, m),
      )
      fileCount++
    })
  }

  if (ctx.boundaries.length > 0) {
    ctx.boundaries.forEach((b, i) => {
      writeFile(
        path.join(outputDir, "boundaries", `boundary-${i + 1}.rule`),
        generateBoundary(ctx.name, `红线 ${i + 1}`, b),
      )
      fileCount++
    })
  }

  if (ctx.decisions.length > 0) {
    let content = `# ${ctx.name} 的核心记忆\n\n`
    ctx.decisions.forEach((d) => {
      content +=
        generateDecision(ctx.name, d.decision, d.why, d.impact) + "\n\n"
    })
    writeFile(path.join(outputDir, "decisions", "decisions.md"), content)
    fileCount++
  }

  // 模拟一点生成时间，让 spinner 有存在感
  await new Promise((r) => setTimeout(r, 800))
  spinner.succeed(chalk.green("生成完成"))

  // 完成
  const typeInfo = TYPES.find((t) => t.key === typeKey)
  console.log(
    boxen(
      `${typeInfo.emoji}  ${chalk.bold(ctx.name)}\n\n` +
        `${chalk.dim("类型")}  ${typeInfo.label}\n` +
        `${chalk.dim("文件")}  ${fileCount} 个\n` +
        `${chalk.dim("位置")}  ${chalk.underline(outputDir)}`,
      {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: "round",
        borderColor: "green",
        title: "蒸馏完成",
        titleAlignment: "center",
      },
    ),
  )
  console.log(chalk.dim("  蒸馏万物，赛博永生。\n"))
}

// ── 主入口 ──
async function main() {
  showBanner()

  const mode = await select({
    message: "选择蒸馏模式:",
    choices: [
      {
        name: `${chalk.cyan("✦")}  交互式蒸馏 ${chalk.dim("— 通过对话逐步构建赛博人")}`,
        value: "interactive",
      },
      {
        name: `🤖  LLM自动萃取 ${chalk.dim("— 从已有资产自动生成赛博人")}`,
        value: "llm",
      },
    ],
    theme: { prefix: chalk.cyan("  ?") },
  })

  if (mode === "llm") {
    console.log(
      boxen(
        `${chalk.yellow("⏳ LLM自动萃取模式开发中...")}\n\n` +
          "预计功能:\n" +
          "  - 自动解析 .cursor/rules, CLAUDE.md 等规范文件\n" +
          "  - 提取您提供的任何资产中的决策依据\n\n" +
          chalk.dim("你可以先用「交互式蒸馏」快速体验。"),
        {
          padding: 1,
          margin: { top: 1, left: 2 },
          borderStyle: "round",
          borderColor: "yellow",
        },
      ),
    )
  } else {
    await distill()
  }
}

main().catch((err) => {
  console.error(chalk.red("出错了:"), err)
  process.exit(1)
})
