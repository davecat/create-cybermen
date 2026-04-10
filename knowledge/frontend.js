'use strict'

module.exports = {
  rules: [
    {
      id: 'fe-001',
      title: '接口失败不重复弹提示',
      desc: '全局拦截器统一处理接口错误，业务层不要重复弹 Message.error',
      scenario: '任何涉及接口调用的地方',
      steps: `1. 全局 axios 拦截器已处理 code !== 0 的情况
2. 业务层只在成功时弹 $message.success
3. 接口失败 let Promise 自然 reject，全局拦截处理
4. 需要区分的是：用户取消操作（$confirm cancel）不是接口错误`,
    },
    {
      id: 'fe-002',
      title: '时间字段用 Time 不用 At',
      desc: '时间相关字段统一以 Time 结尾，如 createdTime、updateTime',
      scenario: '定义 state、接口字段、数据库映射时',
      steps: `1. 使用 createdTime、updateTime、lastExecutedTime
2. 禁止使用 createdAt、updatedAt、finishedAt
3. 保持团队命名一致性`,
    },
    {
      id: 'fe-003',
      title: 'Vuex action 失败直接 throw',
      desc: '不要在 action 里 catch 后弹 Message.error，让 Promise 自然 reject',
      scenario: '编写 Vuex actions 时',
      steps: `1. 接口失败直接 throw 或 return Promise.reject(err)
2. 不要在 action 中 Message.error
3. 若需乐观更新，在 catch 中回滚 state 后原样抛出 throw e`,
    },
    {
      id: 'fe-004',
      title: '列表页用 VulTable 不自己封装',
      desc: '优先使用 vul-ui 的 VulTable 组件，已内置分页、排序、多选',
      scenario: '创建列表页面时',
      steps: `1. 使用 <vul-table> 组件
2. 通过 v-bind 传入 tableConfig
3. 监听 selection-change、sort-change、loaded 事件
4. 特殊场景才直接用 el-table`,
    },
    {
      id: 'fe-005',
      title: '新增和编辑复用同一页面',
      desc: 'add 和 edit 路由指向同一个组件，通过 query.id 区分',
      scenario: '创建有新增/编辑功能的模块时',
      steps: `1. 路由配置 add 和 edit 都指向同一个 component
2. 页面通过 this.$route.query.id 判断新增还是编辑
3. 减少代码重复，表单逻辑高度一致`,
    },
    {
      id: 'fe-006',
      title: '页面标准结构 = 搜索 + 操作 + 列表',
      desc: '列表页面统一结构：SearchForm + Operation + VulTable',
      scenario: '创建列表页面时',
      steps: `1. 顶部放置 SearchForm 搜索表单
2. 中间放置 Operation 操作按钮
3. 底部放置 VulTable 数据表格
4. 保持统一的页面结构，用户熟悉`,
    },
    {
      id: 'fe-007',
      title: '组件样式必须加 scoped',
      desc: '所有 Vue 组件样式必须加 scoped，避免样式污染',
      scenario: '编写组件样式时',
      steps: `1. <style lang="scss" scoped>
2. 使用 BEM 命名法
3. 全局变量通过 styleResources 自动注入，无需手动 import`,
    },
    {
      id: 'fe-008',
      title: '组件命名 PascalCase',
      desc: '文件名 PascalCase，模板中 kebab-case',
      scenario: '创建 Vue 组件时',
      steps: `1. 文件名: UserProfile.vue
2. 组件 name: 'UserProfile'
3. 模板中使用: <user-profile>
4. CSS 类名 kebab-case`,
    },
    {
      id: 'fe-009',
      title: '删除操作二次确认',
      desc: '删除操作必须通过 $confirm 二次确认，catch 中处理取消操作',
      scenario: '任何删除操作',
      steps: `1. this.$confirm(\`确定删除「\${name}」吗？\`, '提示', { type: 'warning' })
2. catch 中 if (e === 'cancel') return
3. 成功后 $message.success
4. 刷新列表`,
    },
    {
      id: 'fe-010',
      title: '路由命名 kebab-case',
      desc: '路由名使用 kebab-case，如 claw-task-add',
      scenario: '配置路由时',
      steps: `1. 路由名: claw-task-add、ai-employee-edit
2. 与文件路径对应
3. 通过 this.$router.push({ name: 'xxx' }) 跳转`,
    },
  ],
}
