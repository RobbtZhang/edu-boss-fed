<template>
  <div class="add-or-edit-advert-space">
    <el-card class="box-card" style="padding: 0 30px">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="广告位名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="isCreateAdSpaceLoading" type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateSpace, getSpaceById } from '@/services/advert'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'AddOrEditAdvertSpace',
  data () {
    return {
      isCreateAdSpaceLoading: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入广告名', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getSpaceNameById()
  },
  methods: {
    async getSpaceNameById () {
      if (this.$route.query.id) {
        const { data } = await getSpaceById({
          id: this.$route.query.id
        })
        if (data.state === 1) {
          this.form = data.content
        }
      }
    },
    async onSubmit () {
      // 1.表单验证
      try {
        await (this.$refs.form as Form).validate()
        // 提交按钮loading
        this.isCreateAdSpaceLoading = true
        // 2. 通过验证 提交表单
        const { data } = await saveOrUpdateSpace(this.form)
        if (data.state === 1) {
          if ((this.form as any).id) {
            this.$message.success('修改成功')
          } else {
            this.$message.success('添加成功')
          }
          this.$router.back()
        }
      } catch (err) {
        console.log(err)
      }
      this.isCreateAdSpaceLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
