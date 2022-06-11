<template>
  <div id="app">
    <GlobalHeader />
    <main>
      <Fade>
        <router-view></router-view>
      </Fade>
    </main>
  </div>
</template>

<script>
import Fade from "./components/Base/Fade";
import GlobalHeader from "./common/GlobalHeader";
export default {
  name: "App",
  components: {
    Fade,
    GlobalHeader,
  },
};
</script>

<style lang="scss">
html,
body,
p {
  margin: 0;
  border: 0;
  padding: 0;
}
#app {
  font-family: "Times New Roman", Georgia, Serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.icon {
  width: 1.15em;
  height: 1.15em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
