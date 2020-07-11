<!--suppress CssUnusedSymbol -->
<template>
  <div></div>
</template>

<script>
import clippy from "clippyjs";

export default {
  name: "Clippy",
  created() {
    if (this.clippyDismissed === true) {
      return;
    }

    if (Math.random() >= this.showProbability) {
      return;
    }

    clippy.load("Clippy", (agent) => {
      // disable sounds
      agent._animator._playSound = () => {};

      this.clippy = agent;
      setTimeout(() => {
        this.clippy.show();
        this.clippy.speak(
          `Wie es aussieht, versuchen Sie ein BuLa zu organisieren. Hätten Sie gerne Hilfe?`
        );
      }, 0);
      setTimeout(() => this.clippyAnimateForever(), 10000);
    });
  },
  methods: {
    clippyAnimateForever() {
      setTimeout(() => this.clippyAnimateForever(), 5000);
      if (this.clippyDismissed === true || this.clippy === undefined) {
        return;
      }
      this.clippy.animate();
    },
  },
  props: {
    showProbability: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style>
.clippy,
.clippy-balloon {
  position: fixed;
  z-index: 1000;
  cursor: pointer;
}

.clippy-balloon {
  background: #ffc;
  color: black;
  padding: 8px;
  border: 1px solid black;
  border-radius: 5px;
}

.clippy-content {
  max-width: 200px;
  min-width: 120px;
  font-family: "Microsoft Sans", sans-serif;
  font-size: 10pt;
}

.clippy-tip {
  width: 10px;
  height: 16px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAMAAAAlvKiEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRF///MAAAA////52QwgAAAAAN0Uk5T//8A18oNQQAAAGxJREFUeNqs0kEOwCAIRFHn3//QTUU6xMyyxii+jQosrTPkyPEM6IN3FtzIRk1U4dFeKWQiH6pRRowMVKEmvronEynkwj0uZJgR22+YLopPSo9P34wJSamLSU7lSIWLJU7NkNomNlhqxUeAAQC+TQLZyEuJBwAAAABJRU5ErkJggg==)
    no-repeat;
  position: absolute;
}

.clippy-top-left .clippy-tip {
  top: 100%;
  margin-top: 0;
  left: 100%;
  margin-left: -50px;
}

.clippy-top-right .clippy-tip {
  top: 100%;
  margin-top: 0;
  left: 0;
  margin-left: 50px;
  background-position: -10px 0;
}

.clippy-bottom-right .clippy-tip {
  top: 0;
  margin-top: -16px;
  left: 0;
  margin-left: 50px;
  background-position: -10px -16px;
}

.clippy-bottom-left .clippy-tip {
  top: 0;
  margin-top: -16px;
  left: 100%;
  margin-left: -50px;
  background-position: 0 -16px;
}
</style>
