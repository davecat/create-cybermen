#!/usr/bin/env node

"use strict"

const path = require("path")
const fs = require("fs")
const readline = require("readline")

// ── 知识库 ──
const knowledge = require("../knowledge/index")

// ── 颜色 ──
const cyan = (s) => `\x1b[36m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const gray = (s) => `\x1b[90m${s}\x1b[0m`
const bold = (s) => `\x1b[1m${s}\x1b[0m`
const dim = (s) => `\x1b[2m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`

const BANNER = `
\x1b[36m┌─────────────────────────────────────────┐
│                                         │
│   \x1b[1m🤖  赛博人蒸馏器 v0.1.0\x1b[0m\x1b[36m              │
│   \x1b[2m蒸馏万物，赛博永生\x1b[0m\x1b[36m                    │
│                                         │
└─────────────────────────────────────────┘\x1b[0m
`

// ── 工具函数 ──
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    const hint = defaultValue ? ` ${dim(`(默认: ${defaultValue})`)}` : ""
    rl.question(`${question}${hint} `, (answer) => {
      resolve((answer || defaultValue || "").trim())
    })
  })
}

function choose(question, options) {
  return new Promise((resolve) => {
    console.log(question)
    options.forEach((opt, i) => {
      console.log(`  ${green(String(i + 1))}) ${opt}`)
    })
    rl.question(`\n选择 [1-${options.length}]: `, (answer) => {
      const idx = parseInt(answer, 10) - 1
      if (idx >= 0 && idx < options.length) {
        resolve(options[idx])
      } else {
        resolve(options[0])
      }
    })
  })
}

function multiChoose(question, options) {
  return new Promise((resolve) => {
    const selected = new Set()
    console.log(question)
    console.log(gray("  空格键 = 选择/取消, Enter = 确认\n"))

    function render() {
      process.stdout.write("\x1b[H\x1b[2J")
      console.log(question)
      console.log(gray("  空格键 = 选择/取消, Enter = 确认\n"))
      options.forEach((opt, i) => {
        const mark = selected.has(i) ? green("☑") : "☐"
        console.log(`  ${mark} ${opt}`)
      })
    }

    render()

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on("data", handler)

    function handler(key) {
      const byte = key[0]
      if (byte === 3) process.exit(0) // Ctrl+C
      if (byte === 13 || byte === 10) {
        // Enter
        process.stdin.setRawMode(false)
        process.stdin.removeListener("data", handler)
        resolve([...selected].map((i) => options[i]))
        return
      }
      if (byte === 32) {
        // Space - 选第一个未选的
        for (let i = 0; i < options.length; i++) {
          if (selected.has(i)) continue
          selected.add(i)
          break
        }
        render()
        return
      }
      // 数字键 1-9 切换选择
      const num = byte - 48
      if (num >= 1 && num <= 9 && num <= options.length) {
        const idx = num - 1
        if (selected.has(idx)) selected.delete(idx)
        else selected.add(idx)
        render()
      }
    }
  })
}

function progress(text) {
  console.log(`\n  ${dim("✦")} ${text}`)
}

function separator(text) {
  console.log(`\n${cyan("━".repeat(48))}`)
  if (text) console.log(`  ${bold(text)}`)
  console.log(cyan("━".repeat(48)))
}

function success(text) {
  console.log(`\n  ${green("✓")} ${text}`)
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, content, "utf8")
}

// ── 生成器 ──
function generateIdentity(ctx) {
  return `---
name: ${ctx.name}
description: ${ctx.description}
type: cybermen
---

# ${ctx.name} — 赛博人档案

## 我是谁
${ctx.description}

## 触发词
${ctx.triggers}

## 职责范围
${ctx.domain}

## 核心能力
${ctx.capabilities}

## 工作原则
${ctx.principles || "- 先理解再行动\n- 不重复造轮子\n- 产出即标准"}`
}

function generateStyle(ctx) {
  return `# ${ctx.name} 的风格

## 沟通方式
${ctx.communicationStyle || "根据实际情况调整"}

## 决策风格
${ctx.decisionStyle || "根据实际情况调整"}

## 完美主义程度
${ctx.perfectionism || "适中，在关键处追求完美"}

## 其他风格特征
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
  return `## 决策: ${decision}

**原因**: ${why}

**影响**: ${impact || "待评估"}`
}

function generatePitfall(name, pitfall, lesson) {
  return `## 踩坑: ${pitfall}

**教训**: ${lesson}`
}

// ── 蒸馏流程 ──
async function distill() {
  const ctx = {
    name: "",
    description: "",
    triggers: "",
    domain: "",
    capabilities: "",
    principles: "",
    methods: [],
    boundaries: [],
    decisions: [],
    pitfalls: [],
    communicationStyle: "",
    decisionStyle: "",
    perfectionism: "",
    otherStyle: "",
    importPath: "",
  }

  separator("开始创造你的赛博人")

  // 第一步：名字和身份
  console.log(`\n${bold("第一步：给他一个名字和身份")}\n`)
  ctx.name = await ask("赛博人名称:")
  if (!ctx.name) {
    console.log(red("名称不能为空，蒸馏取消"))
    process.exit(0)
  }
  ctx.description = await ask("一句话介绍他:")
  ctx.triggers = await ask("别人怎么叫他?（触发词，逗号分隔）:", ctx.name)

  progress(`赛博人「${ctx.name}」已苏醒，但他还是一张白纸...`)

  // 第二步：职责
  console.log(`\n${bold("第二步：赋予他职责")}\n`)
  ctx.domain = await ask("他负责什么领域?:")
  ctx.capabilities = await ask("你希望他帮你干什么?:")

  progress(`「${ctx.name}」开始理解自己的使命...`)

  // 第三步：教他做事
  console.log(`\n${bold("第三步：教他做事的方法")}\n`)
  const mode = await choose("选择添加方式:", [
    "从预置知识库中选择",
    "手动输入",
    "跳过",
  ])

  if (mode === "从预置知识库中选择") {
    const domain = await choose("选择领域:", [
      "前端开发",
      "后端开发",
      "产品设计",
      "测试",
      "运维",
      "其他",
    ])
    const kbKey = knowledge.getDomainKey(domain)
    const commonRules = knowledge.getRules(kbKey)

    if (commonRules.length > 0) {
      console.log(`\n以下是${domain}常见规范，哪些适用于你的项目?\n`)
      console.log(gray("输入编号选择（逗号分隔），输入 skip 跳过:"))
      commonRules.forEach((rule, i) => {
        console.log(`  ${green(String(i + 1))}. ${rule.title}`)
        console.log(`     ${gray(rule.desc)}`)
      })

      const selection = await ask("")
      if (selection.toLowerCase() !== "skip") {
        const indices = selection
          .split(/[,，]/)
          .map((s) => parseInt(s.trim(), 10) - 1)
          .filter((i) => i >= 0 && i < commonRules.length)

        indices.forEach((i) => {
          ctx.methods.push({
            title: commonRules[i].title,
            scenario: commonRules[i].scenario,
            steps: commonRules[i].steps,
          })
        })
      }
    }
  } else if (mode === "手动输入") {
    let done = false
    while (!done) {
      const title = await ask("方法名称（如: 创建新模块）:")
      const scenario = await ask("触发场景（什么时候用这个方法）:")
      const steps = await ask("执行步骤:")
      ctx.methods.push({ title, scenario, steps })

      const more = await ask("还有吗? [y/n]:", "n")
      done = more.toLowerCase() !== "y"
    }
  }

  const unique = await ask("你独特的做法?（可选，补充预置中没有的）:")
  if (unique) {
    ctx.methods.push({
      title: "自定义方法",
      scenario: "根据场景判断",
      steps: unique,
    })
  }

  progress(`「${ctx.name}」学会了你的做事方式...`)

  // 第四步：技术决策
  console.log(`\n${bold("第四步：告诉他你做过的决定")}\n`)
  console.log(gray("回想一下，你做过什么和别人不一样的技术选择?"))
  console.log(gray("或者什么决定，事后证明是对的?\n"))

  let done = false
  while (!done) {
    const decision = await ask("你做了什么决定?:")
    if (decision) {
      const why = await ask("为什么这么做?:")
      const impact = await ask("这个决定的影响?:", "")
      ctx.decisions.push({ decision, why, impact })
    }
    if (!decision) {
      done = true
    } else {
      const more = await ask("还有吗? [y/n]:", "n")
      done = more.toLowerCase() !== "y"
    }
  }

  progress(`「${ctx.name}」理解了你的决策逻辑...`)

  // 第五步：红线
  console.log(`\n${bold("第五步：划定他的红线")}\n`)
  console.log(gray("有什么事是他绝对不能做的?"))
  console.log(gray("什么事会把他惹毛?\n"))

  done = false
  while (!done) {
    const boundary = await ask("红线:")
    if (boundary) {
      ctx.boundaries.push(boundary)
    }
    if (!boundary) {
      done = true
    } else {
      const more = await ask("还有吗? [y/n]:", "n")
      done = more.toLowerCase() !== "y"
    }
  }

  progress(`「${ctx.name}」记住了你的底线...`)

  // 第六步：风格
  console.log(`\n${bold("第六步：塑造他的风格")}\n`)

  ctx.communicationStyle = await choose("他说话直接还是委婉?", [
    "直接了当，结论先行",
    "委婉铺垫，逐步说明",
    "看情况灵活切换",
  ])

  ctx.decisionStyle = await choose("他想清楚再做还是先做再说?", [
    "想清楚再做，谋定而后动",
    "先做了再说，边做边调整",
    "重要决策想清楚，小决策先做",
  ])

  ctx.perfectionism = await choose("他追求完美还是够用就行?", [
    "核心功能追求完美，边缘场景够用就行",
    "所有细节都要完美",
    "先跑起来再说，慢慢优化",
  ])

  ctx.otherStyle = await ask("还有其他风格特征吗?（可选）:", "无")

  progress(`「${ctx.name}」的性格逐渐丰满...`)

  // 第七步：导入资料
  console.log(`\n${bold("第七步：给他看看你以前的作品")}\n`)
  console.log(gray("有没有已经写好的规范、文档、代码?"))
  console.log(gray("可以导入 .cursor/rules, .md, .json 等文件\n"))

  ctx.importPath = await ask("路径或 URL（可选，留空跳过）:", "")

  if (ctx.importPath) {
    progress(`「${ctx.name}」正在学习你的历史资料...`)
  }

  // 生成文件
  separator("正在生成赛博人")

  const outputDir = path.join(process.cwd(), "cybermen", ctx.name)
  let fileCount = 0

  // identity.md
  writeFile(path.join(outputDir, "identity.md"), generateIdentity(ctx))
  fileCount++

  // style.md
  writeFile(path.join(outputDir, "style.md"), generateStyle(ctx))
  fileCount++

  // methods
  if (ctx.methods.length > 0) {
    ctx.methods.forEach((m) => {
      const fileName = `${m.title
        .replace(/[^a-zA-Z\u4e00-\u9fff]/g, "")
        .toLowerCase()}.skill`
      writeFile(
        path.join(outputDir, "methods", fileName),
        generateMethod(ctx.name, m.title, m),
      )
      fileCount++
    })
  }

  // boundaries
  if (ctx.boundaries.length > 0) {
    ctx.boundaries.forEach((b, i) => {
      writeFile(
        path.join(outputDir, "boundaries", `boundary-${i + 1}.rule`),
        generateBoundary(ctx.name, `红线 ${i + 1}`, b),
      )
      fileCount++
    })
  }

  // decisions
  if (ctx.decisions.length > 0) {
    let content = `# ${ctx.name} 的技术决策\n\n`
    ctx.decisions.forEach((d) => {
      content +=
        generateDecision(ctx.name, d.decision, d.why, d.impact) + "\n\n"
    })
    writeFile(path.join(outputDir, "decisions", "decisions.md"), content)
    fileCount++
  }

  // pitfalls
  if (ctx.pitfalls.length > 0) {
    let content = `# ${ctx.name} 的踩坑记录\n\n`
    ctx.pitfalls.forEach((p) => {
      content += generatePitfall(ctx.name, p.pitfall, p.lesson) + "\n\n"
    })
    writeFile(path.join(outputDir, "pitfalls", "pitfalls.md"), content)
    fileCount++
  }

  // 完成
  separator(`🎉 赛博人「${ctx.name}」蒸馏完成！`)

  console.log(`\n  位置: ${green(outputDir)}`)
  console.log(`  文件: ${fileCount} 个\n`)
  console.log(dim("  他带着你的做事方式、你的红线、你的风格，"))
  console.log(dim("  可以开始替你干活了。\n"))
}

// ── 主入口 ──
async function main() {
  console.log(BANNER)

  const mode = await choose("选择蒸馏模式:", [
    "✦  交互式蒸馏 — 通过对话逐步构建赛博人",
    "🤖  LLM自动萃取 — 你只需要历史资产，自动分析生成赛博人",
  ])

  if (mode.includes("LLM自动萃取")) {
    console.log(`\n${yellow("⏳ LLM自动萃取模式开发中...")}\n`)
    console.log("预计功能:")
    console.log("  - 自动解析 .cursor/rules, CLAUDE.md 等规范文件")
    console.log(
      "  - 提取 Git 提交记录、PR 评论中的决策依据，自动分析生成赛博人",
    )
    console.log("\n你可以先用「交互式蒸馏」快速体验。\n")
    rl.close()
    return
  } else {
    await distill()
    rl.close()
  }
}

main().catch((err) => {
  console.error(red("出错了:"), err)
  process.exit(1)
})
