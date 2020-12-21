<template>
  <el-container class="index_container">
    <el-header class="header" height="80px">
      <div><h1>后台管理系统</h1></div>
      <div>
        <el-button type="info" class="quitbtn" @click="quit">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="iscoll ? '64px' : '200px'" class="aside">
        <div class="collapse" @click="togglecoll">|||</div>
        <el-menu
          background-color="#383838"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="iscoll"
          :collapse-transition="false"
          router
          :default-active="active"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title"
              ><i :class="iconlist[item.id]"></i>
              <span>{{ item.authName }}</span></template
            >
            <el-menu-item
              :index="'/' + i.path"
              v-for="i in item.children"
              :key="i.id"
              @click="saveActivesta('/' + i.path)"
              ><i class="el-icon-menu"></i>{{ i.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconlist: {
        125: 'fa fa-group',
        103: 'fa fa-cubes',
        101: 'fa fa-shopping-bag',
        102: 'fa fa-book',
        145: 'fa fa-line-chart'
      },
      iscoll: false,
      active: ''
    }
  },
  created () {
    this.getMenuList()
    this.active = window.sessionStorage.getItem('activePath')
  },
  methods: {
    async getMenuList () {
      const ret = await this.$http.get('menus')
      if (ret.data.meta.status !== 200) return this.$message.error(ret.data.meta.msg)
      this.menulist = ret.data.data
      console.log(ret.data.data)
    },
    togglecoll () {
      this.iscoll = !this.iscoll
    },
    quit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    saveActivesta (path) {
      window.sessionStorage.setItem('activePath', path)
      this.active = path
    }
  }

}
</script>

<style lang="less" scoped>
.index_container {
  height: 100%;
}
.el-submenu__title {
  padding-left: 0 !important;
}
.collapse {
  background-color: #475163;
  color: #fff;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.fa {
  margin-right: 10px;
}
.el-menu {
  border-right-width: 0;
}
.el-header {
  background-color: #383838;
  color: #fff;
  text-align: center;
  display: flex;
  line-height: 80px;
  justify-content: space-between;
  h1 {
    margin: 0;
  }
}

.el-aside {
  background-color: #383838;
  color: #fff;
  text-align: center;
  // height: 100%;
}

.el-main {
  // background-color: #fff;
  // color: #333;
  // text-align: center;
  // line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
</style>
