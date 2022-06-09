<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>网页配置</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!--顶部按钮-->
      <el-row :gutter="10">

        <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="添加轮播图" placement="bottom" :enterable="false">
            <el-button type="primary" circle icon="el-icon-edit" @click="addDialogVisible=true"></el-button>
          </el-tooltip>
          <el-tooltip  class="item" effect="dark" content="删除轮播图" placement="bottom" :enterable="false">
            <el-button  type="danger" @click="close()" circle icon="el-icon-delete"></el-button>
          </el-tooltip>
        </el-col>
      </el-row>

      <!--列表区-->
      <el-table
        ref="multipleTable"
        :data="bannerList"
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
          prop="img"
          label="图片"
          width="300">
          <template slot-scope="scope">
            <el-image :src="scope.row.img"></el-image>
          </template>
        </el-table-column>

        <el-table-column
          prop="img"
          label="图片地址"
          width="421">
        </el-table-column>
        <el-table-column
          prop="url"
          label="跳转地址"
          width="421">
        </el-table-column>
        <el-table-column
          prop="weight"
          label="权重"
          width="100">
        </el-table-column>
      </el-table>

      <!--新增轮播图弹出框-->
      <el-dialog
        title="添加新用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed">
        <!--内容主体区-->
        <span>
          <el-form :model="addBanner" :rules="addBannerRules" ref="addBannerRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="图片" prop="img">
              <el-upload
                class="upload-demo"
                action="/api/oss/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleAvatarSuccess"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList" >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过40m</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="图片地址" prop="img">
              <el-input v-model="addBanner.img"></el-input>
            </el-form-item>

            <el-form-item label="跳转地址" prop="url">
              <el-input v-model="addBanner.url"></el-input>
            </el-form-item>
          </el-form>

          <el-form-item label="权重" prop="weight">
              <el-input v-model="addBanner.weight"></el-input>
          </el-form-item>

        </span>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addBannerList">确 定</el-button>
          </span>
      </el-dialog>

    </el-card>
  </div>

</template>

<script>
export default {
  data(){
    return{
      //轮播图列表
      bannerList:[],
      //新增轮播图弹出框
      addDialogVisible:false,
      //新增轮播图
      addBanner:{
        img:'',
        url:'',
        weight:0
      },
      //新增轮播图验证规则
      addBannerRules:{
        img: [{ required: true, message: '请输入上传图片', trigger: 'blur' }],
        url: [{ required: true, message: '请输入跳转地址', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入排序权重', trigger: 'blur' }]
      },
      fileList: [{name: '', url: ''}],
      selectionBannerList: {
        bannerIdList: []
      }
    }
  },
  created () {
    this.getBannerList()
  },
  methods:{
    getBannerList(){
      this.$axios.get("/api/admin/banner/banner-list").then(res=>{
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.bannerList = res.data.data
      })
    },
    addDialogClosed(){
      this.$refs.addBannerRef.resetFields()
    },
    handleSelectionChange(val) {
      for (let i in val) { // i为索引值
        this.selectionBannerList.bannerIdList[i] = val[i].id
      }
      console.log(this.selectionBannerList)
    },

    //移除列表
    handleRemove(file, fileList) {
      this.addBanner.img = ""
    },
    //点击列表
    handlePreview(file) {
      console.log(file.response.data)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleAvatarSuccess(res, file) {
      if (res.code !== 0) this.$message.error(res.msg)
      this.addBanner.img = res.data;
      this.$message.success("图片上传成功")
    },
    addBannerList(){
      this.$axios.post("/api/admin/banner/add-banner",this.addBanner).then(res=>{
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.$message.success("轮播图添加成功")
        this.getBannerList()
        this.addDialogVisible = false
      })
    },
    close() {
      this.$confirm('此操作将删除轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //删除用户
        this.$axios.post("/api/admin/banner/delete-banner",this.selectionBannerList).then(res=>{
          if (res.data.code === 0){
            //刷新页面
            this.getBannerList()
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
  }

}
</script>

<style scoped>

</style>
