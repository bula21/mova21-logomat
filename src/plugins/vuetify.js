import Vue from "vue";
import Vuetify from "vuetify/lib";

import de from "vuetify/es5/locale/de";
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    dark: false,
  },
  themes: {
    light: {
      primary: "#ffeb00",
      secondary: "#55c0ff",
      accent: "#8c9eff",
      error: "#b71c1c",
    },
    dark: {
      primary: "#ffeb00",
      secondary: "#55c0ff",
      accent: "#8c9eff",
      error: "#b71c1c",
    },
  },
  lang: {
    locales: { de },
    current: "de",
  },
});
