import axios from 'axios'

function get (url, params = {}, options = {}) {
  return new Promise((resolve, reject) => {
    return axios.get(url, {
      params,
      ...options,
    }).then(res => {
      const {
        errno,
        errmsg,
        data,
      } = res.data
      if (!errno) {
        resolve(data)
      } else {
        reject(errmsg)
      }
    }).catch(e => {
      reject(e.message)
    })
  })
}

const install = function (Vue) {
  Vue.prototype.$get = get
  Vue.prototype.$apiError = function (errMsg) {
    this.$notify.error({
      title: '接口请求错误',
      message: errMsg
    });
  } 
}

export default {
  get,
  install,
}