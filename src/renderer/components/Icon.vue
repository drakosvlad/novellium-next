<template>
  <button class="toolbtn">
    <img v-bind:src="picture" />
  </button>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    picture: String
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
}
</style>
