<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="catopt">
        <el-col
          ><span>选择商品分类：</span>
          <el-cascader
            ref="cas"
            v-model="cat_pid"
            :options="options"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              emitPath: false,
            }"
            @change="cateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="nowtab" @tab-click="tabChange">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button
                size="mini"
                type="primary"
                @click="addmany"
                :disabled="cat_pid == 0 ? true : false"
                >添加参数</el-button
              >
            </el-col>
          </el-row>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="expand"
              ><template slot-scope="res">
                <el-tag
                  :key="tag"
                  v-for="tag in res.row.attr_vals.split(',')"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, res.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible == res.row.attr_id"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(res.row)"
                  @blur="handleInputConfirm(res.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(res.row.attr_id)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="res">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openManyDialog(res.row)"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteAttr(res.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button
                size="mini"
                type="primary"
                @click="addonly"
                :disabled="cat_pid == 0 ? true : false"
                >添加属性</el-button
              >
            </el-col>
          </el-row>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="expand"
              ><template slot-scope="res">
                <el-tag
                  :key="tag"
                  v-for="tag in res.row.attr_vals.split(',')"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, res.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible == res.row.attr_id"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(res.row)"
                  @blur="handleInputConfirm(res.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(res.row.attr_id)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="res">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openOnlyDialog(res.row)"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteAttr(res.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 新增&修改属性弹框 -->
      <el-dialog
        title="添加静态属性"
        :visible.sync="addOnlyDialogVisible"
        width="50%"
        @close="addOnlyClose"
      >
        <el-form
          ref="addform"
          :model="addform"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="属性名称" prop="attr_name">
            <el-input v-model="addform.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addOnlyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addsub">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新增&修改动态参数弹框 -->
      <el-dialog
        title="添加参数"
        :visible.sync="addmanyDialogVisible"
        width="50%"
        @close="addmanyClose"
      >
        <el-form
          ref="addform"
          :model="addform"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="addform.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addmanyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addsub">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cat_pid: 0,
      options: [],
      nowtab: 'many',
      tableData: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      addOnlyDialogVisible: false,
      addmanyDialogVisible: false,
      addform: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '此项必填', trigger: 'blur' }
        ]
      },
      // 新增和修改使用的同一表单，用此变量来判断是修改还是新增
      isedit: false,
      editid: 0
    }
  },
  methods: {
    async getCatData () {
      const { data: ret } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.options = ret.data
    },
    deleteAttr (attrid) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(attrid)
        const { data: ret } = await this.$http.delete(`categories/${this.cat_pid}/attributes/${attrid}`)
        if (ret.meta.status !== 200) return this.$message.error('删除失败')
        this.cateChange()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async openOnlyDialog (row) {
      this.isedit = true
      this.addOnlyDialogVisible = true
      this.editid = row.attr_id
      const id = row.attr_id
      const { data: ret } = await this.$http.get(`categories/${this.cat_pid}/attributes/${id}`)
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.addform.attr_name = ret.data.attr_name
    },
    async openManyDialog (row) {
      this.isedit = true
      this.addmanyDialogVisible = true
      this.editid = row.attr_id
      const id = row.attr_id
      const { data: ret } = await this.$http.get(`categories/${this.cat_pid}/attributes/${id}`)
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.addform.attr_name = ret.data.attr_name
    },
    addonly () {
      this.addOnlyDialogVisible = true
    },
    addmany () {
      this.addmanyDialogVisible = true
    },
    addOnlyClose () {
      this.$refs.addform.resetFields()
      this.isedit = false
    },
    addmanyClose () {
      this.$refs.addform.resetFields()
    },
    addsub () {
      this.$refs.addform.validate(async val => {
        if (!val) return false
        if (!this.isedit) {
          // 新增操作
          const { data: ret } = await this.$http.post(`categories/${this.cat_pid}/attributes`, {
            attr_name: this.addform.attr_name,
            attr_sel: this.nowtab,
            attr_vals: ''
          })
          if (ret.meta.status !== 201) return this.$message.error('添加失败')
          this.cateChange()
          this.addOnlyDialogVisible = false
          this.addmanyDialogVisible = false
          return this.$message.success('添加成功')
        } else {
          // 修改操作
          const { data: ret } = await this.$http.put(`categories/${this.cat_pid}/attributes/${this.editid}`, {
            attr_name: this.addform.attr_name,
            attr_sel: this.nowtab
          })
          if (ret.meta.status !== 200) return this.$message.error('修改失败')
          this.cateChange()
          this.addOnlyDialogVisible = false
          this.addmanyDialogVisible = false
          return this.$message.success('修改成功')
        }
      })
    },
    async cateChange () {
      const { data: ret } = await this.$http.get(`categories/${this.cat_pid}/attributes`, {
        params: { sel: this.nowtab }
      })
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.tableData = ret.data
      console.log(ret)
    },
    tabChange () {
      this.cateChange()
    },
    async handleClose (tag, tagrow) {
      console.log(tag)
      const taglist = tagrow.attr_vals.split(',')
      taglist.splice(taglist.indexOf(tag), 1)
      const newtag = taglist.join(',')
      const { data: ret } = await this.$http.put(`categories/${this.cat_pid}/attributes/${tagrow.attr_id}`, {
        attr_name: tagrow.attr_name,
        attr_sel: this.nowtab,
        attr_vals: newtag
      })
      if (ret.meta.status !== 200) return this.$message.error('更新参数失败')
      tagrow.attr_vals = newtag
      return this.$message.success('更新参数成功')
    },

    showInput (id) {
      this.inputVisible = id
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm (row) {
      const inputValue = this.inputValue
      if (inputValue) {
        const newtag = row.attr_vals ? row.attr_vals + ',' + inputValue : inputValue
        const { data: ret } = await this.$http.put(`categories/${this.cat_pid}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: this.nowtab,
          attr_vals: newtag
        })
        if (ret.meta.status !== 200) return this.$message.error('更新参数失败')
        row.attr_vals = newtag
        this.inputVisible = false
        this.inputValue = ''
        return this.$message.success('更新参数成功')
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  },
  mounted () {
    this.getCatData()
  }
}
</script>

<style lang="less" scoped>
.catopt {
  margin: 15px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
