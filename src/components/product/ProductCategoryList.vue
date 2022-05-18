<template>

  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <!--顶部按钮-->
      <el-row :gutter="10">

        <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="添加顶级分类" placement="bottom" :enterable="false">
            <el-button type="primary" circle icon="el-icon-edit" @click="addDialogVisible=true"></el-button>
          </el-tooltip>
          <el-tooltip  class="item" effect="dark" content="删除分类" placement="bottom" :enterable="false">
            <el-button  type="danger" @click="close()" circle icon="el-icon-delete"></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!--分类列表-->
      <el-tree
        :data="categoryList"
        :props="defaultProps"
        :highlight-current="true"
        accordion
        :expand-on-click-node="false"
        @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">

        <span>{{ node.label }}</span>

        <span style="margin-left: 100px" v-if="data.childProductCategory !== null">
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            新增子分类
          </el-button>
        </span>
      </span>
      </el-tree>

      <!--新增顶级分类弹出框-->
      <el-dialog
        title="新增分类"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed">
        <!--内容主体区-->

          <el-form :model="addCategory" :rules="addCategoryRules" ref="addCategoryRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="primaryClassification">
              <el-input v-model="addCategory.primaryClassification"></el-input>
            </el-form-item>
          </el-form>


        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addProductCategory">确 定</el-button>
          </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //新增轮播图弹出框
      addDialogVisible:false,
      addCategory:{
        parentPrimaryClassificationId:0,
        primaryClassification:''
      },
      deleteCategory:{
        parentPrimaryClassificationId:0
      },
      defaultProps: {
        children: 'childProductCategory',
        label: 'primaryClassification'
      },

      categoryList:[{
        primaryClassification:'',
        childProductCategory:[{
          primaryClassification:''
        }]
      }],
      addCategoryRules:{
        primaryClassification: [{ required: true, message: '请输入分类', trigger: 'blur' }],
      }
    };
  },
  methods: {
    handleNodeClick(data) {
      this.deleteCategory.parentPrimaryClassificationId = data.primaryClassificationId
    },
    getCategoryList(){
      this.$axios.get("/api/admin/productCategory/category-list").then(res=>{
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.categoryList = res.data.data
        //console.log(this.categoryList)
      })
    },
    addDialogClosed(){
      this.$refs.addCategoryRef.resetFields()
    },
    addProductCategory(){
      this.$refs.addCategoryRef.validate(valid=>{
        if (!valid) return this.$message.error("请完善参数")
        //校验完成后发起请求
        this.$axios.post("/api/admin/productCategory/category-add",this.addCategory).then(res=>{
          if (res.data.code !== 0) return this.$message.error(res.data.msg)
          this.getCategoryList()
          this.addDialogVisible = false
          return this.$message.success(res.data.data)
        })
      })
    },
    append(data){
      this.addCategory.parentPrimaryClassificationId = data.primaryClassificationId
      //打开弹框
      this.addDialogVisible = true
    },
    close(){
      this.$confirm('此操作将删除改分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.$axios.post("/api/admin/productCategory/category-delete",this.deleteCategory).then(res=>{
          if (res.data.code !== 0) return this.$message.error(res.data.msg)
          this.$message.success("删除分类成功")
          this.getCategoryList()
        })
      })
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>

<style scoped>

</style>
