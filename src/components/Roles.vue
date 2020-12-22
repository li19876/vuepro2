<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表表格区域 -->
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        border
        ref="rolesTable"
      >
        <el-table-column prop="roleName" label="角色名称" sortable>
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" sortable>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="res">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editRole(res.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="更改权限"
              placement="top"
              :id="res.row.id"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改角色对话框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editFormVisible"
        center
        @closed="editDialogClosed"
      >
        <el-form :model="rolesEditForm" ref="editFormref">
          <el-form-item label="">
            <el-input
              v-model="rolesEditForm.roleId"
              placeholder="ID"
              prefix-icon="el-icon-user"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="rolesEditForm.roleName"
              placeholder="角色名称"
              prefix-icon="el-icon-message"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="rolesEditForm.roleDesc"
              placeholder="角色描述"
              prefix-icon="el-icon-mobile-phone"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleSub">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      row_key: 1,
      isExpand: false,
      editFormVisible: false,
      rolesEditForm: {
        roleId: 0,
        roleName: '',
        roleDesc: ''
      }
    }
  },
  created () {
    this.dataInit()
  },
  methods: {

    async dataInit () {
      const { data: ret } = await this.$http.get('roles')
      this.forObj(ret.data)
      this.tableData = ret.data
      // this.forArr(this.tableData, false)
      // console.log(ret)
    },
    async editRole (id) {
      console.log(id)
      const { data: ret } = await this.$http.get(`roles/${id}`)
      if (ret.meta.status === 200) {
        this.rolesEditForm = ret.data
        this.editFormVisible = true
        console.log(this.rolesEditForm)
      }
    },
    editDialogClosed () {
      this.$refs.editFormref.resetFields()
    },
    editRoleSub () {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.put(`roles/${this.rolesEditForm.roleId}`, this.rolesEditForm)
        if (ret.meta.status !== 200) return this.$message.error(ret.meta.msg)
        this.dataInit()
        this.editFormVisible = false
        return this.$message.success('修改成功')
      })
    },
    // 设置树形结构默认折叠状态
    handleExpand () {
      // this.isExpand = !this.isExpand
      this.$nextTick(() => {
        this.forArr(this.tableData, this.isExpand)
      })
    },
    forArr (arr, isExpand) {
      arr.forEach(i => {
        this.$refs.rolesTable.toggleRowExpansion(i, isExpand)

        if (i.children) {
          this.forArr(i.children, isExpand)
        }
      })
    },
    forObj (obj) {
      obj.forEach(item => {
        item.row_key = this.row_key
        this.row_key++
        if (item.children) {
          this.forObj(item.children)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
