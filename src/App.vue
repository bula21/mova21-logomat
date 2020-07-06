<template>
  <v-app id="inspire">
    <router-view/>
    {{user}}
  </v-app>
</template>

<script>
  export default {
    name: 'App',
    components: {},
    data: () => ({}),
  };
</script>
