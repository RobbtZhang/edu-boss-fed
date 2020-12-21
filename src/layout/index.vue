<template>
  <div class="layout">
    <el-container>
      <app-aside :isCollapse="isCollapse"></app-aside>
      <el-container>
        <el-header>
          <app-header @changeClose="isCollapse = !isCollapse"></app-header>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'

export default Vue.extend({
  name: 'LayoutIndex',
  data () {
    return {
      isCollapse: false
    }
  },
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style lang="scss" scoped>
.el-header {
  padding-left: 0px;
}
.layout {
  height: 100vh;
  overflow: auto;
}
.el-container {
  min-height: 100vh;
  min-width: 980px;
}
.el-aside {
  background: #545c64;
}
.el-header {
  background: #fff;
}
.el-main {
  background: #e9eef3;
}
</style>
