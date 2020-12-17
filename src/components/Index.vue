<template>
  <div class="index_container">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-openeds="['1']">
            <el-submenu index="1">
              <template slot="title"
                ><i class="el-icon-message"></i>导航一</template
              >
              <el-menu-item index="1-1">选项4-1</el-menu-item>
              <el-menu-item index="1-2">选项4-1</el-menu-item>
              <el-menu-item index="1-3">选项4-1</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"
                ><i class="el-icon-message"></i>导航一</template
              >
              <el-menu-item index="2-1">选项4-1</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"
                ><i class="el-icon-message"></i>导航一</template
              >
              <el-menu-item index="3-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>Main</el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.index_container {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  // height: 100%;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
</style>
