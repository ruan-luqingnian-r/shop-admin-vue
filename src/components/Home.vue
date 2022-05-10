<template>
  <div>
    首页
    <el-button type="info" round @click="logout">注销</el-button>
  </div>
</template>

<script>
export default {
  methods:{
    logout(){
      //情况token
      window.sessionStorage.clear()
      //跳转登录页面
      this.$router.push("/login")
    }
  }
}
</script>

<style lang="css" scoped>

</style>
