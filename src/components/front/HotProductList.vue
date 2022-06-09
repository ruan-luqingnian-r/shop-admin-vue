<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>网页配置</el-breadcrumb-item>
      <el-breadcrumb-item>热买商品配置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!--搜索区-->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-tooltip class="item" effect="dark" content="配置热销商品" placement="bottom" :enterable="false">
            <el-button type="primary" circle icon="el-icon-edit" @click="configHotProduct"></el-button>
          </el-tooltip>

          <el-tooltip  class="item" effect="dark" content="删除热销商品" placement="bottom" :enterable="false">
            <el-button type="danger" circle icon="el-icon-delete" @click="deleteHotProduct"></el-button>
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
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="title"
          label="商品名"
          width="130">
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
          width="170">
        </el-table-column>
        <el-table-column
          prop="primaryClassification"
          label="一级分类"
          width="100">
        </el-table-column>
        <el-table-column
          prop="secondClassification"
          label="二级分类"
          width="100">

        </el-table-column>
        <el-table-column
          prop="thirdPrimaryClassification"
          label="三级分类"
          width="100">
        </el-table-column>
        <el-table-column
          prop="state"
          label="商品状态"
          width="100">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.state === 1">未上架</el-tag>
            <el-tag type="success" v-if="scope.row.state === 0">已上架</el-tag>
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
            <el-button @click="handleClick(scope.row)" type="text" size="small">信息修改</el-button>
            <el-button v-if="scope.row.primaryClassification === null
            || scope.row.secondClassification === null
            || scope.row.thirdPrimaryClassification  === null" type="text" size="small" @click="showEditDialog(scope.row)">商品分类</el-button>
            <el-button @click="deleteProduct(scope.row)" style="color: #ff4400" type="text" size="small">删除商品</el-button>

          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

      <!--配置热门商品弹出框-->
      <el-dialog
        title="热门商品"
        :visible.sync="addDialogVisible"
        width="30%"
        :before-close="handleClose">
        <!--内容主体区-->
        <span>

          <el-form :model="product" :rules="productRules" ref="productRef" label-width="100px" class="demo-ruleForm">

            <el-form-item label="商品名" prop="title">
              <template>
                <el-select v-model="title" filterable placeholder="请输入商品名" :clearable="true" @change="handleChange(title)" @clear="close">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                 </el-select>
              </template>
            </el-form-item>

            <el-form-item label="商品简介" prop="detail">
              <el-input v-model="product.detail" disabled></el-input>
            </el-form-item>

            <el-form-item label="商品原价" prop="amount">
              <el-input v-model="product.amount" disabled></el-input>
            </el-form-item>

            <el-form-item label="商品现价" prop="oldAmount">
              <el-input v-model="product.oldAmount" disabled></el-input>
            </el-form-item>

            <el-form-item label="商品库存" prop="stock">
              <el-input v-model="product.stock" disabled></el-input>
            </el-form-item>
          </el-form>
        </span>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="setTopSeller">设为热销商品</el-button>
          </span>
      </el-dialog>

    </el-card>

  </div>
</template>

<script>
export default {
  data(){
    return{
      total: 0,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        likeName: ''
      },
      productList:[],
      productIdList:[],
      addDialogVisible : false,
      product:{
        id:'',
        title:'',
        coverImg:'',
        detail:'',
        primaryClassification:'',
        secondClassification:'',
        thirdPrimaryClassification:'',
        oldAmount:0,
        amount:0,
        stock:0
      },
      productRules:{
        title:[{ required: true, message: '请输入商品名', trigger: 'blur' }],
        coverImg:[{ required: true, message: '请上传商品图片', trigger: 'blur' }],
        detail:[{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
        oldAmount:[{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        amount:[{ required: true, message: '请输入商品优惠价', trigger: 'blur' }],
        stock:[{ required: true, message: '请输入商品库存', trigger: 'blur' }],
      },
      options: [],
      title: '',
      state:0,
      rows:0

    }
  },
  created () {
    this.getHotProductList()
  },
  methods : {
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
    getHotProductList(){
      this.$axios.get('/api/admin/product/hot-list', {
        params: this.queryInfo
      }).then(res => {
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.productList = res.data.data.current_data
        this.total = res.data.data.total_record
      })
    },
    // 监听添加用户对话框的关闭事件
    handleClose(){
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.productRef.resetFields()
          this.addDialogVisible = false
          done();
        })
        .catch(_ => {});
    },
    getProductList () {
      this.$axios.get('/api/admin/product/list?pageNum=1&pageSize=-1').then(res => {
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.options = res.data.data.current_data
      })
    },
    configHotProduct(){
      this.getProductList()
      this.addDialogVisible=true
    },
    handleChange(title){
      this.$axios.post('/api/admin/product/getInfo/' + title).then(res=>{
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.product = res.data.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(val)
      for (let i in val) { // i为索引值
        this.productIdList[i] = val[i].id
      }
    },
    setTopSeller(){
      this.$axios.post('/api/admin/product/updateState/'+this.product.id+'?state=0').then(res=>{
        if (res.data.code !== 0) return this.$message.error(res.data.msg)
        this.$message.success("成功修改" + res.data.data + "个数据")
        this.getHotProductList()
        this.addDialogVisible = false
        this.$refs.productRef.resetFields()
      })
    },
    close(){
      this.product =[]
    },
    deleteHotProduct(){

      for (let i in this.productIdList){
        this.$axios.post('/api/admin/product/updateState/'+this.productIdList[i]+'?state=1').then(res=>{
          if (res.data.code !== 0) return this.$message.error(res.data.msg)
        })
        this.rows++
      }
      this.$message.success("成功修改" + this.rows + "个数据")
      this.getHotProductList()
      this.addDialogVisible = false
      this.$refs.productRef.resetFields()

    }

  }

}
</script>

<style scoped>

</style>
