<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/goods">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        isedit ? "修改商品信息" : "添加商品信息"
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区域 -->
    <el-card>
      <el-alert
        :title="isedit ? '修改商品信息' : '添加商品信息'"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :rules="addrules"
        ref="addform"
        :model="addform"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="active"
          :before-leave="beforeleave"
          @tab-click="tabclick"
        >
          <!-- 基本信息 -->

          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addform.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量（KG）" prop="goods_weight">
              <el-input type="number" v-model="addform.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addform.goods_number"></el-input>
            </el-form-item>
            <el-form-item class="el-label2" prop="goods_cat">
              <span slot="label">商品分类</span>
              <el-cascader
                ref="cas"
                v-model="list_goods_cat"
                :options="options"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                }"
                @change="casChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :key="i.attr_id"
              v-for="i in manyattr"
              :label="i.attr_name"
            >
              <el-checkbox-group v-model="i.attr_value">
                <el-checkbox
                  v-for="(s, b) in i.attr_vals"
                  :label="s"
                  border
                  :key="b"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="i.attr_name"
              :key="i.attr_id"
              v-for="i in onlyattr"
            >
              <el-input border v-model="i.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="uploadheaders"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-success="upsuccess"
              :on-error="uperror"
              list-type="picture"
              :multiple="true"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addform.goods_introduce"
              :options="editorOption"
            />
            <el-button type="primary" @click="subAddform">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览窗口 -->
      <el-dialog
        title="图片预览"
        :visible.sync="imgDialogVisible"
        width="50%"
        @close="handleClose"
      >
        <el-image
          style="width: 100%; height: 100%"
          :src="showImgUrl"
          :fit="fit"
        ></el-image>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      active: 0,
      list_goods_cat: [],
      addform: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: '',
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      options: [],
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      manyattr: [],
      onlyattr: [],
      fileList: [],
      imgDialogVisible: false,
      showImgUrl: '',
      fit: 'contain',
      uploadheaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      editorOption: {},
      editid: 0,
      isedit: false
    }
  },
  methods: {
    async initEditData (id) {
      const { data: ret } = await this.$http.get(`goods/${id}`)
      console.log(ret)
      this.addform.goods_name = ret.data.goods_name
      this.addform.goods_price = ret.data.goods_price
      this.addform.goods_weight = ret.data.goods_weight
      this.addform.goods_number = ret.data.goods_number
      this.addform.goods_introduce = ret.data.goods_introduce
      ret.data.attrs.forEach(item => {
        if (item.attr_sel === 'only') {
          this.onlyattr.push(item)
        }
        if (item.attr_sel === 'many') {
          item.attr_vals = item.attr_vals.split(',')
          item.attr_value = item.attr_value.split(',')
          this.manyattr.push(item)
        }
      })
      this.getCatData()
      this.list_goods_cat = ret.data.goods_cat.split(',').map(i => i * 1)
      this.addform.goods_cat = ret.data.goods_cat
    },
    async getCatData () {
      const { data: ret } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.options = ret.data
    },
    async getManyVals () {
      if (this.manyattr.length !== 0) return
      const { data: ret } = await this.$http.get(`categories/${this.list_goods_cat[2]}/attributes`, { params: { sel: 'many' } })
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      ret.data.forEach(item => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        item.attr_value = item.attr_vals
      })
      this.manyattr = ret.data
      console.log(this.manyattr)
      // console.log(ret)
    },
    async getOnlyVals () {
      if (this.onlyattr.length !== 0) return
      const { data: ret } = await this.$http.get(`categories/${this.list_goods_cat[2]}/attributes`, { params: { sel: 'only' } })
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      // ret.data.forEach(item => {
      //   item.attr_vals = [item.attr_vals]
      // })
      this.onlyattr = ret.data
      console.log(this.onlyattr)
      // console.log(ret)
    },
    handleRemove (file, fileList) {
      const filePath = file.response.data.tmp_path
      const i = this.addform.pics.findIndex(x => x.pic === filePath)
      this.addform.pics.splice(i, 1)
      console.log(this.addform)
    },
    handlePreview (file) {
      console.log(file)
      this.showImgUrl = file.url
      this.imgDialogVisible = true
    },
    upsuccess (response, file, fileList) {
      console.log(response, file, fileList)
      this.addform.pics.push({ pic: response.data.tmp_path })
      this.$message.success('上传成功')
    },
    uperror () {
      this.$message.error('上传失败')
    },
    handleClose () {
      this.showImgUrl = ''
    },
    // 提交表单
    async subAddform () {
      console.log(this.addform)
      console.log(this.list_goods_cat)
      this.$refs.addform.validate(val => {
        if (!val) {
          this.active = '0'
          return this.$message.error('请填写表单必填项')
        }
      })
      // 处理静态属性
      this.onlyattr.forEach(item => {
        this.addform.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        })
      })
      // 处理动态参数
      this.manyattr.forEach(item => {
        this.addform.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_value.join(',')
        })
      })
      if (this.isedit) {
        const { data: ret } = await this.$http.put(`goods/${this.id}`, this.addform)
        if (ret.meta.status !== 200) return this.$message.error(ret.meta.msg)
        this.$router.push('/goods')
        return this.$message.success('修改商品成功')
      } else {
        const { data: ret } = await this.$http.post('goods', this.addform)
        if (ret.meta.status !== 201) return this.$message.error(ret.meta.msg)
        this.$router.push('/goods')
        return this.$message.success('添加商品成功')
      }

      // console.log(this.fileList)
      // 处理图片信息
      // this.fileList.forEach(item => {
      //   this.addform.pics.push(
      //     { pic: item }
      //   )
      // })
      // console.log(this.addform)
    },
    casChange () {
      console.log(this.list_goods_cat)
      const abc = this.$refs.cas.getCheckedNodes()
      if (abc[0].level !== 3) {
        this.list_goods_cat = []
        return this.$message.error('只能选择三级分类')
      }
      this.addform.goods_cat = this.list_goods_cat.join(',')
    },
    tabclick () {
      if (this.active === '1') {
        this.getManyVals()
      } else if (this.active === '2') {
        this.getOnlyVals()
      } else {
        console.log(123)
      }
    },
    beforeleave (activeName, oldActiveName) {
      if (activeName !== '0') {
        if (this.list_goods_cat.length === 0) {
          this.$message.error('请先选择商品分类')
          return false
        }
      }
    }
  },
  mounted () {
    if (this.id) {
      this.isedit = true
      this.initEditData(this.id)
    } else {
      this.getCatData()
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
  width: 80%;
}
.el-label2 .el-form-item__content,
.el-label2 .el-form-item__label {
  line-height: 16px;
}
</style>
