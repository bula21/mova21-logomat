<template>
  <a v-if="item" :href="item" target="_blank" v-on:click.stop> Link </a>
  <v-icon v-else>mdi-diameter-variant</v-icon>
</template>

<script>
export default {
  name: "OrdnerLink",
  props: {
    item: {
      type: String,
      default: () => null,
    },
  },
};
</script>
