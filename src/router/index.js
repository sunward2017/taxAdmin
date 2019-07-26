import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');

/* dashboard */
const dashboard = _import('dashboard/index');

/* robotManage */
const register = _import('robotManage/register');
const repair = _import('robotManage/repair');
const sale = _import('robotManage/sale');
const loan = _import('robotManage/loan');
const questions = _import('robotManage/questions');
const robotHot = _import('robotManage/robotHot');
const robotVideo = _import('robotManage/robotVideo');
const robotGroup = _import('robotManage/robotGroup');
const robotBgPreinstall = _import('robotManage/robotBgPreinstall');

/* userManage */
const sysUsers = _import('userManage/sysUsers');
const clientUsers = _import('userManage/clientUsers');
const clientUserRegister = _import('userManage/clientUserRegister');

/* contentManage */
const videoList = _import('contentManage/videoList');
const hotBigList = _import('contentManage/hotBigList');
const hotDetail = _import('contentManage/hotDetail');
const QAListAdd = _import('contentManage/QAListAdd');
const QAType = _import('contentManage/QAType');
const QAList = _import('contentManage/QAList');
const MapMange = _import('contentManage/MapMange');
const VipMange = _import('contentManage/VipMange');
const robotBg = _import('contentManage/robotBg');


/* basicInfoManage */
const customersList = _import('basicInfoManage/customersList');
const robotsOfCustomer = _import('basicInfoManage/robotsOfCustomer');
//const basicQAList = _import('basicInfoManage/basicQAList')
const version = _import('basicInfoManage/version');
const emotionList =  _import('basicInfoManage/emotionList');

/* permissionManage */
const operatorList = _import('permissionManage/operatorList');
const userRoleList = _import('permissionManage/userRoleList');


/* error page */
const Err404 = _import('404');

/* demo page */
const Form = _import('page/form');
const Table = _import('table/index');

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta : `{ role: ['admin'] }`  will control the page role
  **/
export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  }
];
//构造函数创建new Router，接受routes 参数
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

//在children底下，path是不带/的 name是面包屑？
export const asyncRouterMap = [
  {
    path: '/robotManage',
    component: Layout,
    redirect: 'noredirect',
    name: '机器人管理',
    icon: 'zujian',
    children: [
      { path: 'register', component: register, name: '机器人登记', icon: 'zonghe',meta: { role: ['system','admin']} },
      { path: 'questions', component: questions, name: '机器人问题', icon: 'zonghe',meta: { role: ['system','admin']} },
      { path: 'robotVideo', component: robotVideo, name: '机器人视频', meta: { role: ['admin','common','system'] }},
      { path: 'robotHot', component: robotHot, name: '机器人热点', meta: { role: ['admin','common','system'] }},
      { path: 'robotGroup', component: robotGroup, name: '机器人分组', meta: { role: ['admin','common','system'] }},
      { path: 'robotBgPreinstall', component: robotBgPreinstall, name: '机器背景预设', meta: { role: ['admin','common','system'] }},
    ]
  },
  {
    path: '/contentManage',
    component: Layout,
    redirect: 'noredirect',
    name: '内容管理',
    icon: 'tubiao',
    children: [
      { path: 'videoList', component: videoList, name: '视频维护', meta: { role: ['admin','common','system'] }},
      { path: 'hotBigList', component: hotBigList, name: '热点大类', meta: { role: ['admin','common','system'] }},
      { path: 'hotDetail', component: hotDetail, name: '热点详情', meta: { role: ['admin','common','system'] }},
      { path: 'vipMange', component: VipMange, name: 'VIP管理', meta: { role: ['admin','common','system'] }},
      { path: 'QAType', component: QAType, name: '问答库类别', meta: { role: ['admin','common','system'] }},
      { path: 'QAListAdd', component: QAListAdd, name: '问答库维护', meta: { role: ['admin','common','system'] }},
      { path: 'mapMange', component: MapMange, name: '地图管理', meta: { role: ['admin','common','system'] }},
      { path: 'robotBg', component: robotBg, name: '机器人背景', meta: { role: ['admin','common','system'] }},
    ]
  }, {
    path: '/userManage',
    component: Layout,
    redirect: 'noredirect',
    name: '用户管理',
    icon: 'tubiao',
    meta:{role:['system']},
    children: [
      { path: 'clientUserRegister', component: clientUserRegister, name: '客户信息登记', meta: { role: ['system'] }},
      { path: 'clientUsers', component: clientUsers, name: '操作员管理', meta: { role: ['system'] }},
      // { path: 'clientUserRegister', component: clientUserRegister, name: '客户信息登记', meta: { role: ['admin','common','system'] }},
      // { path: 'clientUsers', component: clientUsers, name: '操作员管理', meta: { role: ['admin','common','system'] }},
    ]
  },
  {
    path: '/basicInfoManage',
    component: Layout,
    redirect: 'noredirect',
    name: '基础信息管理',
    icon: 'tubiao',
    children: [
      { path: 'emotionList', component: emotionList, name: '表情包', meta: { role: ['admin','common','system'] }},
      { path: 'version', component: version, name: '机器人软件维护', meta: { role: ['admin','system','common'] }},
    ]
  },
  // {
  //   path: '/permissionManage',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: '权限管理',
  //   icon: 'tubiao',
  //   children: [
  //     { path: 'operatorList', component: operatorList, name: '客户操作员', meta: { role: ['admin'] }},
  //     { path: 'userRoleList', component: userRoleList, name: '角色', meta: { role: ['admin'] }}
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
];
