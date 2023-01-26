// 上面这个代码处理过度动画（默认加上不用管）
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('sidenav-pinned')
    document.body.classList.add('ready')
  }, 200)
})

// ---------------------------------
//axios公共配置
axios.defaults.baseURL = 'http://ajax-api.itheima.net'


//----------------------------------------
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //如果有token情况，将token携带在请求头中(在拦截器中统一操作)
  const token = localStorage.getItem('user-token')
  if (token) {
    //如果有 携带在请求头
    config.headers.Authorization = token
  }




  return config;  //返回的是请求配置项
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});




// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么  2xx
  return response.data;
}, function (error) {
  // 对响应错误做点什么 4xx 5xx
  if(error.response.status === 401) {
    //token过期，需要将token信息，个人信息移除 重新登录
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-name')
    location.href = './login.html'
  }
  return Promise.reject(error);
});

//-----------------------------------------------
const toastBox = document.querySelector('#myToast')
const toast = new bootstrap.Toast(toastBox, {
  animation: true,
  autohide: true,
  delay: 3000
})

const tip = (msg) => {
  toastBox.querySelector('.toast-body').innerHTML = msg
  toast.show()
}



//用户名展示 和 用户名退出功能
const userName = document.querySelector('.navbar .font-weight-bold')
const logoutBtn = document.querySelector('#logout')
//登录或注册页，没有个人信息标签，无需展示名字
if (userName) {
  userName.innerHTML = localStorage.getItem('user-name')
}
if (logoutBtn) {
  logoutBtn.addEventListener('click',function() {
    localStorage.removeItem('user-name')
    localStorage.removeItem('user-token')
    //跳转是相对于运行页面的跳转
    location.href = './login.html'
  })
}