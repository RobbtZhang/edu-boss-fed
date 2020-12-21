<template>
  <div class="advert-add-edit">
    <el-card class="box-card" style="padding: 0 30px">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="广告名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="广告位置">
          <el-select v-model="form.spaceId" placeholder="请选择">
            <el-option
              v-for="item in allSpaceList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-ddThh:mm:ss.000Z"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-ddThh:mm:ss.000Z"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上线/下线">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">下线</el-radio>
            <el-radio :label="1">上线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程封面">
          <course-image v-model="form.img" />
        </el-form-item>
        <el-form-item label="广告链接" prop="name">
          <el-input v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item label="广告备注">
          <el-input type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="isCreateAdLoading" type="primary" @click="onSubmit">提交</el-button>
          <el-button
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CourseImage from '../../course/component/CourseImage.vue'
import { saveOrUpdate, getAllSpaces, getAdById } from '@/services/advert'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'AdvertAddOrEdit',
  components: {
    CourseImage
  },
  data () {
    return {
      form: {
        name: '',
        spaceId: null,
        keyword: '',
        htmlContent: '',
        text: '',
        img: '',
        link: '',
        startTime: '',
        endTime: '',
        status: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入广告名', trigger: 'blur' }
          // { min: 1, max: 18, message: '长度在6-18个字符', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请输入到期时间', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入广告路径', trigger: 'blur' }
          // { min: 1, max: 18, message: '长度在6-18个字符', trigger: 'blur' }
        ]
      },
      isCreateAdLoading: false,
      allSpaceList: [],
      advert: {}
    }
  },
  created () {
    this.loadAdInfo()
    this.getAllSpaceList()
  },
  methods: {
    async getAllSpaceList () {
      const { data } = await getAllSpaces()
      this.allSpaceList = data.content
    },
    async loadAdInfo () {
      if (this.$route.query.id) {
        const { data } = await getAdById({
          id: this.$route.query.id
        })
        this.form = data.content
      }
    },
    async onSubmit () {
      // 1.表单验证
      try {
        await (this.$refs.form as Form).validate()
        // 提交按钮loading
        this.isCreateAdLoading = true
        // 2. 通过验证 提交表单
        const { data } = await saveOrUpdate(this.form)
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
      this.isCreateAdLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
