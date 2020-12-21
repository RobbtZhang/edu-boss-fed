<template>
  <div class="add-advert">
    <add-or-edit></add-or-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AddOrEdit from './component/addOrEdit.vue'

export default Vue.extend({
  name: 'AddAdvert',
  components: {
    AddOrEdit
  }
})
</script>

<style lang="scss" scoped>
</style>
