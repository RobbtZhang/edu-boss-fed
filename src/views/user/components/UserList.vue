<template>
  <div class="user-list">
    <el-card class="box-card">
      <div slot="header">
        <el-form :model="filterParams" inline ref="filter-form" label-position="top">
          <el-form-item label="手机号" prop="phone" size="small">
            <el-input placeholder="请输入手机号" style="width: 215px;" v-model="filterParams.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" size="small" prop="rangeDate">
            <el-date-picker
              v-model="filterParams.rangeDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="padding-top: 37px;">
            <el-button @click="resSearch" :loading="resSearchLoading" size="small">重置</el-button>
            <el-button type="primary" @click="onSubmit" size="small" :loading="searchLoading">查询搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="users"
        v-loading="showTableLoading"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="id"
          label="用户ID"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="portrait"
          label="头像"
          width="60">
          <template slot-scope="scope">
            <el-avatar
              size="small"
              :src="scope.row.portrait || require('@/assets/default-avatar.png')"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="100">
          <template slot-scope="scope">
            <i v-if="scope.row.status === 'ENABLE'" title="正常"  class="status status-success"></i>
            <i v-else title="启用" @click="handleEnableUser(scope.row.id)"  class="status status-danger"></i>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'ENABLE'"
              size="mini"
              type="text"
              @click="disableUser(scope.row)">禁用</el-button>
            <el-button
              size="mini"
              type="text"
              @click="allocRole(scope.row)">分配角色</el-button>
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
        :page-sizes="[10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="40%">
        <el-select v-model="roleIdList" size="small" placeholder="请选择" multiple
            clearable style="width: 90%;">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleAllocRole"
            :loading="showLoading">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages, forbidUser, enableUser } from '../../../services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'
import { formatUserTime } from '@/utils/utils'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      users: [],
      roles: [] as never,
      roleIdList: [],
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      showTableLoading: false,
      dialogVisible: false,
      searchLoading: false,
      resSearchLoading: false,
      totalPage: 0,
      showLoading: false,
      formLabelWidth: '150px',
      currentUser: null
    }
  },
  created () {
    this.loadUserList()
  },
  methods: {
    async handleEnableUser (r: any) {
      await enableUser(r)
      this.$message.success('ok')
      this.loadUserList()
    },
    async loadUserList () {
      this.showTableLoading = true
      const { data } = await getUserPages(this.filterParams)
      if (data.code === '000000') {
        formatUserTime(data.data.records)
        this.totalPage = data.data.total
        this.users = data.data.records
        this.showTableLoading = false
      }
    },
    handleSizeChange (val: any) {
      this.filterParams.pageSize = val
      this.loadUserList()
    },
    handleCurrentChange (val: any) {
      this.filterParams.currentPage = val
      this.loadUserList()
    },
    resSearch () {
      this.resSearchLoading = true
      this.filterParams.phone = ''
      this.filterParams.startCreateTime = ''
      this.filterParams.currentPage = 1
      this.filterParams.pageSize = 10
      this.loadUserList().then(() => {
        this.resSearchLoading = false
      })
    },
    async onSubmit () {
      this.searchLoading = true
      if (this.filterParams.rangeDate.length > 0) {
        this.filterParams.startCreateTime = this.filterParams.rangeDate[0]
        this.filterParams.endCreateTime = this.filterParams.rangeDate[1]
      }
      await this.loadUserList()
      this.searchLoading = false
    },
    async allocRole (r: any) {
      this.currentUser = r
      const { data } = await getAllRoles()
      this.roles = data.data as never
      const { data: { data: userRoles } } = await getUserRoles(r.id)
      this.roleIdList = userRoles.map((user: any) => user.id)
      this.dialogVisible = true
    },
    async handleAllocRole () {
      this.showLoading = true
      await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      this.showLoading = false
      this.$message.success('操作成功')
      this.dialogVisible = false
    },
    async disableUser (r: any) {
      this.$confirm('是否禁用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await forbidUser(r.id)
        console.log(data)
        if (data.data) {
          this.$message({
            type: 'success',
            message: '禁用成功！'
          })
          this.loadUserList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消！'
        })
      })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
