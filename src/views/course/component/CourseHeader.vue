<template>
  <div class="header">
    <div class="header-left">
      <span class="back" @click="$router.back()">
        <i class="el-icon-back"></i>
        返回
      </span>
      <span class="new-course">{{title}}</span>
    </div>
    <div class="header-right">
      <el-button
        :icon="iconType"
        type="primary"
        @click="addSectionOrCourse"
        size="middle"
      >
        {{btnName}}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CourseHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    btnName: {
      type: String
    },
    iconType: {
      type: String,
      default: ''
    }
  },
  methods: {
    addSectionOrCourse () {
      this.$emit('handleClick')
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .header-left {
     position: relative;
    .back {
      cursor: pointer;
      font-size: 14px;
      display: inline-block;
      margin-right: 50px;
      &::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 16px;
        left: 72px;
        top: 50%;
        transform: translateY(-50%);
        background-color: #dcdfe6;
      }
    }
    .new-course {
      font-size: 18px;
      color: #303133;
    }
  }
}
</style>
