<template>
  <div class="aside">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item style="margin-left: -13px" index="/course">
        <i>
          <img style="width: 30px;height: 30px; margin: 10px;" :src="require('@/assets/logo.e8b9190b.png')" alt="">
        </i>
        <span slot="title" style="color: #fff;font-size: 20px;">Edu Boss</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="/role">
          <i class="el-icon-menu"></i>
          <span slot="title">角色管理</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <i class="el-icon-menu"></i>
          <span slot="title">菜单管理</span>
        </el-menu-item>
        <el-menu-item index="/resource">
          <i class="el-icon-menu"></i>
          <span slot="title">资源管理</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/course">
        <i class="el-icon-menu"></i>
        <span slot="title">课程管理</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-document"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>广告管理</span>
        </template>
        <el-menu-item index="/advert">
          <i class="el-icon-setting"></i>
          <span slot="title">广告列表</span>
        </el-menu-item>
        <el-menu-item index="/advert-space">
          <i class="el-icon-setting"></i>
          <span slot="title">广告位列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppAside',
  props: {
    isCollapse: {
      type: Boolean
    }
  },
  methods: {
    handleOpen (key: string, keyPath: string): void {
      // console.log(key, keyPath)
    },
    handleClose (key: string, keyPath: string): void {
      // console.log(key, keyPath)
    }
  }
})
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.aside {
  .el-menu {
    min-height: 100%;
  }
}
</style>
