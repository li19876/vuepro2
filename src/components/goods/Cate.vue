<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 上方按钮栏区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="rightsTable"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="res">
            <span v-if="!res.row.deleted" class="smliespan"
              ><i class="fas fa-smile fa-2x"></i
            ></span>
            <span v-else class="frownspan"><i class="fas fa-frown"></i></span>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="res">
            <el-tag v-if="res.row.cat_level == 0">一级</el-tag>
            <el-tag v-else-if="res.row.cat_level == 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="res">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openEditDialog(res.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              @click="deleteCate(res.row.cat_id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类弹框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form :model="addform" :rules="addFormRules" ref="addCateForm">
          <el-form-item label="分类名称" label-width="80px" prop="cat_name">
            <el-input v-model="addform.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" label-width="80px" prop="cat_pid">
            <el-cascader
              ref="cas"
              v-model="addform.cat_pid"
              :options="options"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                checkStrictly: true,
                emitPath: false,
              }"
              clearable
              @change="selectPid"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateSub">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类弹框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form :model="editform" :rules="addFormRules" ref="editCateForm">
          <el-form-item label="分类名称" label-width="80px" prop="cat_name">
            <el-input v-model="editform.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateSub">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      queryInfo: {
        type: [],
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addDialogVisible: false,
      addform: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      options: [],
      // 编辑分类弹窗配置
      editDialogVisible: false,
      editform: {
        cat_name: ''
      },
      editid: 0
    }
  },
  methods: {
    async dataInit () {
      const { data: ret } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.tableData = ret.data.result
      this.total = ret.data.total
    },
    // 打开编辑分类窗口
    async openEditDialog (id) {
      const { data: ret } = await this.$http.get(`categories/${id}`)
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.editform.cat_name = ret.data.cat_name
      this.editDialogVisible = true
      this.editid = id
    },
    async editCateSub () {
      this.$refs.editCateForm.validate(async val => {
        if (!val) return false
        const { data: ret } = await this.$http.put(`categories/${this.editid}`, { cat_name: this.editform.cat_name })
        if (ret.meta.status !== 200) return this.$message.error('更新数据失败')
        this.dataInit()
        this.editDialogVisible = false
        return this.$message.success('更新成功')
      })
    },
    // 关闭修改窗口监听
    editDialogClosed () {
      this.editid = 0
      this.editform.cat_name = ''
    },
    // 打开添加分类窗口
    async openAddDialog () {
      this.addDialogVisible = true
      const { data: ret } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.options = ret.data
      console.log(ret)
    },
    selectPid () {
      this.$refs.cas.dropDownVisible = false
      // console.log(this.$refs.cas.getCheckedNodes())
      this.addform.cat_level = this.$refs.cas.getCheckedNodes().length > 0 ? this.$refs.cas.getCheckedNodes()[0].level : 0
    },
    addDialogClosed () {
      this.addform = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }
    },
    // 添加表单提交
    addCateSub () {
      this.$refs.addCateForm.validate(async val => {
        if (!val) return false
        const { data: ret } = await this.$http.post('categories', this.addform)
        if (ret.meta.status !== 201) return this.$message.error('菜单添加失败')
        this.dataInit()
        this.addDialogVisible = false
        return this.$message.success(ret.meta.msg)
      })
    },
    // 删除分类方法
    deleteCate (id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: ret } = await this.$http.delete(`categories/${id}`)
        if (ret.meta.status !== 200) return this.$message.error('菜单删除失败')
        this.dataInit()
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
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.dataInit()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.dataInit()
      // console.log(`当前页: ${val}`)
    }
  },
  mounted () {
    this.dataInit()
    // setInterval(function () {
    //   document.querySelectorAll('.el-cascader-node__label').forEach(el => {
    //     el.onclick = function () {
    //       if (this.previousElementSibling) this.previousElementSibling.click()
    //     }
    //   })
    // }, 3000)
  }
}
</script>

<style lang="less" scoped>
.smliespan {
  color: #4ec05d;
}
.frownspan {
  color: rgb(233, 180, 36);
}
</style>
