<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import "./Style/numeric.css";

export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String
    },
    input: {
      type: Number
    }
  },
  data: () => ({
    keyboard: null
  }),
  mounted() {
    this.keyboard = new Keyboard({
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {C}", "{enter}"]
      },
      display: {
        "{bksp}": "backspace ⌫",
        "{enter}": "Done",
        "{C}": "C"
      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme myTheme"
    });
  },
  methods: {
    onChange(input) {
      console.log("input", input);

      this.$emit("onChange", parseInt(input));
    },
    onKeyPress(button) {
      console.log("button", button);
      if (button == "{bksp}") this.onChange(Math.floor(this.input / 10));
      if (button == "{C}") this.onChange(this.input * 0);

      this.$emit("onKeyPress", button);

      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{lock}") this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    }
  },
  watch: {
    input(input) {
      this.keyboard.setInput(parseInt(input));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  width: 100%;
  height: 100px;
  padding: 20px;
  font-size: 20px;
  border: none;
  box-sizing: border-box;
}

.simple-keyboard {
  max-width: 850px;
}

.simple-keyboard.hg-theme-default.myTheme {
  border: 5px solid rgb(255, 0, 0, 0.7);
  border-radius: 10px;
  margin: 10px;
  width: calc(100% - 20px);
}

.simple-keyboard.hg-layout-default .hg-button.hg-red {
  background: rgb(255, 0, 0, 0.7);
  color: white;
}

.simple-keyboard.hg-layout-default .hg-button.hg-highlight {
  box-shadow: 0px 0px 40px 5px rgba(255, 255, 0, 0.5);
  z-index: 1;
}
</style>