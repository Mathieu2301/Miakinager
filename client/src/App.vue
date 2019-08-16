<template>
  <div id="app">
    <miak-header></miak-header>
    <transition :name="transitionName">
      <router-view/>
    </transition>
    <miak-footer></miak-footer>
  </div>
</template>

<style>

:root {
  --color0: #000;
  --color1: #FFF;
  --color2: #fafdff;
  --color5: #131e29;
  --color6: #2d4252;
  --color7: #455f73;
  --color8: #049467;
  --color9: #00b176;

  --red:    #ff4e4e;
}

body {
  margin: 0;
  background-color: var(--color6);
}

body * {
  transition-duration: .3s
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color2);
}

.clickable, .selectable { cursor: pointer }
.center { text-align:center !important }

a {
  cursor: pointer;
  text-decoration: underline;
  color: var(--color9);
}

@media screen and (max-width: 800px) {
  .negligible { display: none }

  .two-column {
    grid: auto / auto !important;
  }
}

.status {
  color: #2c3e50;
  padding: 6px;
  width: 80px;
  text-align: center;
  line-height: 1;
  box-shadow: 1px 3px 16px -8px var(--color5);
}

.status.online  { background-color: var(--color9) }
.status.offline { background-color: var(--red) }


.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: .5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(65%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-65%, 0);
}
</style>

<script>
import { components } from "@/global.js"

export default {
  components,
  computed: {
    transitionName(){
      return 'slide-' + (this.$route.path == "/" ? 'right' : 'left')
    }
  }
}
</script>
