<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="9">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
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
              @change="changeSta(mg_state.row.id)"
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
              :id="res.row.id"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              :id="res.row.id"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :id="res.row.id"
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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[pagesize, 30, 50]"
        :page-size="pagesize"
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
    return {
      tableData: [],
      pagenum: 1,
      total: 0,
      pagesize: 10
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.initdata()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.initdata()
      // console.log(`当前页: ${val}`)
    },
    async initdata () {
      const { data: ret } = await this.$http.get('users?pagenum=' + this.pagenum + '&pagesize=' + this.pagesize)
      this.tableData = ret.data.users
      this.total = ret.data.total
    },
    async getdata () {
      const { data: ret } = await this.$http.get('users?pagenum=1&pagesize=' + this.pagesize)
      if (ret.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.tableData = ret.data.users
      this.total = ret.data.total
      // console.log(ret)
    },
    changeSta (val, id) {
      console.log(val, id)
    }
  },
  mounted () {
    this.getdata()
  }
}
</script>
