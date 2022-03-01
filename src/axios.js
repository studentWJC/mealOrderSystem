import axios from 'axios'
import { VuesticPlugin } from 'vuestic-ui'
import router from './router'
import store from './store'

axios.defaults.baseURL="http://localhost:8081"

//前置拦截
axios.interceptors.request.use(config =>{
  console.log("前置拦截")
  return config
})

//后置拦截
axios.interceptors.response.use(response=>{
    const res = response.data
    console.log("===============")
    console.log(res)
    console.log("===============")

    if(res.code ===200){
      return response
    }else {//密码输入错误进入
      // Element.Message.error('错了哦，这是一条错误消息',{duration : 1*1000});
      return Promise.reject(response.data.msg)
    }

  },
  error =>{//用户不存在进入
    console.log(error)
    if(error.response.data){
      error.message = error.response.data.msg
      alert("用户不存在！")
      VuesticPlugin.Message.error('用户不存在')
    }

    if(error.response.status===401){
      store.commit("REMOVE_INFO")
      router.push({ name: 'login' })
      error.message = '请重新登录！';
    }
    // Element.Message.error(error.message,{duration : 1*1000});
    return Promise.reject(error)
  }
)
