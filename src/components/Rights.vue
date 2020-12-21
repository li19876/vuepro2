<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!-- 权限列表表格区域 -->
    <el-card>
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="权限ID" sortable width="180">
        </el-table-column>
        <el-table-column prop="authName" label="权限说明" sortable width="180">
        </el-table-column>
        <el-table-column prop="pid" label="权限父ID"> </el-table-column>
        <el-table-column prop="path" label="对应访问路径"> </el-table-column>
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
    async dataInit () {
      const { data: ret } = await this.$http.get('rights/' + 'tree')
      this.tableData = ret.data
      console.log(ret)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
