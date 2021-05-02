<template>
  <div class="dark-mode-switch">
    <v-switch inset hide-details :ripple="false" v-model="inputVal"> </v-switch>
  </div>
</template>

<script>
export default {
  name: "DarkModeSwitch",
  data: () => ({
    show: false,
  }),
  props: ["value"],
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style lang="scss">
.dark-mode-switch {
  .v-input.v-input--switch--inset {
    margin-left: 7px;
    margin-right: -10px;

    .v-input--switch__thumb {
      background-color: white;
    }

    .v-input--switch__track {
      background-color: #125895;
      opacity: 1;
    }

    .v-input--switch__track:after {
      // font-family: "Material Design Icons";
      // content: "\F0594️";
      content: "🌞️";
      color: black; // to disable transparency
      font-size: 17px;
      line-height: 29px;
      padding-left: 26px;
    }
  }

  .v-input.v-input--switch--inset.v-input--is-label-active {
    .v-input--switch__track {
      background-color: #1895ff;
      opacity: 1;
    }

    .v-input--switch__track:after {
      /*content: "\FF67E";*/
      content: "🌜";
      padding-left: 5px;
    }
  }
}
</style>
