<template>
  <div class="list">
    
    <div v-if="loaded">
      <table>
        <tr>
          <th class="center">Name</th>
          <th class="center">Version</th>
          <th class="center">CPU</th>
          <th class="center">Memory</th>
          <th class="center negligible">Instances</th>
          <th class="center negligible">Restarts</th>
          <th class="center negligible">Username</th>
          <th></th>
        </tr>

        <tr class="selectable" v-for="process in processes" :key="process.id" @click="select(process)">
          <td class="center">{{ process.name }}</td>
          <td class="center">{{ process.version }}</td>
          <td class="center">{{ process.cpu }}%</td>
          <td class="center">{{ process.memory | memory }} Mo</td>
          <td class="center negligible">{{ process.instances }}</td>
          <td class="center negligible">{{ process.restarts }}</td>
          <td class="center negligible">{{ process.username }}</td>
          <td><div class="status" :class="{ online: process.status=='online', offline: process.status!='online' }">{{ process.status | uppercasefirst }}</div></td>
        </tr>
      </table>

      <div class="add_process" @click="add_process">+</div>
    </div>

    <loader v-else></loader>
  </div>
</template>

<script>
  import { components, filters } from "@/global.js"
  import iziToast from 'izitoast';

  export default {
    components, filters,

    data() {
      return {
        loaded: false,
        processes: []
      }
    },

    mounted(){
      // this.refresh()
      setInterval(this.refresh, 1000)
    },

    methods: {

      refresh(){
        this.api.getList(ps => {
          this.processes = ps
          this.loaded = true
        })
      },

      select(process){
        this.$router.replace("/" + process.name)
      },

      add_process(){
        this.$router.replace("/new")
      }
    },
  }
</script>


<style scoped>

.list {
  max-width: 900px;
  margin: 100px auto;
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

/* .selectable:nth-child(even) {
  background-color: #bebebe;
} */

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
