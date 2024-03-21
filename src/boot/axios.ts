import { boot } from 'quasar/wrappers'
import _axios, { AxiosInstance } from 'axios'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

const axios = _axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URI,
  headers: {
    'Content-Type': 'application/json',
  },
})

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  success => {
    return success
  }, 
  error => {
    const errorCode = error.response.data.code
    switch (errorCode) {
      case 'E006':
      case 'E003':
        console.log(errorCode + ` (${error.response.data.message})`)
        localStorage.setItem('token', '')
        window.location.href = '/';
        break;
      // case 401: {
      //   onError(status, '인증 실패입니다.');
      //   break;
      // }
      // case 403: {
      //   onError(status, '권한이 없습니다.');
      //   break;
      // }
      // case 404: {
      //   onError(status, '찾을 수 없는 페이지입니다.');
      //   break;
      // }
      // case 500: {
      //   onError(status, '서버 오류입니다.');
      //   break;
      // }
      default: {
        console.log(errorCode + ` (${error.response.data.message})`)
        // window.location.href = '/';
      }
    }
    return Promise.reject(error);
})


export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = _axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = axios
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios }
