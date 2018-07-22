<template>
  <button class="toolbtn">
    <img v-bind:src="picture" />
  </button>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    picture: String,
    event: String
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
