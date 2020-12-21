<template>
  <div ref="editor" class="text-editor">
  </div>
</template>

<script lang="ts">
import { uploadCourseImage } from '@/services/course'
import Vue from 'vue'
import E from 'wangeditor'

export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String
    }
  },
  mounted () { // 组件已挂载
    this.initEditor()
  },
  methods: {
    initEditor (txt?: string) {
      const editor = new E(this.$refs.editor as any)
      // 事件监听需要在 create 之前
      editor.config.onchange = (value: string) => {
        this.$emit('input', value)
      }
      editor.create()
      // 初始值需要在 create 之后
      editor.txt.html(txt)
      editor.config.customUploadImg = async function (resultFile: any, insertImgFn: any) {
        // 把用户选择的 resultFiles 上传到服务器
        const fd = new FormData()
        fd.append('file', resultFile[0])
        const { data } = await uploadCourseImage(fd)
        insertImgFn(data.data.name)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
