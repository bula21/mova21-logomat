<template>
  <v-app>
    <v-system-bar light color="#ffeb00" height="auto" class="py-2" app>
      <p class="my-0">
        <span v-if="language.indexOf('fr') > -1">
          Le "LOGomat" n'est pas tenu à jour pendant le mova, car des
          adaptations sont effectuées pendant le montage. Si vous avez des
          questions, la centrale LOG (<a style="color:black" href="tel:0275102222"
            >027&nbsp;510&nbsp;22&nbsp;22</a
          >) vous aidera volontiers.
        </span>
        <span v-else>
          Der LOGomat wird während dem mova nicht aktuell gehalten, da während
          dem Aufbau Anpassungen gemacht werden. Bei Fragen hilft die
          LOG-Zentrale (<a style="color:black" href="tel:0275102222">027&nbsp;510&nbsp;22&nbsp;22</a
          >) gerne weiter.
        </span>
      </p>
    </v-system-bar>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    language() {
      return window?.navigator?.language ?? "de";
    },
  },
};
</script>
