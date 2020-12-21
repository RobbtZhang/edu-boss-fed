<template>
  <div class="edit-advert-sapce">
    <add-or-edit></add-or-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AddOrEdit from './component/AddOrEdit.vue'

export default Vue.extend({
  name: 'EditAdvertSpace',
  components: {
    AddOrEdit
  }
})
</script>

<style lang="scss" scoped>
</style>
