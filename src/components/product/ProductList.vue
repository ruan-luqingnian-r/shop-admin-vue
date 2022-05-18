<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <!--搜索区-->
      <el-row :gutter="10">
        <el-col :span="8">
          <!--搜索框-->
<!--          <el-input placeholder="请输入商品名称" v-model="queryInfo.likeName" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="queryByLikeName()"></el-button>
          </el-input>-->
        </el-col>
        <el-col :span="8">
          <el-tooltip class="item" effect="dark" content="添加商品" placement="bottom" :enterable="false">
            <el-button type="primary" circle icon="el-icon-edit" @click="addDialogVisible=true"></el-button>
          </el-tooltip>

          <el-tooltip  class="item" effect="dark" content="下架商品" placement="bottom" :enterable="false">
            <el-button type="danger" circle icon="el-icon-delete"></el-button>
          </el-tooltip>

          <el-tooltip  class="item" effect="dark" content="上架商品" placement="bottom" :enterable="false">
            <el-button type="success" icon="el-icon-check" circle></el-button>
          </el-tooltip>
        </el-col>
      </el-row>

      <!--列表区-->
      <el-table
        ref="multipleTable"
        :data="productList"
        tooltip-effect="dark"
        border
        stripe
        style="width: 100%"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="title"
          label="商品名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="coverImg"
          label="封面图"
          width="120">
          <template slot-scope="scope">
            <el-image :src="scope.row.coverImg"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="detail"
          label="简介"
          width="120">

        </el-table-column>
        <el-table-column
          prop="primaryClassification"
          label="一级分类"
          width="150">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.primaryClassification === null">待分类</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="secondClassification"
          label="二级分类"
          width="150">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.secondClassification === null">待分类</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="thirdPrimaryClassification"
          label="三级分类"
          width="150">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.thirdPrimaryClassification === null">待分类</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="oldAmount"
          label="原价"
          width="120">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="活动价"
          width="120">
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存"
          width="120">
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看订单</el-button>
            <el-button type="text" size="small" @click="showEditDialog(scope.row)">修改积分</el-button>
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


      <!--新增商品弹出框-->
      <el-dialog
        title="添加新商品"
        :visible.sync="addDialogVisible"
        width="30%"
        :before-close="handleClose" :close="addDialogClosed">
        <!--内容主体区-->
        <span>
          <el-form :model="addProductFrom" :rules="addProductRules" ref="addProductRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品名" prop="title">
              <el-input v-model="addProductFrom.title"></el-input>
            </el-form-item>
          </el-form>
          <el-form :model="addProductFrom" :rules="addProductRules" ref="addProductRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="封面图" prop="coverImg">
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
          </el-form>

          <el-form :model="addProductFrom" :rules="addProductRules" ref="addProductRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品简介" prop="detail">
              <el-input v-model="addProductFrom.detail"></el-input>
            </el-form-item>
          </el-form>

          <el-form :model="addProductFrom" :rules="addProductRules" ref="addProductRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品原价" prop="amount">
              <el-input v-model="addProductFrom.amount"></el-input>
            </el-form-item>
          </el-form>

          <el-form :model="addProductFrom" :rules="addProductRules" ref="addProductRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品现价" prop="oldAmount">
              <el-input v-model="addProductFrom.oldAmount"></el-input>
            </el-form-item>
          </el-form>

          <el-form :model="addProductFrom" :rules="addProductRules" ref="addProductRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品库存" prop="stock">
              <el-input v-model="addProductFrom.stock"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addProduct">确 定</el-button>
          </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      /* productList:{
        title:'',
        coverImg:'',
        detail:'',
        primaryClassification:'',
        secondClassification:'',
        thirdPrimaryClassification:'',
        oldAmount:0,
        amount:0,
        stock:0

      }, */
      productList:[],
      total: 0,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        likeName: ''
      },
      addDialogVisible : false,
      addProductFrom :{
        title : '',
        coverImg : '',
        detail : '',
        oldAmount : 0,
        amount:0,
        stock:0
      },
      addProductRules:{
        title:[{ required: true, message: '请输入商品名', trigger: 'blur' }],
        coverImg:[{ required: true, message: '请上传商品图片', trigger: 'blur' }],
        detail:[{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
        oldAmount:[{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        amount:[{ required: true, message: '请输入商品优惠价', trigger: 'blur' }],
        stock:[{ required: true, message: '请输入商品库存', trigger: 'blur' }],

      },
      fileList: [{name: '', url: ''}],

    }
  },
  created () {
    this.getProductList()
  },
  methods:{
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
      this.addProductFrom.coverImg = res.data
      this.$message.success("图片上传成功")
    },
    //移除列表
    handleRemove(file, fileList) {
      this.addProductFrom.coverImg = ''
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.queryInfo.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.queryInfo.pageNum = val
      this.getProductList()
    },
    getProductList () {
      this.$axios.get('/api/admin/product/list', {
        params: this.queryInfo
      }).then(res => {
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.productList = res.data.data.current_data
        this.total = res.data.data.total_record
      })
    },
    addProduct(){
      this.$refs.addProductRef.validate(valid =>{
        if (!valid) return this.$message.error("请完善表单内容")
        //校验通过可发起请求
        this.$axios.post("/api/admin/product/add",this.addProductFrom).then(res=>{
          if (res.data.code !== 0) return this.$message.error(res.data.msg)
          this.$message.success("添加商品成功")
          this.getProductList()
          this.addDialogVisible = false
        })
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addProductRef.resetFields()
    },
    handleClose(){
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.addProductRef.resetFields()
          this.addDialogVisible = false
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>

<style scoped>

</style>
