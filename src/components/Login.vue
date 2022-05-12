<template>
  <div class="login_container">
    登陆组件
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="公司logo">
      </div>
      <!--登陆表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="userName">
          用户名：
          <el-input v-model="loginForm.userName"
                    placeholder="登录账户为手机号"
                    suffix-icon="el-icon-user">

          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="passWord">
          密码：
          <el-input v-model="loginForm.passWord"
                    placeholder="请输入密码"
                    suffix-icon="el-icon-key"
                    type="password">
          </el-input>
        </el-form-item>

        <el-row class="bus">
          <!--登陆-->
          <el-button @click="login" type="primary" round>登录</el-button>
          <!--刷新-->
          <el-button @click="resetLoginForm" round>重置</el-button>
        </el-row>

      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //登录数据绑定对象
      loginForm:{
        userName:'',
        passWord:''
      },
      //绑定输入框验证规则
      loginFormRules:{
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        passWord:[
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    //点击重置按钮
    resetLoginForm(){
      //console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      // this.$refs.loginFormRef.validate(valid =>{
      //   //console.log(valid);
      //   if (!valid) return;
      //   const result = this.$http.post('/api/admin/adminUser/login',this.loginForm);
      //   console.log(result);
      // });
      this.$refs.loginFormRef.validate( valid =>{
        if (!valid) return this.$message.error("请输入账号")
        this.$axios.post('/api/admin/adminUser/login',this.loginForm)
          .then(res => {
            if (res.data.code !== 0) return this.$message.error(res.data.msg)
            this.$message.success('登录成功')
            //保存token信息
            window.sessionStorage.setItem("token",res.data.data)
            //跳转到登录首页
            this.$router.push("/home")
          })
          .catch(err => {
            console.log(err)
          })
      })
    }
  }
}
</script>

<style lang="css" scoped>
.login_container{
  background-color: #004da2;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 6px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box>img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.bus{
  display: flex;
  justify-content: flex-end;
}
.login_form{
  padding: 0 20px;
  position: absolute;
  top: 40px;
  width: 100%;
  box-sizing: border-box;
}

</style>
