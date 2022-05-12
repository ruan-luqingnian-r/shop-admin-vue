<template>

    <el-container class="home-container">

      <!--头部区域-->
      <el-header>
        <div>
          <img src="../assets/mell-logo.png" alt="logo">
          <span>超级商城后台管理系统</span>
        </div>
        <el-button type="info" round @click="logout">注销</el-button>
      </el-header>
      <el-container>

        <!--侧边栏-->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#ffffff"
            active-text-color="rgb(64,158,255)"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath">
            <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item style="font-size: small" :index="'/' + subitem.path" v-for="subitem in item.children"
                            :key="subitem.id"
                            @click="saveNavState('/' + subitem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subitem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--页面区域-->
        <el-main>
          <!--路由占位符-->
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>

</template>

<script>
export default {
  data(){
    return{
      //左侧菜单数据
      menulist:[
        {id:101,authName:"用户管理",path:"user",children:[{
            id:1011,authName:"用户列表",path:"user",
          }]},
        {id:102,authName:"网页配置",path:"front",children:[{
            id:1021,authName:"轮播图",path:"front",
          },{
            id:1022,authName:"新品上线",path:"front",
          },{
            id:1023,authName:"热卖商品",path:"front",
          }]},
        {id:103,authName:"商品管理",path:"goods",children:[{
            id:1031,authName:"商品列表",path:"goods",
          },{
            id:1032,authName:"分类参数",path:"goods",
          },{
            id:1033,authName:"商品分类",path:"goods",
          }]},
        {id:104,authName:"订单管理",path:"orders",children:[{},{}]},
        {id:105,authName:"数据统计",path:"reports",children:[{},{}]},
      ],
      iconObj:{
        '101':'el-icon-user',
        '102':'el-icon-shopping-cart-full',
        '103':'el-icon-goods',
        '104':'el-icon-document',
        '105':'el-icon-data-line',
      },
      isCollapse:false,
      //被激活（高亮）的地址
      activePath:''
    }
  },

  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods:{
    logout(){
      //情况token
      window.sessionStorage.clear()
      //跳转登录页面
      this.$router.push("/login")
    },
    //点击收起侧边栏
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    //保存二级菜单激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="css" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  padding-left: 60px;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.el-header>div>img{
  width: 70px;
  height: 75px;
}
.el-header>div{
  display: flex;
  align-items: center;
}
.el-header>div>span{
  padding-left: 65px;
}

.el-footer {
  background-color: #f0f0f0;
  color: #000000;
  text-align: center;
  font-size: 5px;
  height: 10px;
}

.el-aside {
  background-color: #333744;
  color: #ffffff;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #f0f0f0;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.el-menu{
  border-right: none;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
