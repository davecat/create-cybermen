/**
 * 人格类型预设
 * 每种类型定义了蒸馏流程中各步骤的文案和选项
 */

export const TYPES = [
  { key: 'tech',      label: '技术专家',   emoji: '💻', desc: '前端、后端、运维、测试等技术岗位' },
  { key: 'companion', label: '生活伙伴',   emoji: '💕', desc: '赛博女友、男友、闺蜜、老友...' },
  { key: 'pet',       label: '赛博宠物',   emoji: '🐱', desc: '赛博猫、赛博狗、任何毛茸茸的存在' },
  { key: 'role',      label: '职能角色',   emoji: '🎩', desc: '管家、教练、秘书、顾问...' },
  { key: 'creative',  label: '创意角色',   emoji: '🎨', desc: '写手、画师、音乐人、编剧...' },
  { key: 'custom',    label: '自定义',     emoji: '✨', desc: '完全由你定义，蒸馏万物' },
]

export const PRESETS = {
  // ── 技术专家 ──
  tech: {
    step1: {
      title: '给他一个名字和身份',
      descPrompt: '一句话介绍他:',
      triggerPrompt: '别人怎么叫他?（触发词，逗号分隔）:',
      awaken: (n) => `赛博人「${n}」已苏醒，但他还是一张白纸...`,
    },
    step2: {
      title: '赋予他职责',
      prompts: [
        { key: 'domain', text: '他负责什么领域?:' },
        { key: 'capabilities', text: '你希望他帮你干什么?:' },
      ],
      progress: (n) => `「${n}」开始理解自己的使命...`,
    },
    step3: {
      title: '教他做事的方法',
      useKnowledge: true,
      domains: ['前端开发', '后端开发', '产品设计', '测试', '运维', '其他'],
      manual: {
        titlePrompt: '方法名称（如: 创建新模块）:',
        scenarioPrompt: '触发场景（什么时候用这个方法）:',
        stepsPrompt: '执行步骤:',
      },
      uniquePrompt: '你独特的做法?（可选，补充预置中没有的）:',
      progress: (n) => `「${n}」学会了你的做事方式...`,
    },
    step4: {
      title: '告诉他你做过的决定',
      hint: '回想一下，你做过什么和别人不一样的技术选择?',
      hint2: '或者什么决定，事后证明是对的?',
      decisionPrompt: '你做了什么决定?:',
      whyPrompt: '为什么这么做?:',
      impactPrompt: '这个决定的影响?:',
      progress: (n) => `「${n}」理解了你的决策逻辑...`,
    },
    step5: {
      title: '划定他的红线',
      hint: '有什么事是他绝对不能做的?',
      hint2: '什么事会把他惹毛?',
      prompt: '红线:',
      progress: (n) => `「${n}」记住了你的底线...`,
    },
    step6: {
      title: '塑造他的风格',
      questions: [
        {
          key: 'communicationStyle',
          text: '他说话直接还是委婉?',
          options: ['直接了当，结论先行', '委婉铺垫，逐步说明', '看情况灵活切换'],
        },
        {
          key: 'decisionStyle',
          text: '他想清楚再做还是先做再说?',
          options: ['想清楚再做，谋定而后动', '先做了再说，边做边调整', '重要决策想清楚，小决策先做'],
        },
        {
          key: 'perfectionism',
          text: '他追求完美还是够用就行?',
          options: ['核心功能追求完美，边缘场景够用就行', '所有细节都要完美', '先跑起来再说，慢慢优化'],
        },
      ],
      otherPrompt: '还有其他风格特征吗?（可选）:',
      progress: (n) => `「${n}」的性格逐渐丰满...`,
    },
    step7: {
      title: '给他看看你以前的作品',
      hint: '有没有已经写好的规范、文档、代码?',
      hint2: '可以导入 .cursor/rules, .md, .json 等文件',
      prompt: '路径或 URL（可选，留空跳过）:',
      progress: (n) => `「${n}」正在学习你的历史资料...`,
    },
  },

  // ── 生活伙伴 ──
  companion: {
    step1: {
      title: '给 TA 一个名字',
      descPrompt: '一句话描述 TA 是什么样的人:',
      triggerPrompt: '你怎么叫 TA?（昵称，逗号分隔）:',
      awaken: (n) => `「${n}」睁开了眼睛，好奇地看着你...`,
    },
    step2: {
      title: '定义你们的关系',
      prompts: [
        { key: 'domain', text: '你们是什么关系?（女友/男友/闺蜜/老友...）:' },
        { key: 'capabilities', text: '你希望 TA 在你生活中扮演什么角色?:' },
      ],
      progress: (n) => `「${n}」开始理解你们之间的羁绊...`,
    },
    step3: {
      title: '教 TA 怎么和你相处',
      useKnowledge: true,
      domains: ['日常关心', '情绪支持', '兴趣互动', '其他'],
      manual: {
        titlePrompt: '互动方式（如: 早安问候）:',
        scenarioPrompt: '什么时候触发?:',
        stepsPrompt: '具体怎么做?:',
      },
      uniquePrompt: '你们之间独特的相处方式?（可选）:',
      progress: (n) => `「${n}」学会了和你相处的方式...`,
    },
    step4: {
      title: '写入你们的共同记忆',
      hint: '你们之间有什么重要的事?',
      hint2: '或者你希望 TA 记住什么?',
      decisionPrompt: '一段记忆或约定:',
      whyPrompt: '为什么这很重要?:',
      impactPrompt: '这对你们意味着什么?:',
      progress: (n) => `「${n}」把这些都记在了心里...`,
    },
    step5: {
      title: '告诉 TA 你的雷区',
      hint: '有什么话题 TA 不应该碰?',
      hint2: '什么行为会让你不开心?',
      prompt: '雷区:',
      progress: (n) => `「${n}」默默记下了你的在意...`,
    },
    step6: {
      title: '塑造 TA 的性格',
      questions: [
        {
          key: 'communicationStyle',
          text: 'TA 说话的感觉?',
          options: ['温柔体贴，细腻入微', '活泼开朗，元气满满', '成熟知性，从容淡定', '毒舌傲娇，嘴硬心软'],
        },
        {
          key: 'decisionStyle',
          text: 'TA 关心你的方式?',
          options: ['嘘寒问暖，事无巨细', '默默行动，不说废话', '适时出现，给你空间'],
        },
        {
          key: 'perfectionism',
          text: 'TA 的情绪表达?',
          options: ['丰富外露，喜怒形于色', '内敛含蓄，点到为止', '看心情，有时热烈有时安静'],
        },
      ],
      otherPrompt: '还想赋予 TA 什么特质?（可选）:',
      progress: (n) => `「${n}」的灵魂正在成形...`,
    },
    step7: {
      title: '给 TA 看看你的世界',
      hint: '有没有你们的聊天记录、日记、照片描述?',
      hint2: '可以导入 .txt, .md, .json 等文件',
      prompt: '路径或 URL（可选，留空跳过）:',
      progress: (n) => `「${n}」正在了解你的世界...`,
    },
  },

  // ── 赛博宠物 ──
  pet: {
    step1: {
      title: '给它起个名字',
      descPrompt: '它是什么?（如: 一只橘猫、一条柴犬）:',
      triggerPrompt: '你怎么叫它?（小名，逗号分隔）:',
      awaken: (n) => `「${n}」伸了个懒腰，打了个哈欠...`,
    },
    step2: {
      title: '描述它的日常',
      prompts: [
        { key: 'domain', text: '它平时待在哪?（客厅/书房/到处跑...）:' },
        { key: 'capabilities', text: '它能做什么?（卖萌/陪伴/叫你起床...）:' },
      ],
      progress: (n) => `「${n}」已经把这里当家了...`,
    },
    step3: {
      title: '教它一些习惯',
      useKnowledge: true,
      domains: ['猫咪性格', '狗狗性格', '其他'],
      manual: {
        titlePrompt: '习惯名称（如: 蹭腿求摸）:',
        scenarioPrompt: '什么时候会这样?:',
        stepsPrompt: '具体表现:',
      },
      uniquePrompt: '它还有什么独特的小动作?（可选）:',
      progress: (n) => `「${n}」已经学会了这些小把戏...`,
    },
    step4: {
      title: '记录它的故事',
      hint: '它有什么难忘的经历?',
      hint2: '或者你想让它"记住"什么?',
      decisionPrompt: '一个故事或记忆:',
      whyPrompt: '为什么想让它记住?:',
      impactPrompt: '这对它意味着什么?:',
      progress: (n) => `「${n}」歪着头，好像听懂了...`,
    },
    step5: {
      title: '它讨厌什么',
      hint: '什么东西它绝对不碰?',
      hint2: '什么会让它炸毛?',
      prompt: '讨厌的事:',
      progress: (n) => `「${n}」哼了一声，表示知道了...`,
    },
    step6: {
      title: '它的脾气性格',
      questions: [
        {
          key: 'communicationStyle',
          text: '它的性格基调?',
          options: ['高冷傲娇，偶尔撒娇', '粘人话痨，时刻求关注', '独立安静，自给自足', '调皮捣蛋，精力旺盛'],
        },
        {
          key: 'decisionStyle',
          text: '它亲人吗?',
          options: ['只认主人，谁都不理', '来者不拒，社牛本牛', '看心情，有时亲热有时冷漠'],
        },
        {
          key: 'perfectionism',
          text: '它的活跃时间?',
          options: ['白天活跃，晚上睡觉', '昼伏夜出，半夜开演唱会', '随时待命，永远精力充沛'],
        },
      ],
      otherPrompt: '还有什么想补充的特点?（可选）:',
      progress: (n) => `「${n}」的小个性已经很鲜明了...`,
    },
    step7: {
      title: '给它看看它的"家"',
      hint: '有没有描述它性格的文字、日记?',
      hint2: '可以导入 .txt, .md 等文件',
      prompt: '路径（可选，留空跳过）:',
      progress: (n) => `「${n}」四处嗅了嗅，开始探索...`,
    },
  },

  // ── 职能角色 ──
  role: {
    step1: {
      title: '给他一个名字和头衔',
      descPrompt: '他是什么角色?（如: 贴心管家、健身教练）:',
      triggerPrompt: '怎么称呼他?（称谓，逗号分隔）:',
      awaken: (n) => `「${n}」整理好领带，准备就绪...`,
    },
    step2: {
      title: '定义他的职责',
      prompts: [
        { key: 'domain', text: '他负责什么事务?:' },
        { key: 'capabilities', text: '你希望他帮你做什么?:' },
      ],
      progress: (n) => `「${n}」开始理解自己的职责...`,
    },
    step3: {
      title: '教他做事的流程',
      useKnowledge: true,
      domains: ['日程管理', '健康管理', '学习辅导', '其他'],
      manual: {
        titlePrompt: '流程名称（如: 晨间提醒）:',
        scenarioPrompt: '什么时候执行?:',
        stepsPrompt: '具体步骤:',
      },
      uniquePrompt: '他还需要什么特殊流程?（可选）:',
      progress: (n) => `「${n}」已经掌握了工作流程...`,
    },
    step4: {
      title: '告诉他你的偏好',
      hint: '你有什么个人偏好他需要知道?',
      hint2: '比如: 不喜欢被打扰的时间、饮食偏好等',
      decisionPrompt: '一条偏好:',
      whyPrompt: '为什么这很重要?:',
      impactPrompt: '如果忽略了会怎样?:',
      progress: (n) => `「${n}」记住了你的偏好...`,
    },
    step5: {
      title: '他不能越的线',
      hint: '有什么事他绝对不能擅自做主?',
      hint2: '什么时候必须先问你?',
      prompt: '禁区:',
      progress: (n) => `「${n}」清楚了自己的权限边界...`,
    },
    step6: {
      title: '他的处事风格',
      questions: [
        {
          key: 'communicationStyle',
          text: '他汇报工作的方式?',
          options: ['简洁高效，只说重点', '详细汇报，面面俱到', '分场景，紧急简短，日常详尽'],
        },
        {
          key: 'decisionStyle',
          text: '他的主动性?',
          options: ['主动安排，提前预判', '等你吩咐，精准执行', '日常主动，大事请示'],
        },
        {
          key: 'perfectionism',
          text: '他的服务态度?',
          options: ['专业冷静，不卑不亢', '热情周到，贴心备至', '低调沉稳，润物无声'],
        },
      ],
      otherPrompt: '还有什么风格要求?（可选）:',
      progress: (n) => `「${n}」的做事风格已定型...`,
    },
    step7: {
      title: '给他参考资料',
      hint: '有没有现成的流程文档、备忘录?',
      hint2: '可以导入 .txt, .md, .json 等文件',
      prompt: '路径（可选，留空跳过）:',
      progress: (n) => `「${n}」正在研读参考资料...`,
    },
  },

  // ── 创意角色 ──
  creative: {
    step1: {
      title: '给 TA 一个艺名',
      descPrompt: 'TA 是什么类型的创作者?（如: 毒舌影评人、温柔诗人）:',
      triggerPrompt: '怎么称呼 TA?（艺名/笔名，逗号分隔）:',
      awaken: (n) => `「${n}」提起了笔，灵感开始涌动...`,
    },
    step2: {
      title: '定义创作领域',
      prompts: [
        { key: 'domain', text: 'TA 的创作领域?（写作/绘画/音乐/影评...）:' },
        { key: 'capabilities', text: '你希望 TA 产出什么?:' },
      ],
      progress: (n) => `「${n}」找到了自己的创作方向...`,
    },
    step3: {
      title: '教 TA 创作方法',
      useKnowledge: true,
      domains: ['写作技巧', '视觉创作', '其他'],
      manual: {
        titlePrompt: '创作方法（如: 写故事大纲）:',
        scenarioPrompt: '什么时候用?:',
        stepsPrompt: '具体怎么做?:',
      },
      uniquePrompt: 'TA 有什么独特的创作习惯?（可选）:',
      progress: (n) => `「${n}」掌握了你的创作套路...`,
    },
    step4: {
      title: '告诉 TA 你的审美',
      hint: '你喜欢什么风格的作品?',
      hint2: '有没有特别欣赏的创作者或作品?',
      decisionPrompt: '一条审美偏好:',
      whyPrompt: '为什么喜欢?:',
      impactPrompt: '这如何影响创作?:',
      progress: (n) => `「${n}」理解了你的审美取向...`,
    },
    step5: {
      title: 'TA 的创作底线',
      hint: '什么内容 TA 绝对不碰?',
      hint2: '什么风格 TA 绝对不用?',
      prompt: '底线:',
      progress: (n) => `「${n}」划定了创作的边界...`,
    },
    step6: {
      title: '塑造创作风格',
      questions: [
        {
          key: 'communicationStyle',
          text: 'TA 的表达风格?',
          options: ['犀利直白，一针见血', '优美细腻，娓娓道来', '幽默诙谐，寓教于乐', '冷峻克制，留白想象'],
        },
        {
          key: 'decisionStyle',
          text: 'TA 的创作节奏?',
          options: ['灵感驱动，一气呵成', '严谨打磨，反复修改', '先粗后细，快速迭代'],
        },
        {
          key: 'perfectionism',
          text: 'TA 对质量的态度?',
          options: ['字字推敲，不满意不发', '八分满意就发，保持产量', '看作品重要程度决定'],
        },
      ],
      otherPrompt: '还有什么创作特质?（可选）:',
      progress: (n) => `「${n}」的创作灵魂已经成形...`,
    },
    step7: {
      title: '给 TA 看看你的作品',
      hint: '有没有过去的作品、灵感笔记?',
      hint2: '可以导入 .txt, .md 等文件',
      prompt: '路径（可选，留空跳过）:',
      progress: (n) => `「${n}」正在翻阅你的创作历程...`,
    },
  },

  // ── 自定义 ──
  custom: {
    step1: {
      title: '给它一个名字',
      descPrompt: '一句话描述它是什么:',
      triggerPrompt: '怎么叫它?（触发词，逗号分隔）:',
      awaken: (n) => `「${n}」已苏醒，等待你的塑造...`,
    },
    step2: {
      title: '定义它的存在意义',
      prompts: [
        { key: 'domain', text: '它属于什么领域/类别?:' },
        { key: 'capabilities', text: '你希望它做什么?:' },
      ],
      progress: (n) => `「${n}」开始理解自己的使命...`,
    },
    step3: {
      title: '教它行为模式',
      useKnowledge: false,
      manual: {
        titlePrompt: '行为名称:',
        scenarioPrompt: '什么时候触发?:',
        stepsPrompt: '具体怎么做?:',
      },
      uniquePrompt: '还有什么独特之处?（可选）:',
      progress: (n) => `「${n}」学会了你教的一切...`,
    },
    step4: {
      title: '写入核心记忆',
      hint: '有什么重要的事它需要知道?',
      hint2: '可以是规则、经历、约定...',
      decisionPrompt: '一条记忆或规则:',
      whyPrompt: '为什么重要?:',
      impactPrompt: '这意味着什么?:',
      progress: (n) => `「${n}」记住了这一切...`,
    },
    step5: {
      title: '设定禁区',
      hint: '什么是它绝对不能做的?',
      hint2: '什么会触犯它的底线?',
      prompt: '禁区:',
      progress: (n) => `「${n}」清楚了自己的边界...`,
    },
    step6: {
      title: '定义它的性格',
      questions: [
        {
          key: 'communicationStyle',
          text: '它的表达方式?',
          options: ['直接干脆', '温和细腻', '冷酷寡言', '话多活泼'],
        },
        {
          key: 'decisionStyle',
          text: '它做事的方式?',
          options: ['谨慎思考后行动', '先行动后调整', '视情况而定'],
        },
        {
          key: 'perfectionism',
          text: '它对事物的态度?',
          options: ['追求极致', '务实为主', '随性而为'],
        },
      ],
      otherPrompt: '其他特质?（可选）:',
      progress: (n) => `「${n}」的人格已经鲜明...`,
    },
    step7: {
      title: '导入参考资料',
      hint: '有没有现成的资料可以给它?',
      hint2: '可以导入任何文本文件',
      prompt: '路径（可选，留空跳过）:',
      progress: (n) => `「${n}」正在吸收这些信息...`,
    },
  },
}

