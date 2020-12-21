<template>
  <div>
    <create-or-update
      is-edit
      :course-id="courseId"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdate from './component/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    CreateOrUpdate
  }
})
</script>

<style lang="scss" scoped>
</style>
