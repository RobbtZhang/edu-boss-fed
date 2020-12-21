<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="资源名称：" size="small">
            <el-input style="width: 215px;" v-model="searchName" placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径：" size="small">
            <el-input style="width: 215px;" v-model="searchUrl" placeholder="资源路径"></el-input>
          </el-form-item>
          <el-form-item size="small" label="资源分类：">
            <el-select v-model="searchCategoryId" placeholder="全部" style="width: 215px;" clearable>
              <el-option
                v-for="item in resourcecategory"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="resSearch" :loading="resSearchLoading" size="small">重置</el-button>
            <el-button type="primary" @click="onSubmit" size="small" :loading="searchLoading">查询搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom:30px">
        <el-button size="mini" @click="showAddResource">添加</el-button>
        <el-button size="mini" @click="$router.push({name: 'resource-category'})">资源分类</el-button>
      </div>
      <el-table
        :data="resources"
        v-loading="showLoading"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="id"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间"
          width="180">
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
      <el-pagination
        :disabled="showTableLoading"
        background
        :hide-on-single-page="totalPage/form.size<=1"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
      <el-dialog
        @close="resForm"
        title="添加资源"
        :visible.sync="dialogVisible"
        width="40%">
        <el-form :model="form">
          <el-form-item label="资源名称：" :label-width="formLabelWidth"
          size="small">
            <el-input v-model="form.name" autocomplete="off"
            style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="资源路径：" :label-width="formLabelWidth"
          size="small">
            <el-input v-model="form.url" autocomplete="off"
            style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="资源分类：" :label-width="formLabelWidth"
          size="small">
            <el-select v-model="form.categoryId" placeholder="请选择资源" clearable style="width: 250px;">
              <el-option
                v-for="item in resourcecategory"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth"
          size="small">
            <el-input
              type="textarea"
              :rows="5"
              v-model="form.description"
              style="width: 250px;">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addResource"
            :loading="showLoading">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, getResourceCategory, resourceSaveOrUpdate, deleteResource } from '../../../services/resource'
import { formatTime } from '../../../utils/utils'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      showTableLoading: false,
      searchName: '',
      searchUrl: '',
      searchCategoryId: null,
      resources: [],
      resourcecategory: [] as any,
      dialogVisible: false,
      searchLoading: false,
      resSearchLoading: false,
      form: {
        id: null,
        name: '',
        categoryId: null,
        url: '',
        description: '',
        current: 1,
        size: 5,
        category: null
      },
      totalPage: 0,
      showLoading: false,
      formLabelWidth: '150px'
    }
  },
  created () {
    this.loadResources()
    this.loadresourcecategory()
  },
  methods: {
    async loadResources () {
      this.showTableLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        formatTime(data.data.records)
        this.totalPage = data.data.total
        this.resources = data.data.records
        this.showTableLoading = false
      }
    },
    async loadresourcecategory () {
      const { data } = await getResourceCategory()
      if (data.code === '000000') {
        formatTime(data.data)
        this.resourcecategory = data.data
      }
    },
    async addResource () {
      if (this.form.name && this.form.url && this.form.categoryId) {
        this.showLoading = true
        const { data } = await resourceSaveOrUpdate(this.form)
        if (data.data) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.loadResources()
          this.showLoading = false
          this.dialogVisible = false
        }
      } else {
        this.$message({
          message: '资源名称、路径、分类必填！',
          type: 'warning'
        })
      }
    },
    handleEdit (r: any) {
      this.dialogVisible = true
      const resourceEdit: any = this.resources.filter((item: any) => item.id === r.id)
      this.form = Object.assign(this.form, resourceEdit[0])
    },
    handleDelete (r: any) {
      this.$confirm('是否要删除该资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteResource(r.id)
        if (data.data) {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.loadResources()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除！'
        })
      })
    },
    showAddResource () {
      this.dialogVisible = true
      this.form = Object.assign(this.form, {
        categoryId: 1
      })
    },
    handleSizeChange (val: any) {
      this.form.size = val
      this.form.current = 1
      this.form.categoryId = this.searchCategoryId
      this.loadResources()
    },
    handleCurrentChange (val: any) {
      this.form.current = val
      this.form.categoryId = this.searchCategoryId
      this.loadResources()
    },
    resForm () {
      this.form = Object.assign(this.form, {
        id: null,
        categoryId: null,
        url: '',
        description: '',
        name: null
      })
    },
    resSearch () {
      this.resSearchLoading = true
      this.searchName = ''
      this.searchUrl = ''
      this.searchCategoryId = null
      this.form.current = 1
      this.form.size = 5
      this.form.categoryId = null
      this.loadResources().then(() => {
        this.resSearchLoading = false
      })
    },
    onSubmit () {
      if (this.searchName || this.searchUrl || this.searchCategoryId) {
        this.searchLoading = true
        this.form.name = this.searchName || ''
        this.form.url = this.searchUrl || ''
        this.form.categoryId = this.searchCategoryId || null
        this.form.current = 1
        this.loadResources().then(() => {
          this.searchLoading = false
        })
        this.form.name = ''
        this.form.url = ''
        this.form.categoryId = null
      } else {
        this.$message({
          message: '请输入查询字段！',
          type: 'warning'
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
