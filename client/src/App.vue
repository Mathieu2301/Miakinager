<template>
  <div id="app">
    <miak-header></miak-header>
    <transition :name="transitionName">
      <router-view/>
    </transition>
    <miak-footer></miak-footer>
  </div>
</template>

<script>
export default {
  created(){
    if (!localStorage.getItem("auth")){
      console.log(this.router)
      console.log(this.route)
      this.route.replace("/login")
    }
  }
}
</script>

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

.middle {
  position: absolute;
  --width: 900px;
  top: 30%;
  left: calc(50% - (var(--width)/2));
  width: var(--width);
}

table {
  border-collapse: collapse;
  width: 100%;
  box-sizing: border-box;
  font-size: 18px;
  line-height: 40px;  
}

th, td {
  padding: 8px;
  text-align: left;
}

tr {
  border-bottom: 1px solid var(--color7);
}

.selectable:hover {
  border-bottom: 1px solid var(--color9);
}

.add_process {
  line-height: 40px;
  padding: 8px;
  font-size: 40px;
  font-family: none;
  cursor: pointer;
  box-shadow: inset 0px -1px var(--color9);
}

.add_process:hover { box-shadow: inset 0px -57px var(--color9) }

</style>

<script>
import { components } from "@/global.js"

export default {
  components,
  computed: {
    transitionName(){
      return 'slide-' + (["/", "/login"].includes(this.$route.path) ? 'right' : 'left')
    }
  }
}
</script>
