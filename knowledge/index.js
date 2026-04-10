'use strict'

const frontend = require('./frontend')
const backend = require('./backend')

const domainMap = {
  前端开发: 'frontend',
  后端开发: 'backend',
  产品设计: 'product',
  测试: 'testing',
  运维: 'ops',
  其他: 'general',
}

function getDomainKey(domainName) {
  return domainMap[domainName] || 'general'
}

function getRules(domainKey) {
  const domain = {
    frontend,
    backend,
    product: { rules: [] },
    testing: { rules: [] },
    ops: { rules: [] },
    general: { rules: [] },
  }[domainKey] || { rules: [] }

  return domain.rules || []
}

module.exports = { getDomainKey, getRules }
