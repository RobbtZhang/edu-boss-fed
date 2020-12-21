<template>
  <div class="course-section">
    <course-header
      :title="sectionForm.courseName"
      btn-name="添加阶段"
      icon-type="el-icon-plus"
      @handleClick="showDial(0)"
    />
    <el-card>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
      >
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions" style="width: 300px;">
            <el-button size="small" @click.stop="showDial(0, data)">编辑</el-button>
            <el-button size="small" @click.stop="showDial(1, data)" type="primary">添加课时</el-button>
            <el-button size="small" @click.stop="showDial(2, data)">
              {{data.status === 0 ? '隐藏' : data.status === 1 ? '待更新' : '已更新' }}
            </el-button>
          </span>
          <span v-else class="actions" style="width: 300px;">
            <el-button size="small" @click.stop="showDial(1, data)">编辑</el-button>
            <el-button size="small" type="success"
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId: courseId,
                  courseName: courseName,
                  lessonName: data.theme
                },
                query: {
                  sectionId: node.parent.id,
                  lessonId: data.id
                }
              })"
            >上传视频</el-button>
            <el-button size="small" @click.stop="showDial(2, data)">
              {{data.status === 0 ? '隐藏' : data.status === 1 ? '待更新' : '已更新' }}
            </el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
    <el-dialog
      title="章节信息"
      :visible.sync="sectionDialogVisible"
      width="50%">
      <el-form :model="sectionForm" label-width="80px" :rules="sectionRules" ref="sectionForm">
        <el-form-item label="课程名称">
          <el-input disabled v-model="sectionForm.courseName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="sectionForm.sectionName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节描述">
          <el-input
            type="textarea"
            :rows="2"
            v-model="sectionForm.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input
            type="number"
            v-model="sectionForm.orderNum"
            style="width:100%"
            controls-position="right">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sectionDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateSection"
          :loading="showLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="statusDialogVisible"
      width="30%">
      <div style="text-align: center;">
        <div style="font-size: 60px;">
          <i class="el-icon-sunny"></i>
        </div>
        <div style="font-size: 20px; margin-bottom: 15px;">
          {{`${statusSecName} ${statusLesName}`}} 当前状态：
          {{secOrLesStatus === 0 ? '隐藏' : secOrLesStatus === 1 ? '待更新' : '已更新'}}
        </div>
      </div>
      状态变更为：
      <el-select v-model="secOrLesStatus" placeholder="请选择">
        <el-option label="隐藏" :value="0"></el-option>
        <el-option label="待更新" :value="1"></el-option>
        <el-option label="已更新" :value="2"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="changeStatus"
          :loading="showLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="课时基本信息"
      :visible.sync="lessonDialogVisible"
      width="50%">
      <el-form :model="lessonForm" label-width="100px" :rules="lessonRules" ref="lessonForm">
        <el-form-item label="课程名称">
          <el-input disabled v-model="sectionForm.courseName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节名称">
          <el-input disabled v-model="sectionName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时名称" prop="theme">
          <el-input v-model="lessonForm.theme" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input
            type="number"
            v-model="lessonForm.duration"
            style="width:100%"
            controls-position="right">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听">
          <el-switch  v-model="lessonForm.isFree"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input
            type="number"
            v-model="lessonForm.orderNum"
            style="width:100%"
            controls-position="right">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lessonDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateLesson"
          :loading="showLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CourseHeader from './component/CourseHeader.vue'
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson, getBySectionId } from '@/services/course-section'
import { getCourseById } from '@/services/course'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CourseSection',
  components: {
    CourseHeader
  },
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      statusSecName: '',
      statusLesName: '',
      setStatus: true,
      sectionName: '',
      courseName: '',
      secOrLesStatus: 0,
      sectionForm: {
        courseId: 0,
        courseName: '',
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      },
      lessonForm: {
        courseId: 0,
        sectionId: 0,
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      },
      sectionRules: {
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ]
      },
      lessonRules: {
        theme: [
          { required: true, message: '请输入课时名称', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请输入时长', trigger: 'blur' }
        ]
      },
      sectionDialogVisible: false,
      lessonDialogVisible: false,
      statusDialogVisible: false,
      showLoading: false,
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSections()
    this.getCourse()
  },
  methods: {
    changeStatus () {
      if (this.setStatus) {
        this.sectionForm.status = this.secOrLesStatus
        this.sendSectionReq()
      } else {
        this.lessonForm.status = this.secOrLesStatus
        this.sendLessonReq()
      }
    },
    async sendSectionReq () {
      this.showLoading = true
      const { data } = await saveOrUpdateSection(this.sectionForm)
      if (data.code === '000000') {
        this.$message.success(`${(this.sectionForm as any).id ? '修改成功' : '添加成功'}`)
        this.loadSections()
      }
      this.statusDialogVisible = false
      this.showLoading = false
    },
    addOrUpdateSection () {
      const sectionFromDom = this.$refs.sectionForm as Form
      sectionFromDom.validate((valid: any) => {
        if (valid) {
          this.sendSectionReq().then(() => {
            this.sectionDialogVisible = false
          })
        }
      })
    },
    async sendLessonReq () {
      this.showLoading = true
      const { data } = await saveOrUpdateLesson(this.lessonForm)
      if (data.code === '000000') {
        this.$message.success(`${(this.lessonForm as any).id ? '修改成功' : '添加成功'}`)
        this.lessonForm = {
          courseId: 0,
          sectionId: 0,
          theme: '',
          duration: 0,
          isFree: false,
          orderNum: 0,
          status: 0
        }
        this.loadSections()
      }
      this.statusDialogVisible = false
      this.showLoading = false
    },
    addOrUpdateLesson () {
      const lessonFormDom = this.$refs.lessonForm as Form
      lessonFormDom.validate((valid: any) => {
        if (valid) {
          this.sendLessonReq().then(() => {
            this.lessonDialogVisible = false
          })
        }
      })
    },
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },
    async getCourse () {
      const { data } = await getCourseById(this.courseId)
      this.sectionForm.courseName = this.courseName = data.data.courseName
      this.sectionForm.courseId = this.lessonForm.courseId = data.data.id
    },
    handleSectionForm (section?: any) {
      if (section) {
        (this.sectionForm as any).id = section.id
        this.sectionForm.status = this.secOrLesStatus = section.status
        this.sectionForm.orderNum = section.orderNum
        this.sectionForm.description = section.description
        this.sectionForm.sectionName = this.statusSecName = section.sectionName
        this.statusLesName = ''
      } else {
        delete (this.sectionForm as any).id
        this.sectionForm.status = 0
        this.sectionForm.orderNum = 0
        this.sectionForm.description = ''
        this.sectionForm.sectionName = ''
      }
    },
    async handleLessonForm (lesson: any) {
      if (!lesson.sectionName) {
        (this.lessonForm as any).id = lesson.id
        const { data } = await getBySectionId(lesson.sectionId)
        this.sectionName = data.data.sectionName
        this.lessonForm.sectionId = lesson.sectionId
        this.lessonForm.theme = this.statusLesName = lesson.theme
        this.lessonForm.duration = lesson.duration
        this.lessonForm.isFree = lesson.isFree
        this.lessonForm.orderNum = lesson.orderNum
        this.lessonForm.status = this.secOrLesStatus = lesson.status
      } else {
        delete (this.lessonForm as any).id
        this.sectionName = lesson.sectionName
        this.lessonForm.sectionId = lesson.id
        this.lessonForm.theme = ''
        this.lessonForm.duration = 0
        this.lessonForm.isFree = true
        this.lessonForm.orderNum = 0
        this.lessonForm.status = 0
      }
    },
    async showDial (n: number, section?: any) {
      if (n === 0) {
        this.sectionDialogVisible = true
        this.handleSectionForm(section)
      } else if (n === 1) {
        this.lessonDialogVisible = true
        this.handleLessonForm(section)
      } else if (n === 2) {
        this.statusDialogVisible = true
        if (section.sectionName) {
          this.handleSectionForm(section)
          this.setStatus = true
        } else {
          // this.handleLessonForm(section)
          (this.lessonForm as any) = {
            id: section.id,
            status: section.status
          }
          this.secOrLesStatus = section.status
          this.statusLesName = section.theme
          this.setStatus = false
        }
      }
    },
    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      // draggingNode 拖动的节点
      // dropNode 放置的节点
      // type: prev inner next 目标节点前 插入 目标节点后
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },
    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.sectionName) {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (e) {
        this.$message.error('排序失败')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.el-form {
  margin: 0 50px;
}
.inner {
  display: flex;
  padding: 5px;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
