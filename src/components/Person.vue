<template>
  <span v-if="item">{{ item.first_name }} {{ item.last_name }}</span>
  <v-icon v-else>mdi-diameter-variant</v-icon>
</template>

<script>
export default {
  name: "Person",
  props: {
    item: Object,
  },
};
</script>
