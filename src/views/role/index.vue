<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="输入搜索" size="small">
            <el-input v-model="searchName" placeholder="角色名称" style="width: 215px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" :loading="resLoading" @click="resSubmit">重置</el-button>
            <el-button size="small" :loading="searchLoading" type="primary" @click="onSubmit">查询搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button
          size="mini"
          style="margin-bottom: 20px;"
          @click="addRole">
            添加角色
          </el-button>
      </div>
      <el-table
        :data="roles"
        :loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
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
              type="text"
              @click="$router.push({
                name: 'alloc-menu',
                params: {
                  roleId: scope.row.id
                }
              })">
              分配菜单
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="$router.push({
                name: 'alloc-resource',
                params: {
                  roleId: scope.row.id
                }
              })">
                分配资源
              </el-button>
              <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :hide-on-single-page="rolesTotal/form.size<=1"
        :disabled="tableLoading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[3, 5, 10]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="rolesTotal">
      </el-pagination>
    </el-card>
    <el-dialog
      @close="onClose"
      :title="editRole.id?'编辑角色':'添加角色'"
      :visible.sync="dialogVisible"
      width="40%">
      <create-or-edit-role
        @success="onSuccess"
        @cancelAdd="onCancel"
        :role="editRole"
        ></create-or-edit-role>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoles, deleteRoles } from '../../services/role'
import { formatTime } from '../../utils/utils'
import CreateOrEditRole from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'RoleIndex',
  components: {
    CreateOrEditRole
  },
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      form: {
        current: 1,
        size: 3,
        name: ''
      },
      searchName: '',
      roles: [],
      rolesTotal: 0,
      tableLoading: false,
      searchLoading: false,
      resLoading: false,
      dialogVisible: false,
      editRole: {
        id: null,
        name: '',
        code: '',
        description: ''
      }
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.tableLoading = true
      const { data } = await getRoles(this.form)
      if (data.code === '000000') {
        formatTime(data.data.records)
        this.rolesTotal = data.data.total
        this.roles = data.data.records
      }
      this.tableLoading = false
    },
    resSubmit () {
      this.searchName = ''
      this.form.name = ''
      this.form.current = 1
      this.form.size = 3
      this.resLoading = true
      this.loadRoles().then(() => {
        this.resLoading = false
      })
    },
    onSubmit () {
      if (this.searchName) {
        this.form.name = this.searchName
        this.searchLoading = true
        this.loadRoles().then(() => {
          this.searchLoading = false
        })
      } else {
        this.$message({
          message: '请输入角色名称！',
          type: 'warning'
        })
      }
      this.form.name = ''
    },
    handleSizeChange (val: any) {
      this.form.size = val
      this.form.current = 1
      this.loadRoles()
    },
    handleCurrentChange (val: any) {
      this.form.current = val
      this.loadRoles()
    },
    addRole () {
      this.dialogVisible = true
    },
    onCancel () {
      this.dialogVisible = false
      this.$message({
        message: '取消添加！',
        type: 'info'
      })
    },
    onSuccess () {
      if (this.editRole.id) {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
      } else {
        this.$message({
          message: '添加成功！',
          type: 'success'
        })
      }
      this.dialogVisible = false
      this.loadRoles()
    },
    handleDelete (r: any) {
      this.$confirm('删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteRoles(r.id)
        if (data.code === '000000') {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.loadRoles()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEdit (r: any) {
      this.editRole = r
      this.dialogVisible = true
    },
    onClose () {
      this.editRole = {
        id: null,
        name: '',
        code: '',
        description: ''
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.box-card {
  .demo-form-inline {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
