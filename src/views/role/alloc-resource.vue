<template>
  <div class="alloc-resource">
    <el-card>
      <el-tree
        ref="resource-tree"
        :data="resourceList"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        show-checkbox
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
import { allocateRoleResources, getRoleResources, getResourceCategory, getResourcePages } from '@/services/resource'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      resourceList: [],
      loadTree: true,
      count: 1,
      resource: [],
      defaultProps: {
        children: 'resourceList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    // this.loadResources()
    this.loadRoleResources()
  },
  methods: {
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      this.resourceList = data.data
      // console.log(data.data, '..........')
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (resource: any) {
      resource.forEach((resource: any) => {
        if (resource.selected) {
          // this.checkedKeys.push(resources.id as never)
          this.checkedKeys = [...this.checkedKeys, resource.id] as any
        }
        if (resource.resourceList) {
          this.getCheckedKeys(resource.resourceList)
        }
      })
    },
    // async loadResources () {
    //   const { data } = await getResource()
    //   this.resource = data.data
    //   // console.log(data.data)
    // },
    async onSave () {
      const resourceIdList = (this.$refs['resource-tree'] as Tree).getCheckedKeys()
      console.log(resourceIdList)
      // await allocateRoleResources({
      //   roleId: this.roleId,
      //   resourceIdList
      // })
      // this.$message.success('操作成功')
      // this.$router.back()
    },
    resetCheckd () {
      (this.$refs['resource-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
