import axios from 'axios'
import auth from './auth'

const instance = axios.create({
  baseURL: 'http://192.168.141.17:8889/',
  // baseURL: 'http://api.leenty.com/'
  timeout: 1000
})

instance.interceptors.request.use(config => {
  config.headers = {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded'
  }
  return config
}, Promise.reject)

instance.interceptors.response.use(({data}) => {
  if (data.success && data.token) {
    auth.setToken(data.token)
  }
  return data
}, Promise.reject)

const makeResource = function (url, baseData = {}) {
  const resuorce = function (methods, resData = {}) {
    const data = Object.assign({}, baseData, resData)
    // 替换参数
    url = url.replace(/:([A-z]+)/g, (str, p1) => data[p1])
    return instance[methods](url, data)
  }
  return {
    get get () {
      return resuorce.bind(this, 'get')
    },
    get post () {
      return resuorce.bind(this, 'post')
    },
    get put () {
      return resuorce.bind(this, 'put')
    },
    get delete () {
      return resuorce.bind(this, 'delete')
    }
  }
}

export default makeResource
