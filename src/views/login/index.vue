<template>
  <div class="login">
    <span>Edu boss 管理</span>
    <span>系统</span>
    <el-form
      :rules="rules"
      class="login-form"
      label-position="top"
      ref="form"
      :model="form"
      label-width="80px">
      <h3>登录</h3>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click.native="onSubmit"
          :loading="isLoginLoading"
          >
            登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '../../services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        // 18201288771
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在6-18个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1.表单验证
        await (this.$refs.form as Form).validate()
        // 登录按钮loading
        this.isLoginLoading = true
        // 2.提交表单
        const { data } = await login(this.form)
        // 3.处理请求结果
        // 失败: 给出提示
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // 1.记录登录状态，状态需要能够全局访问，放到vuex中
          this.$store.commit('setUser', data.content)
          // 2.再访问需要登录的页面的时候判断有没有登录状态（路由的拦截器）

          // 成功: 跳转到首页
          this.$router.replace(this.$route.query.redirect as string || '/')
          this.$message.success({
            message: '登录成功',
            duration: 1000
          })
        }
      } catch (err) {
        console.log(err)
      }
      // 结束登录按钮的 loading
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  padding-top: 80px;
  span {
    font-size: 50px;
    color: $info-color;
  }
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .login-form {
    margin-top: 50px;
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
