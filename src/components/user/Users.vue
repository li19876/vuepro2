<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="initdata"
            @change="initdata"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="initdata"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addFormVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 添加用户对话框 -->
      <el-dialog
        title="新增用户"
        :visible.sync="addFormVisible"
        center
        @closed="addDialogClosed"
      >
        <el-form :model="userAddForm" :rules="addFormRules" ref="addFormref">
          <el-form-item label="" prop="username">
            <el-input
              v-model="userAddForm.username"
              placeholder="用户名(必填)"
              prefix-icon="el-icon-s-custom"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              v-model="userAddForm.password"
              placeholder="密码(必填)"
              show-password
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="email">
            <el-input
              v-model="userAddForm.email"
              placeholder="邮箱"
              prefix-icon="el-icon-message"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="mobile">
            <el-input
              v-model="userAddForm.mobile"
              placeholder="手机号"
              prefix-icon="el-icon-mobile-phone"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editFormVisible"
        center
        @closed="editDialogClosed"
      >
        <el-form :model="userEditForm" :rules="addFormRules" ref="editFormref">
          <el-form-item label="">
            <el-input
              v-model="userEditForm.username"
              placeholder="用户名"
              prefix-icon="el-icon-user"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="email">
            <el-input
              v-model="userEditForm.email"
              placeholder="邮箱"
              prefix-icon="el-icon-message"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="mobile">
            <el-input
              v-model="userEditForm.mobile"
              placeholder="手机号"
              prefix-icon="el-icon-mobile-phone"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserSub">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="editRoleVisible"
        center
        @closed="roleDialogClosed"
      >
        <p>当前用户：{{ assignNow.user }}</p>
        <p>当前角色：{{ assignNow.role }}</p>
        <p>
          当前分配新角色：<el-select
            v-model="newrole"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleSub(assignNow.id)"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 用户表格区域 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" :index="1" label="#" width="80">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="手机" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="mg_state">
            <el-switch
              v-model="mg_state.row.mg_state"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="changeSta(mg_state.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="res">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editUser(res.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteUser(res.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="assignRole(res.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[queryinfo.pagesize, 30, 50]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      if (value === '') return cb()
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱或者留空'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      if (value === '') return cb()
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号或者留空'))
    }

    return {
      tableData: [],
      total: 0,
      queryinfo: {
        pagesize: 10,
        pagenum: 1,
        query: ''
      },
      addFormVisible: false,
      editFormVisible: false,
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 记录分配角色时当前用户和角色
      assignNow: {
        user: '',
        id: '',
        role: ''
      },
      editRoleVisible: false,
      userEditForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度要在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '密码长度要在6-32个字符之间', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail }
        ],
        mobile: [
          { validator: checkMobile }
        ]
      },
      rolelist: [],
      newrole: ''
    }
  },
  methods: {
    // 打开分配角色弹窗
    async assignRole (row) {
      this.editRoleVisible = true
      this.assignNow.user = row.username
      this.assignNow.role = row.role_name
      this.assignNow.id = row.id
      const { data: ret } = await this.$http.get('roles')
      this.rolelist = ret.data
    },
    // 分配角色弹窗关闭监听
    roleDialogClosed () {
      this.assignNow.user = ''
      this.assignNow.role = ''
      this.assignNow.id = ''
      this.rolelist = []
      this.newrole = ''
    },
    // 分配角色确定提交
    async editRoleSub (id) {
      if (!this.newrole) return this.$message.error('请选择要分配的角色')
      const { data: ret } = await this.$http.put(`users/${id}/role`, { rid: this.newrole })
      if (ret.meta.status !== 200) return this.$message.error('分配角色失败')
      this.editRoleVisible = false
      this.initdata()
      return this.$message.success(ret.meta.msg)
    },
    async editUser (id) {
      const { data: ret } = await this.$http.get(`users/${id}`)
      if (ret.meta.status === 200) {
        this.userEditForm = ret.data
        this.editFormVisible = true
      }
    },
    editUserSub () {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.put(`users/${this.userEditForm.id}`, this.userEditForm)
        if (ret.meta.status !== 200) return this.$message.error(ret.meta.msg)
        this.initdata()
        this.editFormVisible = false
        return this.$message.success(ret.meta.msg)
      })
    },
    addDialogClosed () {
      this.$refs.addFormref.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormref.resetFields()
    },
    addUser () {
      this.$refs.addFormref.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.post('users', this.userAddForm)
        if (ret.meta.status !== 201) {
          return this.$message.error(ret.meta.msg)
        } else {
          this.addFormVisible = false
          this.initdata()
          return this.$message.success(ret.meta.msg)
        }
      })
    },
    async deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: ret } = await this.$http.delete(`users/${id}`)
        if (ret.meta.status !== 200) return this.$message.error(ret.meta.msg)
        this.initdata()
        return this.$message.success(ret.meta.msg)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange (val) {
      this.queryinfo.pagesize = val
      this.initdata()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.queryinfo.pagenum = val
      this.initdata()
      // console.log(`当前页: ${val}`)
    },
    async initdata () {
      const { data: ret } = await this.$http.get('users', {
        params: this.queryinfo
      })
      this.tableData = ret.data.users
      this.total = ret.data.total
    },
    async getdata () {
      const { data: ret } = await this.$http.get('users', {
        params: this.queryinfo
      })
      if (ret.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.tableData = ret.data.users
      this.total = ret.data.total
      // console.log(ret)
    },
    async changeSta (val) {
      const { data: ret } = await this.$http.put('users/' + val.id + '/state/' + String(val.mg_state))
      if (ret.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error(ret.meta.msg)
      }
      return this.$message.success(ret.meta.msg)
    }
  },
  mounted () {
    this.getdata()
  }
}
</script>
