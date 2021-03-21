import Vue from "vue";
import Vuetify from "vuetify/lib";

import de from "vuetify/es5/locale/de";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  // see https://vuetifyjs.com/en/features/icon-fonts/#material-design-icons
  icons: {
    iconfont: "mdi",
  },
  theme: {
    dark: false,
    // see https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=ffeb00&secondary.color=55c0ff
    // and
    // https://avanti.bula21.ch/x/mQEP
    themes: {
      // https://vuetifyjs.com/en/features/theme/#customizing
      light: {
        primary: "#1e88e5",
        secondary: "#ffeb3b",
        accent: "#e6500f",
        anchor: "#000000",
      },
      dark: {
        primary: "#005cb2",
        secondary: "#c8b900",
        accent: "#c6450d",
        anchor: "#ffffff",
      },
    },
  },
  lang: {
    locales: { de },
    current: "de",
  },
});

// rg color
// rg dark
