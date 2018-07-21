<template>
  <div id="iconsbar" v-bind:style="{background: bg}">
    <icon v-for="icon in icons" v-bind:picture="icon" v-bind:key="icon"></icon>
  </div>
</template>

<script>
import Icon from './Icon.vue'

export default {
  name: 'IconsBar',
  components: {
    Icon
  },
  props: {
    bg: String,
    icons: Array
  }
}
</script>

<style>

</style>
