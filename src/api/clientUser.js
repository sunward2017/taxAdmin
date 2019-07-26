import fetch from '@/utils/fetch'

export function CustomerList(params) {
  return fetch({url: '/admin/CustomerList.action', method: "get", params: params})
}

export function CustomerModify(params) {
  return fetch({url: '/admin/CustomerModify.action', method: 'post', data: params})
}

export function AdminSelectAll(params){
  return fetch({url:'/admin/AdminSelectAll.action',method:'post',data:params})
}

export function GetCustomerUserTree(params){
  return fetch({url:'/admin/GetCustomerUserTree.action',method:'post',data:params})
}
