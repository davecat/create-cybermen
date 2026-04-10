export default {
  rules: [
    {
      id: 'be-001',
      title: '接口统一返回格式',
      desc: '所有接口统一 { code, message, data } 格式，code=0 为成功',
      scenario: '设计 API 接口时',
      steps: `1. 成功返回: { code: 0, message: 'success', data: {...} }
2. 失败返回: { code: -1, message: '错误描述', data: null }
3. 分页返回: { code: 0, data: { list: [], total: 100 } }
4. 保持全局一致`,
    },
    {
      id: 'be-002',
      title: '参数校验放在 Controller 层',
      desc: '请求参数校验在 Controller 层完成，Service 层假设参数已合法',
      scenario: '编写接口时',
      steps: `1. Controller 层校验必填参数、格式、范围
2. Service 层直接假设参数合法，专注业务逻辑
3. 校验失败返回 400 + 具体错误信息`,
    },
    {
      id: 'be-003',
      title: '数据库字段用下划线不驼峰',
      desc: '数据库字段统一 snake_case，JSON 输出转 camelCase',
      scenario: '设计数据库表结构时',
      steps: `1. 数据库: created_time、user_name
2. JSON 输出: createdTime、userName
3. 通过 ORM 或转换层处理`,
    },
    {
      id: 'be-004',
      title: '敏感信息不入日志',
      desc: '日志中禁止打印密码、token、手机号等敏感信息',
      scenario: '编写日志输出时',
      steps: `1. 日志脱敏处理
2. 密码、token 等字段直接过滤
3. 使用日志框架的脱敏功能`,
    },
  ],
}
