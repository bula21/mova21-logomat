<template>
  <div>
    <v-chip
      v-for="geraet in geraete"
      :key="geraet['Gerätename']"
      label
      small
      style="margin: 1px"
      :input-value="true"
    >
      {{ geraet["Gerätename"] }}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: "Geraet",
  props: ["geraete"],
};
</script>
