<template>
  <div class="header">
    <el-button @click="handleClick" style="width: 50px;height: 50px;margin-right: 5px;" type="text"><i class="el-icon-s-unfold" style="font-weight: 400;font-size:20px"></i></el-button>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="flex: 1">
      <el-breadcrumb-item to="/">Home</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(title, index) in $route.meta.title" :key="index">
        {{title}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="40"
          :src="userInfo.portrait || require('@/assets/default-avatar.png')"
        />
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          {{ userInfo.userName }}
        </el-dropdown-item>
        <el-dropdown-item
          divided
          @click.native="handleLogout"
        >
          退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserInfo } from '../../services/user'

export default Vue.extend({
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    handleClick () {
      this.$emit('changeClose')
    },
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    handleLogout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除用户的登录状态
        this.$store.commit('setUser', null)
        // 跳转到登录页面
        this.$router.push({
          name: 'login'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
