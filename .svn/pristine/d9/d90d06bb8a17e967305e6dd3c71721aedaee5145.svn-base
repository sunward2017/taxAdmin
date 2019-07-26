import fetch from '@/utils/fetch'

export function login(username, password) {
  return fetch({
        url:'/admin/AdminLogin.action',
        method:"post",
        data: {
           account:username,
           password:password
        }   
     })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  })
}
