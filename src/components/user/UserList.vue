<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <!--搜索区-->
      <el-row :gutter="10">
        <el-col :span="8">
          <!--搜索框-->
          <el-input placeholder="请输入用户名" v-model="queryInfo.likeName" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="queryByLikeName()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-tooltip class="item" effect="dark" content="添加用户" placement="bottom" :enterable="false">
            <el-button type="primary" circle icon="el-icon-edit" @click="addDialogVisible=true"></el-button>
          </el-tooltip>

          <el-tooltip  class="item" effect="dark" content="删除用户" placement="bottom" :enterable="false">
            <el-button @click="close()" type="danger" circle icon="el-icon-delete"></el-button>
          </el-tooltip>

          <el-tooltip  class="item" effect="dark" content="启用用户" placement="bottom" :enterable="false">
            <el-button @click="open()" type="success" icon="el-icon-check" circle></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!--列表区-->
      <el-table
        ref="multipleTable"
        :data="userList"
        tooltip-effect="dark"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" fixed width="100"></el-table-column>
        <el-table-column
          prop="id"
          label="用户id"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="120">
          <template slot-scope="scope">
            <el-tag color="#FFC0CBFF" type="info" :hit="false" effect="dark" v-if="scope.row.sex === 0">女</el-tag>
            <el-tag type="success" effect="dark" v-if="scope.row.sex === 1">男</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="points"
          label="积分"
          width="120">
        </el-table-column>
        <el-table-column
          prop="mail"
          label="账号"
          width="300">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="isDelete"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-tag type="" effect="dark" v-if="scope.row.isDelete === 0">启用</el-tag>
            <el-tag type="info" effect="dark" v-if="scope.row.isDelete === 1">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      <!--弹出框-->
      <el-dialog
        title="添加新用户"
        :visible.sync="addDialogVisible"
        width="30%">
        <!--内容主体区-->
        <span>
          <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="addFrom.name"></el-input>
            </el-form-item>
          </el-form>
          <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号" prop="mail">
              <el-input v-model="addFrom.mail"></el-input>
            </el-form-item>
          </el-form>

          <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="密码" prop="pwd" >
              <el-input type="password" v-model="addFrom.pwd" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="再次确认" prop="pwdAgain">
              <el-input type="password" v-model="addFrom.pwdAgain" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

        </span>
          <!--底部区域-->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
          </span>
      </el-dialog>

    </el-card>


  </div>
</template>

<script>
export default {
  data(){
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.addFrom.pwdAgain !== '') {
          this.$refs.addFromRef.validateField('pwdAgain');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addFrom.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      // 获取用户列表参数
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        likeName: ''
      },
      userList: [],
      total: 0,
      selectionUserList: {
        userIdList: []
      },
      // 添加用户的对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addFrom: {
        headImg: 'https://ruan-1024shop-img.oss-cn-beijing.aliyuncs.com/user/avatar/2021/07/28/125bbb6c1c804028bcbe474b211b2684.jpg',
        mail: '',
        name: '',
        pwd: '',
        pwdAgain: '',
        sex: 0,
        slogan: '人生需要动态规划，学习需要贪心算法'
      },
      // 添加用户表单数据
      addFromRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 0, max: 12, message: '长度在 0 到 12 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
        ],
        pwdAgain: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 0, max: 12, message: '长度在 0 到 12 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.$axios.get('/api/admin/adminUser/user-list', {
        params: this.queryInfo
      }).then(res => {
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.userList = res.data.data.current_data,
        this.total = res.data.data.total_record
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(val)
      for (let i in val) { // i为索引值
        this.selectionUserList.userIdList[i] = val[i].id
      }
    },
    handleClick(row) {
      console.log(row.id);
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.queryInfo.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.queryInfo.pageNum = val
      this.getUserList()
    },
    close() {
      this.$confirm('此操作将停用该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //删除用户
        this.$axios.post("/api/admin/adminUser/user-delete",this.selectionUserList).then(res=>{
          if (res.data.code === 0){
            //刷新页面
            this.getUserList()
            return this.$message.success("成功删除" + res.data.data + "条数据")
          }else {
            return this.$message.error(res.data.msg)
          }
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    open() {
      this.$confirm('此操作将重新该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //启用
        this.$axios.post("/api/admin/adminUser/user-open",this.selectionUserList).then(res=>{
          if (res.data.code === 0){
            //刷新页面
            this.getUserList()
            return this.$message.success("成功启用" + res.data.data + "条数据")
          }else {
            return this.$message.error(res.data.msg)
          }
        })
        this.$message({
          type: 'success',
          message: '启用成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    queryByLikeName(){
      this.$axios.get("/api/admin/adminUser/select-user-like-name",{
        params:this.queryInfo
      }).then(res=>{
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.userList = res.data.data.current_data
        this.total = res.data.data.total_record
      })
    }
  }
}
</script>

<style lang="css" scoped>
.el-tag--dark.el-tag--info{
  border-color: #FFC0CBFF;

}

</style>
