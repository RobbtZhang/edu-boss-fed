<template>
  <div class="create-or-update">
    <course-header
      :title="isEdit ? course.courseName : '新增课程'"
      btn-name="保存"
      @handleClick="handSave"
    >
    </course-header>
    <el-card>
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            v-for="(step, index) in steps"
            :key="index"
            :title="step.title"
            @click.native="activeStep = index"
            :icon="step.icon"
            style="cursor: pointer"
          >
          </el-step>
        </el-steps>
      </div>
      <el-form label-width="120px"
        :model="course"
        :rules="rules"
        ref="ruleForm">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
             <div style="display: flex;">
               <el-input
                style="margin-right: 20px"
                v-model="course.previewFirstField"
                placeholder="概述1"
                maxlength="20" show-word-limit
              ></el-input>
              <el-input
                v-model="course.previewSecondField"
                placeholder="概述2"
                maxlength="20" show-word-limit
              ></el-input>
             </div>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description">></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input
              type="number"
              v-model="course.sortNum"
              style="width:100%"
              controls-position="right">
              <template slot="append">数字控制排序，数字越大越靠后</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <el-form-item label="课程封面">
            <course-image v-model="course.courseListImg" />
          </el-form-item>
          <el-form-item label="介绍封面">
            <course-image v-model="course.courseImgUrl" />
          </el-form-item>
        </div>
         <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input v-model="course.discounts">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model="course.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="course.sales">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag" maxlength="4" show-word-limit></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="course.activityCourse">
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input type="number" v-model="course.activityCourseDTO.amount" style="width:100%" controls-position="right">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input type="number" v-model="course.activityCourseDTO.stock" style="width:100%" controls-position="right">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <text-editor ref="textEditor" v-model="course.courseDescriptionMarkDown"></text-editor>
            <!-- <el-input v-model="course.courseDescriptionMarkDown" type="textarea"></el-input> -->
          </el-form-item>
          <el-form-item label="是否发布">
            <el-switch
              v-model="course.status"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button v-if="activeStep > 0 && activeStep <= 4" type="primary" @click="activeStep--">上一步</el-button>
          <el-button v-if="activeStep >= 0 && activeStep < 4" type="primary" @click="activeStep++">下一步</el-button>
          <el-button v-if="activeStep === 4"
            type="primary"
            @click="handSave"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
import CourseImage from './CourseImage.vue'
import CourseHeader from './CourseHeader.vue'
import TextEditor from '@/components/textEditor/index.vue'
import { Form } from 'element-ui'
import moment from 'moment'

export default Vue.extend({
  name: 'CreateOrUpdateCourse',
  components: {
    CourseImage,
    TextEditor,
    CourseHeader
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      activeStep: 0,
      // imageUrl: '', // 预览图片地址
      // isSeckill: false, // 是否开启秒杀
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      steps: [
        { title: '基本信息', icon: 'el-icon-sunny' },
        { title: '课程封面', icon: 'el-icon-sunny' },
        { title: '销售信息', icon: 'el-icon-sunny' },
        { title: '秒杀活动', icon: 'el-icon-sunny' },
        { title: '课程详情', icon: 'el-icon-sunny' }
      ]
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      let activityCourseDTO: any = data.data.activityCourseDTO
      if (activityCourseDTO) {
        activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('YYYY-MM-DD')
        activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format('YYYY-MM-DD')
      } else {
        activityCourseDTO = {}
        activityCourseDTO.beginTime = ''
        activityCourseDTO.endTime = ''
        activityCourseDTO.amount = 0
        activityCourseDTO.stock = 0
      }
      data.data.activityCourseDTO = activityCourseDTO
      this.course = data.data
      const initRenderEditor = this.$refs.textEditor as any
      initRenderEditor.initEditor(data.data.courseDescriptionMarkDown)
    },
    handSave () {
      (this.$refs.ruleForm as Form).validate(async (valid: any) => {
        if (valid) {
          await saveOrUpdateCourse(this.course)
          this.$message.success('保存成功')
          this.$router.back()
        } else {
          this.$message.error('格式不正确')
          return false
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
