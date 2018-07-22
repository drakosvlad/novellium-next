<template>
    <div class="toolbar">
        <icons-bar v-for="toolbar in toolbars" v-bind:bg="toolbar.bg" v-bind:buttons="toolbar.buttons" :key="toolbar.name"></icons-bar>
    </div>
</template>

<script>
import IconsBar from './IconsBar.vue'

export default {
  name: 'TopBar',
  components: {
    IconsBar
  },
  data: function () {
    return {
      toolbars: [
        {
          bg: '#007d1d',
          name: 'file',
          buttons: [
            { icon: '/static/icons/newfile.png', event: 'newproject' },
            { icon: '/static/icons/open.png', event: 'openproject' },
            { icon: '/static/icons/save.png', event: 'saveproject' }
          ]
        },
        {
          bg: '#007d1d',
          name: 'nodes',
          buttons: [
            { icon: '/static/icons/newnode.png', event: 'newnode' },
            { icon: '/static/icons/delnode.png', event: 'delnode' }
          ]
        }
      ]
    }
  }
}
</script>

<style>
.toolbar {
  display: flex;
  background: #007d1d;
}
</style>
