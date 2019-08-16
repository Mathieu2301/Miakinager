<template>
  <div class="middle">
    
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

  export default {
    components, filters,

    data() {
      return {
        loaded: false,
        processes: []
      }
    },

    created(){
      this.api.event.onlist = ps => {
        this.processes = ps
        this.loaded = true
      }
    },

    methods: {

      select(process){
        this.$router.push("/p/" + process.name)
      },

      add_process(){
        this.$router.replace("/active")
      }
    },
  }
</script>


<style scoped>

</style>
