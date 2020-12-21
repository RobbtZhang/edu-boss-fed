<template>
  <div class="resource-category">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button size="mini" @click="showAddResourceCategory">添加</el-button>
      </div>
      <el-table
        :data="resourcecategory"
        v-loading="!resourcecategory.length"
        style="width: 100%"
        border>
        <el-table-column
          align="center"
          prop="id"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createdTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sort"
          label="排序">
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
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="40%">
      <el-form :model="form">
        <el-form-item label="名称：" :label-width="formLabelWidth"
        size="small">
          <el-input style="width: 250px;" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序：" :label-width="formLabelWidth"
        size="small">
          <el-input style="width: 250px;" v-model="form.sort" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addResourceCategory" :loading="showLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourceCategory, resourceCategorySaveOrUpdate, deleteResourceCategory } from '../../services/resource'
import { formatTime } from '../../utils/utils'

export default Vue.extend({
  name: 'ResourceCategory',
  data () {
    return {
      resourcecategory: [],
      dialogVisible: false,
      showLoading: false,
      form: {
        name: '',
        sort: 0,
        id: null
      },
      formLabelWidth: '150px'
    }
  },
  created () {
    this.loadResourcecategory()
  },
  methods: {
    async loadResourcecategory () {
      const { data } = await getResourceCategory()
      if (data.code === '000000') {
        formatTime(data.data)
        this.resourcecategory = data.data
      }
    },
    async addResourceCategory () {
      if (this.form.name) {
        this.showLoading = true
        const { data } = await resourceCategorySaveOrUpdate(this.form)
        if (data.data) {
          if (this.form.id) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
          } else {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
          }
          this.showLoading = false
          this.dialogVisible = false
          this.loadResourcecategory()
        }
      } else {
        this.$message({
          message: '分类名必填！',
          type: 'warning'
        })
      }
    },
    handleDelete (r: any) {
      this.$confirm('是否删除该分类？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteResourceCategory(r.id)
        if (data.data) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.loadResourcecategory()
        }
      }).catch(() => {
        this.$message({
          message: '取消删除',
          type: 'info'
        })
      })
    },
    async handleEdit (r: any) {
      this.dialogVisible = true
      const edit: any = this.resourcecategory.filter((item: any) => item.id === r.id)
      this.form.name = edit[0].name
      this.form.sort = edit[0].sort
      this.form.id = edit[0].id
    },
    showAddResourceCategory () {
      this.dialogVisible = true
      this.form = {
        name: '',
        sort: 0,
        id: null
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
