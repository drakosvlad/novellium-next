<template>
  <button class="toolbtn" v-on:click="fire">
    <img v-bind:src="picture" />
  </button>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    picture: String,
    event: String
  },
  methods: {
    fire: function (e) {
      this.$emit('btnclick', this.event)
    }
  }
}
</script>

<style>
.toolbtn {
  height: 50px;
  width: 50px;
  padding: 0;
  background: transparent;
  border: none;
}

img {
  height: 70%;
  width: auto;
  filter: invert();
}

.toolbtn:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
