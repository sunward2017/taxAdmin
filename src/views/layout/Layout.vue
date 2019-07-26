<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="logo">
      <!--<div class="logo_background"></div>-->
      <img :src="img_logo" width="30" height="30"  class="logo_pic"/><span class="title">梧斯源服务机器人管理系统</span>
      <div class="nav_bar">欢迎您:{{customer}},今天：{{date}}
        <span @click="logout" style="margin-left:25px;">登出</span></div>
      <!--data这里应该是输出一个函数-->
      <!-- <router-link class='inlineBlock' to="/"></router-link> -->

    </div>
    <div class="sidebar-wrapper">
      <Sidebar class="sidebar-container"></Sidebar>
    </div>
    <div class="main-container">
      <Navbar></Navbar>
      <AppMain></AppMain>
    </div>
  </div>
</template>


<script>
  import { Navbar, Sidebar, AppMain } from '@/views/layout'
  import img_logo from '@/assets/TaxAdmin/wsylogo.png'
  import moment from 'moment'
  import { getAccount } from '@/utils/auth'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    },
    data(){

      return{
        img_logo,
        customer:'',
        date:"",
        aaa:'',
        b:'bbb',
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()  // 为了重新实例化vue-router对象 避免bug
        })
      },

      time(){
        setInterval(this.setTime,1000);
      },

      setTime(){
        let time = new String();
        var myDate = new Date();
        myDate.getYear();        //获取当前年份(2位)
        myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        myDate.getDate();        //获取当前日(1-31)
        myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
        myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
        myDate.getHours();       //获取当前小时数(0-23)
        myDate.getMinutes();     //获取当前分钟数(0-59)
        myDate.getSeconds();     //获取当前秒数(0-59)
        myDate.getMilliseconds();    //获取当前毫秒数(0-999)
        myDate.toLocaleDateString();     //获取当前日期
        time = myDate.toLocaleTimeString();     //获取当前时间
        this.date = time;
//        console.log(time);
      },

  },
    created(){
      this.time();
    },



    mounted(){
      this.customer = JSON.parse(unescape(getAccount())).account;
//      this.date=moment().format('LLLL');
      console.log(this.date);
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .logo{
    background: url("../../assets/TaxAdmin/bg_nav.jpg");
    width: 100%;
    height: 80px;
    color: #ffffff;
    /*padding-left:50px;*/
    &>*{
      float:left;
    }
    .logo_background{
      width: 220px;
      height: 80px;
      background-color: #3fb4c6;
    }
    .logo_pic{
      margin-left:30px;
      margin-top:28px;
      margin-right:20px;
    }

    .title{
      line-height: 80px;
      color:#fff;
      font-size:25px;
      font-weight:bold;
    }
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.hideSidebar {
      .sidebar-wrapper {
        transform: translate(-180px, 0);
        .sidebar-container {
          transform: translate(172px, 0);
        }
        &:hover {
          transform: translate(0, 0);
          .sidebar-container {
            transform: translate(0, 0);
          }
        }
      }
      .main-container {
        margin-left: 40px;
      }
    }
    .nav_bar{
      position:absolute;
      top:50px;
      right:40px;
    }
    .sidebar-wrapper {
      width: 220px;
      position: fixed;
      top: 80px;
      bottom: 0;
      left:0;
      z-index: 1001;
      overflow: hidden;
      transition: all .28s ease-out;

    }
    .sidebar-container {
      background-color: #262a33;
      transition: all .28s ease-out;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: -17px;
      overflow-y: scroll;
      border-radius: 0px !important;
    }
    .main-container {
      min-height: 100%;
      transition: all .28s ease-out;
      margin-left: 220px;
    }
  }
</style>
