import Vue from "vue";
import VueSanitize from "vue-sanitize";

const defaultOptions = {
  allowedTags: ["br"],
  allowedAttributes: {},
};

Vue.use(VueSanitize, defaultOptions);
