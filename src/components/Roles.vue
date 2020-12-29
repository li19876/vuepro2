<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表表格区域 -->
    <el-card>
      <el-button type="primary" @click="addrole">添加角色</el-button>
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        border
        ref="rolesTable"
      >
        <el-table-column type="expand">
          <template slot-scope="res">
            <!-- 渲染一级权限 -->
            <el-row
              :class="['vcenter', 'dbbottom', i1 === 0 ? 'dbtop' : '']"
              v-for="(item1, i1) in res.row.children"
              :key="item1.id"
              type="flex"
              align="middle"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  type="danger"
                  @close="removeRights(item1.id, res.row)"
                  >{{ item1.authName }}</el-tag
                ><i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'dbtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="4">
                    <el-tag closable @close="removeRights(item2.id, res.row)">{{
                      item2.authName
                    }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <!-- 渲染三级权限 -->
                    <el-tag
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="success"
                      @close="removeRights(item3.id, res.row)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" sortable> </el-table-column>
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
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRole(res.row.id)"
              >删除</el-button
            >
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
                @click="assignPermiss(res.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改角色对话框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editFormVisible"
        center
        @close="editDialogClosed"
      >
        <el-form :model="rolesEditForm" :rules="rolesrule" ref="editFormref">
          <el-form-item label="" prop="roleId">
            <el-input
              v-model="rolesEditForm.roleId"
              placeholder="ID"
              prefix-icon="el-icon-user"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="roleName">
            <el-input
              v-model="rolesEditForm.roleName"
              placeholder="角色名称"
              prefix-icon="el-icon-message"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="roleDesc">
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
      <!-- 分配权限弹框区域 -->
      <el-dialog
        title="分配权限"
        :visible.sync="assignVisible"
        @close="closeRightDialog"
      >
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="allid"
          :props="defaultProps"
          ref="rightsTreeRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveright">确 定</el-button>
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
      row_key: 1,
      isExpand: false,
      editFormVisible: false,
      isadd: false,
      assignVisible: false,
      rolesEditForm: {
        roleId: 0,
        roleName: '',
        roleDesc: ''
      },
      rolesrule: {
        roleid: [],
        rolename: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roledesc: []
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选择的id数组
      allid: [],
      // 正在授权的角色id
      assing: null
    }
  },
  created () {
    this.dataInit()
  },
  methods: {
    async saveright () {
      const checked = this.$refs.rightsTreeRef.getCheckedKeys()
      const halfchecked = this.$refs.rightsTreeRef.getHalfCheckedKeys()
      const newRights = checked + ',' + halfchecked
      const { data: res } = await this.$http.post(`roles/${this.assing}/rights`, { rids: newRights })
      if (res.meta.status === 200) {
        this.assignVisible = false
        this.dataInit()
        return this.$message.success('修改权限成功')
      }
      return this.$message.error('修改权限失败')
    },
    // 监听权限管理对话框关闭事件
    closeRightDialog () {
      this.allid = []
      this.assing = null
    },
    // 分配权限
    async assignPermiss (res) {
      console.log(this.allid)
      this.forObj(res, this.allid)
      const { data: ret } = await this.$http.get('rights/' + 'tree')
      this.data = ret.data
      this.assing = res.id
      this.assignVisible = true
    },
    // 删除角色
    deleteRole (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: ret } = await this.$http.delete(`roles/${id}`)
        if (ret.meta.status !== 200) return this.$message.error('删除失败')
        this.dataInit()
        return this.$message.success('删除角色成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除权限
    removeRights (rightsId, row) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: ret } = await this.$http.delete(`roles/${row.id}/rights/${rightsId}`)
        if (ret.meta.status !== 200) return this.$message.error('删除失败')
        row.children = ret.data
        return this.$message.success('删除权限成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async dataInit () {
      const { data: ret } = await this.$http.get('roles')
      // this.forObj(ret.data)
      this.tableData = ret.data
      // this.forArr(this.tableData, false)
      // console.log(ret)
    },
    addrole () {
      this.editFormVisible = true
      this.isadd = true
    },
    // 新增和编辑角色，用isadd变量来区分是增加还是修改
    async editRole (id) {
      const { data: ret } = await this.$http.get(`roles/${id}`)
      if (ret.meta.status === 200) {
        this.rolesEditForm = ret.data
        this.editFormVisible = true
      }
    },
    // 修改添加弹框关闭后重置表单，恢复添加flag值
    editDialogClosed () {
      this.$refs.editFormref.resetFields()
      console.log(this.rolesEditForm)
      this.isadd = false
    },
    async editRoleSub () {
      console.log(this.isadd)
      if (this.isadd) {
        console.log('添加操作')
        const { data: res } = await this.$http.post('roles', this.rolesEditForm)
        if (res.meta.status === 201) {
          this.editFormVisible = false
          this.dataInit()
          return this.$message.success('添加角色成功')
        }
        return this.$message.error('添加角色失败')
      } else {
        console.log('修改提交操作')
        this.$refs.editFormref.validate(async valid => {
          if (!valid) return
          const { data: ret } = await this.$http.put(`roles/${this.rolesEditForm.roleId}`, this.rolesEditForm)
          if (ret.meta.status !== 200) return this.$message.error(ret.meta.msg)
          this.dataInit()
          this.editFormVisible = false
          return this.$message.success('修改成功')
        })
      }
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
    forObj (obj, arr) {
      if (!obj.children) {
        return arr.push(obj.id)
      }
      obj.children.forEach(item => {
        this.forObj(item, arr)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
</style>
