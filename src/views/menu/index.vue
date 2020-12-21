<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({name: 'menu-create'})">添加菜单</el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        :data="menus"
        style="width: 100%">
        <el-table-column
          align="center"
          label="编号"
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="菜单名称"
          width="150">
        </el-table-column>
        <el-table-column
          align="center"
          prop="level"
          label="菜单级数"
          width="150">
        </el-table-column>
        <el-table-column
          align="center"
          prop="icon"
          label="图标"
          width="150">
        </el-table-column>
        <el-table-column
          align="center"
          prop="orderNum"
          label="排序"
          width="150">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenu } from '../../services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      menus: [],
      loading: true
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.menus = data.data
        this.loading = false
      }
    },
    handleEdit (r: any) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: r.id
        }
      })
    },
    handleDelete (r: any) {
      this.$confirm('确认删除吗？', '删除提示', {}).then(async () => {
        const { data } = await deleteMenu(r.id)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadAllMenus()
        }
      }).catch(err => {
        this.$message.info('取消删除' + err)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
