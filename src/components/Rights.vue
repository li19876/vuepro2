<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表表格区域 -->
    <el-card>
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="rightsTable"
      >
        <el-table-column prop="id" label="权限ID" sortable width="180">
        </el-table-column>
        <el-table-column prop="authName" label="权限说明" sortable width="180">
        </el-table-column>
        <el-table-column prop="path" label="对应访问路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="res">
            <el-tag :type="leveltype(res.row.pid)">{{
              leveltext(res.row.pid)
            }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.dataInit()
  },
  methods: {
    leveltype (id) {
      if (!id) {
        return 'danger'
      }
      if (id > 0) {
        return ''
      }
      if (typeof id === 'string') {
        return 'success'
      }
    },
    leveltext (id) {
      if (!id) {
        return '一级'
      }
      if (id > 0) {
        return '二级'
      }
      if (typeof id === 'string') {
        return '三级'
      }
    },
    async dataInit () {
      const { data: ret } = await this.$http.get('rights/' + 'tree')
      this.tableData = ret.data
      // this.handleExpand()
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
        this.$refs.rightsTable.toggleRowExpansion(i, isExpand)

        if (i.children) {
          this.forArr(i.children, isExpand)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
