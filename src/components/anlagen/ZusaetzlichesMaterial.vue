<template>
  <div>
    <v-chip
      v-for="material in zusaetzlichesMaterial"
      :key="material['Material']"
      label
      small
      style="margin: 1px"
      :input-value="true"
    >
      {{ material["Stückzahl"] }} {{ material["Material"] }}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "ZusaetzlichesMaterial",
  props: ["zusaetzlichesMaterial"],
};
</script>
