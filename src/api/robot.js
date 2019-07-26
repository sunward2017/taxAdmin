import fetch from '@/utils/fetch'

export function robotRegisterList(params) {
    return fetch({url: '/admin/RobotRegisterList.action', method: "get", params: params})
}

export function robotSaleList(params) {
    return fetch({url: '/admin/RobotSaleList.action', method: "get", params: params})
}

export function robotRepairList(params) {
    return fetch({url: '/admin/RobotRepairList.action', method: "get", params: params})
}

export function robotLoanList(params) {
    return fetch({url: '/admin/RobotLoanList.action', method: "get", params: params})
}

export function saveRegisterRobot(params) {
    return fetch({url: '/admin/RobotRegisterModify.action', method: 'post', data: params})
}

export function saveSaleRobot(params) {
    return fetch({url: '/admin/RobotSaleListModify.action', method: 'post', data: params})
}

export function saveRepairRobot(params) {
    return fetch({url: '/admin/RobotRepairModify.action', method: 'post', data: params})
}

export function saveLoanRobot(params) {
    return fetch({url: '/admin/RobotLoanModify.action', method: 'post', data: params})
}

export function deleteRegisterRobot(params) {
    return fetch({url: '/admin/RobotRegisterDelete.action', method: 'post', data: params})
}

export function deleteSaleRobot(params) {
    return fetch({url: '/admin/RobotSaleListDelete.action', method: 'post', data: params})
}

export function deleteRepairRobot(params) {
    return fetch({url: '/admin/RobotRepairDelete.action', method: 'post', data: params})
}

export function deleteLoanRobot(params) {
    return fetch({url: '/admin/RobotLoanDelete.action', method: 'post', data: params})
}

export function getRobotLogList(params){
    return fetch({url: '/admin/LogFileList.action', method: 'post', data: params})
}

export function SetRobotCurrentQA(params){
  return fetch({url: '/admin/SetRobotCurrentQA.action', method: 'post', data: params})
}

export function GetRobotCurrentQA(params){
  return fetch({url: '/admin/GetRobotCurrentQA.action', method: 'post', data: params})
}

export function GetRobotEmoticon(params){
  return fetch({url:'/admin/GetRobotEmoticon.action',method:'post',data:params})
}

export function GetHotBigType(params){
  return fetch({url:'/admin/GetHotBigType.action',method:'post',data:params})
}

export function ModifyHotBigType(params){
  return fetch({url:'/admin/ModifyHotBigType.action',method:'post',data:params})
}

export function GetRobotBg(params){
  return fetch({url:'/admin/GetRobotBg.action',method:'post',data:params})
}

export function SetRobotVideoInfo(params){
  return fetch({url:'/admin/SetRobotVideoInfo.action',method:'post',data:params})
}

export function GetRobotVideoList(params){
  return fetch({url:'/admin/GetRobotVideoList.action',method:'post',data:params})
}

export function SetRobotBigType(params){
  return fetch({url:'/admin/SetRobotBigType.action',method:'post',data:params})
}

export function GetRobotBigType(params){
  return fetch({url:'/admin/GetRobotBigType.action',method:'post',data:params})
}
