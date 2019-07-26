<template>
  <div class="custom">
    <template v-for="item in routes">
      <!--item.hidden&&item.noDropdown&&item.children.length>0三种情况有一种为假，就执行router-link-->
      <router-link v-if="!item.hidden&&item.noDropdown&&item.children.length>0" :to="item.path+'/'+item.children[0].path">
        <el-menu-item :index="item.path+'/'+item.children[0].path">
          <icon-svg v-if='item.icon' :icon-class="item.icon" />
          {{item.children[0].name}}
        </el-menu-item>
      </router-link>
      <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden">
        <template slot="title">
          <!--标识符-->
          <icon-svg v-if='item.icon' :icon-class="item.icon" />
          <!--大分类：机器人管理，内容管理，基础信息管理-->
          {{item.name}}
        </template>
        <template v-for="child in item.children" v-if='!child.hidden'>
          <!--递归调用自己？v-if 和v-else-->
          <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
          <router-link v-else class="menu-indent" :to="item.path+'/'+child.path">
            <el-menu-item :index="item.path+'/'+child.path">
              {{child.name}}
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  },
//  methods: {
//    print(){
//      console.log("SidebarItem");
//      console.log(this.routes);
//    }
//  },
//  mounted(){
//    this.print();
//  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.svg-icon {
  margin-right: 10px;
}
.hideSidebar .menu-indent{
  display: block;
  text-indent: 10px;
}
  .custom .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active{
    background:#7eb345;
  }
.custom .el-menu--dark:hover .el-submenu:hover .el-menu:hover .el-menu-item:hover {
  background:#7eb345;
}
</style>

