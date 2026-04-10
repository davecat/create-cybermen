import frontend from './frontend.js'
import backend from './backend.js'
import companion from './companion.js'
import pet from './pet.js'
import role from './role.js'
import creative from './creative.js'

// ── 技术类知识库（保持旧结构兼容） ──
const techDomainMap = {
  前端开发: 'frontend',
  后端开发: 'backend',
  产品设计: 'product',
  测试: 'testing',
  运维: 'ops',
  其他: 'general',
}

const techDomains = {
  frontend,
  backend,
  product: { rules: [] },
  testing: { rules: [] },
  ops: { rules: [] },
  general: { rules: [] },
}

function getDomainKey(domainName) {
  return techDomainMap[domainName] || 'general'
}

function getRules(domainKey) {
  const domain = techDomains[domainKey] || { rules: [] }
  return domain.rules || []
}

// ── 通用知识库（按人格类型 + 子类别） ──
const categoryKB = {
  companion,
  pet,
  role,
  creative,
}

function getCategories(typeKey) {
  const kb = categoryKB[typeKey]
  if (!kb) return []
  return Object.keys(kb)
}

function getCategoryRules(typeKey, category) {
  const kb = categoryKB[typeKey]
  if (!kb || !kb[category]) return []
  return kb[category].rules || []
}

export { getDomainKey, getRules, getCategories, getCategoryRules }
