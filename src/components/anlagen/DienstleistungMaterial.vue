<template>
  <div>
    <v-chip
      v-for="material in zusaetzliches_material"
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
  props: ["zusaetzliches_material"],
};
</script>
