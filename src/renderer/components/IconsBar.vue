<template>
  <div id="iconsbar" v-bind:style="{background: bg}">
    <icon v-for="button in buttons" v-bind:picture="button.icon" v-bind:key="button.event" v-bind:event="button.event" v-on:btnclick="fire"></icon>
    <div class="delimiter"></div>
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
    buttons: Array
  },
  methods: {
    fire: function (e) {
      this.$emit('btnclick', e)
    }
  }
}
</script>

<style>
.delimiter {
  height: 50px;
  width: 20px;
}

#iconsbar {
  display: flex;
}
</style>
