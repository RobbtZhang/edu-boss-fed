<template>
  <div class="user-list">
    <el-card class="box-card">
      <div slot="header">
        <el-form :model="filterParams" inline ref="filter-form" label-position="left">
          <el-form-item label="课程名称" prop="courseName">
            <el-input placeholder="课程名称" size="lager" v-model="filterParams.courseName"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="filterParams.status" placeholder="请选择">
              <el-option size="lager" label="全部" :value="''"></el-option>
              <el-option size="lager" label="上架" :value="1" ></el-option>
              <el-option size="lager" label="下架" :value="0" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="resSearch" :loading="resSearchLoading" size="middle">重置</el-button>
            <el-button type="primary" @click="onSubmit" size="middle" :loading="searchLoading">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button icon="el-icon-plus" type="primary" @click="$router.push({
              name: 'course-create'
            })" size="middle">新建课程</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="courses"
        v-loading="showTableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="80">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="160">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <i
              :title="scope.row.status === 1 ? '上架' : '下架'"
              class="status"
              :class="scope.row.status === 1 ? 'status-success' : 'status-danger'"
            >
            </i>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.disChange"
              :type="scope.row.status === 1 ? 'danger' : 'success'"
              @click="onStateChange(scope.row)">{{scope.row.status === 1 ? '下架' : '上架'}}</el-button>
            <el-button
              size="mini"
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })">编辑</el-button>
              <el-button
              size="mini"
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id,
                  courseName: scope.row.courseName
                }
              })">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="showTableLoading"
        background
        :hide-on-single-page="totalPage/filterParams.pageSize<=1"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="filterParams.currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getQueryCourses, changeState } from '@/services/course'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      courses: [],
      roles: [] as never,
      roleIdList: [],
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      showTableLoading: false,
      dialogVisible: false,
      searchLoading: false,
      resSearchLoading: false,
      totalPage: 0,
      showLoading: false,
      formLabelWidth: '150px'
    }
  },
  created () {
    this.loadCourseList()
  },
  methods: {
    async loadCourseList () {
      this.showTableLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      if (data.code === '000000') {
        this.totalPage = data.data.total
        this.courses = data.data.records.map((course: any) => {
          course.disChange = false
          return course
        })
        this.showTableLoading = false
      }
    },
    handleSizeChange (val: any) {
      this.filterParams.pageSize = val
      this.loadCourseList()
    },
    handleCurrentChange (val: any) {
      this.filterParams.currentPage = val
      this.loadCourseList()
    },
    resSearch () {
      this.filterParams.courseName = ''
      this.filterParams.status = ''
      this.filterParams.currentPage = 1
      // (this.$refs['filter-form'] as Form).resetFields()
      this.resSearchLoading = true
      this.loadCourseList().then(() => {
        this.resSearchLoading = false
      })
    },
    async onSubmit () {
      this.searchLoading = true
      await this.loadCourseList()
      this.searchLoading = false
    },
    async onStateChange (r: any) {
      r.disChange = true
      await changeState({
        courseId: r.id,
        status: r.status === 0 ? 1 : r.status === 1 ? 0 : ''
      })
      r.status = r.status === 0 ? 1 : r.status === 1 ? 0 : ''
      r.disChange = false
      this.$message.success(r.status === 1 ? '上架成功' : '下架成功')
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
