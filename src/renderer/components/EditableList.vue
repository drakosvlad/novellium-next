<template>
  <div>
    <p v-for="(value, index) in values" :key="index">{{ value }} <button class="form-button-ultrasmall" v-on:click="removeItem(index)">x</button></p>
    <input type="text" class="form-input" id="newitem" v-model="current" v-on:keydown.enter="addItem" />
    <button class="form-button-small form-button-small-main" v-on:click="addItem">+</button>
  </div>
</template>

<script>
export default {
  name: 'EditableList',
  data: function () {
    return {
      current: '',
      values: []
    }
  },
  methods: {
    addItem: function () {
      if (this.current !== '') {
        this.values.push(this.current)
        this.current = ''
      }
    },
    removeItem (index) {
      this.values.splice(index, 1)
    }
  }
}
</script>

<style>

</style>
