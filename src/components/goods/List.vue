<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索栏区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsData"
          >
            >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <router-link to="/goods/add">
            <el-button type="primary">添加商品</el-button>
          </router-link>
        </el-col>
      </el-row>
      <!-- 商品表格区域 -->
      <el-table :data="tableData" stripe style="width: 100%" :border="true">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="重量" width="100">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="添加时间"
          width="180"
          :formatter="formatDate"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="res">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openEditDialog(res.row.goods_id)"
            ></el-button>
            <el-button
              @click="deleteGood(res.row.goods_id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
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
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  methods: {
    async getGoodsData () {
      const { data: ret } = await this.$http.get('goods', { params: this.queryInfo })
      if (ret.meta.status !== 200) return this.$message.error('获取列表数据失败')
      this.tableData = ret.data.goods
      this.total = ret.data.total
    },
    formatDate (row, column, cellValue, index) {
      if (cellValue == null || cellValue === '') return ''
      const date = new Date(parseInt(cellValue) * 1000)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '-'
      const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-'
      const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    search () {
      if (this.queryInfo.query.trim()) {
        this.queryInfo.pagenum = 1
        this.getGoodsData()
      } else {
        return this.$message.error('请输入查询内容！')
      }
    },
    openEditDialog (id) {
      this.$router.push(`/goods/edit/${id}`)
    },
    deleteGood (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: ret } = await this.$http.delete(`goods/${id}`)
        if (ret.meta.status !== 200) return this.$message.error('删除商品失败')
        this.getGoodsData()
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
      this.getGoodsData()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsData()
    }
  },
  mounted () {
    this.getGoodsData()
  }
}
</script>

<style lang="less" scoped>
</style>
