<template>
  <div class="advert-sapce">
    <advert-space-list></advert-space-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AdvertSpaceList from './component/List.vue'

export default Vue.extend({
  name: 'AdvertSpaceIndex',
  components: {
    AdvertSpaceList
  }
})
</script>

<style lang="scss" scoped>
</style>
