import fetch from '@/utils/fetch'

export function QATypeList(params) {
    return fetch({url: '/admin/QATypeList.action', method: "get", params: params})
}

export function saveQAType(params) {
    return fetch({url: '/admin/QATypeModify.action', method: 'post', data: params})
}

export function QATypeDelete(params){
    return fetch({url: '/admin/QATypeDelete.action', method: 'post', data: params})
}

export function saveQA(params) {
    return fetch({url: '/admin/QAModify.action', method: 'post', data: params})
}

export function QAList(params) {
    return fetch({url: '/admin/QAList.action', method: "get", params: params})
}

export function QAInfoTree(params){
	return fetch({url: '/admin/QAInfoTree.action', method: "get", params: params})
}

export function QAInfoModify(params){
	return fetch({url: '/admin/QAInfoModify.action', method: "post", params: params})
}

export function QAInfoDelete(params){
	return fetch({url: '/admin/QAInfoDelete.action', method: "post", params: params})
}

