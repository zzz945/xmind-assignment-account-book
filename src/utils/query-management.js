/**
 * 更新url参数
 * @param {object} vm vue实例
 * @param {object} data 新参数
 * @param {string} scope 命名空间
 */
function dataToQuery (vm, data = {}, scope)  {
  if (!scope) {
    data = {
      ...vm.$route.query,
      ...data,
    }
  } else {
    data = {
      ...vm.$route.query,
      [scope]: JSON.stringify(data),
    }
  }

  vm.$router.replace({
    query: data
  }).catch(() => {})
}

/**
 * 解析url参数
 * @param {object} vm vue实例
 * @param {string} scope 命名空间
 * @return {object} url参数
 */
function queryToData (vm, scope)  {
  if(!scope) {
    return vm.$route.query
  } else {
    const data = vm.$route.query[scope]
    return data ? JSON.parse(data) : {}
  }
}

const install = function (Vue) {
  Vue.prototype.$dataToQuery = function (data, scope) {
    dataToQuery(this, data, scope)
  }
  Vue.prototype.$queryToData = function (scope) {
    return queryToData(this, scope)
  }
}

export default {
  install
}
