<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
        ref="menu-tree"
        :data="menus"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedKeys"
      >
      </el-tree>
      <div style="text-align: center">
        <el-button @click="resetCheckd">清空</el-button>
        <el-button @click="onSave" type="primary">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          // this.checkedKeys.push(menu.id as never)
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
      // console.log(data.data)
    },
    async onSave () {
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      // console.log(menuList)
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      this.$message.success('操作成功')
      this.$router.back()
    },
    resetCheckd () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
