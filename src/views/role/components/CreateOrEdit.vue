<template>
  <div>
    <el-form :model="role">
      <el-form-item label="角色名称：" :label-width="formLabelWidth"
      size="small">
        <el-input v-model="role.name" autocomplete="off"
        style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="角色编码：" :label-width="formLabelWidth"
      size="small">
        <el-input v-model="role.code" autocomplete="off"
        style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item label="描述：" :label-width="formLabelWidth"
      size="small">
        <el-input
          type="textarea"
          :rows="5"
          v-model="role.description"
          style="width: 250px;">
        </el-input>
      </el-form-item>
      <el-form-item style="display: flex; justify-content: flex-end;padding-top: 30px;margin-bottom: 0">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" :loading="addRoleLoading" @click="submit">确 认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { createOrUpdate } from '../../../services/role'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    role: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      // form: {
      //   name: '',
      //   code: '',
      //   description: ''
      // },
      formLabelWidth: '150px',
      addRoleLoading: false
    }
  },
  // created () {
  //   if (this.role) {
  //     this.form = this.role
  //   }
  // },
  methods: {
    cancel () {
      this.$emit('cancelAdd')
    },
    async submit () {
      if (this.role.name && this.role.code) {
        this.addRoleLoading = true
        const { data } = await createOrUpdate(this.role)
        if (data.code === '000000') {
          this.addRoleLoading = false
          this.$emit('success')
        }
      } else {
        this.$message({
          message: '请输入要添加的角色名。编码',
          type: 'warning'
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
