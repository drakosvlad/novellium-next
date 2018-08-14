<template>
  <div class="btnlist">
    <h2>{{ title }}</h2>
    <button class="listButton" v-for="(btn, index) in buttons" :key="index" v-on:click="fire(index)">{{ btn.text }}</button>
  </div>
</template>

<script>
export default {
  name: 'ButtonsList',
  props: {
    title: String
  },
  data: function () {
    return {
      buttons: [
        {
          'text': 'Show character',
          'event': 'show-character'
        },
        {
          'text': 'Move character',
          'event': 'move-character'
        },
        {
          'text': 'Hide character',
          'event': 'hide-character'
        },
        {
          'text': 'Say phrase',
          'event': 'say-phrase'
        },
        {
          'text': 'Dialog',
          'event': 'dialog'
        },
        {
          'text': 'Check condition (if)',
          'event': 'if'
        },
        {
          'text': 'Show background',
          'event': 'background'
        },
        {
          'text': 'Hide UI',
          'event': 'hide-ui'
        },
        {
          'text': 'Show UI',
          'event': 'show-ui'
        },
        {
          'text': 'Play music',
          'event': 'play-music'
        },
        {
          'text': 'Stop music',
          'event': 'stop-music'
        },
        {
          'text': 'Show character',
          'event': 'show-character'
        },
        {
          'text': 'Move character',
          'event': 'move-character'
        },
        {
          'text': 'Hide character',
          'event': 'hide-character'
        },
        {
          'text': 'Say phrase',
          'event': 'say-phrase'
        },
        {
          'text': 'Dialog',
          'event': 'dialog'
        },
        {
          'text': 'Check condition (if)',
          'event': 'if'
        },
        {
          'text': 'Show background',
          'event': 'background'
        },
        {
          'text': 'Hide UI',
          'event': 'hide-ui'
        },
        {
          'text': 'Show UI',
          'event': 'show-ui'
        },
        {
          'text': 'Play music',
          'event': 'play-music'
        },
        {
          'text': 'Stop music',
          'event': 'stop-music'
        }
      ]
    }
  },
  methods: {
    fire: function (index) {
      this.$emit('btnclick', this.buttons[index].event)
    }
  }
}
</script>

<style>

.listButton {
  width: calc(100% - 10px);
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  border: none;
  font-size: 14pt;
  padding: 9px 15px 9px 15px;
}

h2 {
  margin-bottom: 5px;
  margin-left: 5px;
}

.col1 {
  overflow: scroll;
}

</style>
