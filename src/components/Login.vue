<template>
  <div class="cont">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单输入区域 -->
      <el-form
        ref="form"
        class="login_form"
        :model="form"
        :rules="loginformrules"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-s-custom"
            placeholder="请输入用户名"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            type="password"
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="onSubmit('form')">登录</el-button>
          <el-button type="info" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      loginformrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate(async val => {
        if (!val) return false
        const { data: ret } = await this.$http.post('login', this.form)
        if (ret.meta.status === 200) {
          this.$message({
            message: ret.meta.msg,
            type: 'success'
          })
          window.sessionStorage.setItem('token', ret.data.token)
          this.$router.push('/index')
        } else {
          this.$message.error({ message: ret.meta.msg })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script>

<style lang="less" scoped>
.cont {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px rgb(136, 136, 136);
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>
