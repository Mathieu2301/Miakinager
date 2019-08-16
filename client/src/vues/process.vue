<template>
  <div class="process">
    <div class="two-column" v-if="loaded">

      <div>

        <h2>Actions</h2>
        <div class="actions">
          <a class="action red"   @click="action('stop')" v-if="infos.status=='online'">Stop</a>
          <a class="action green" @click="action('restart')" v-else>Start</a>
          <a class="action green" @click="action('reload')">Reload</a>
          <a class="action green" @click="action('restart')">Restart</a>
          <a class="action red"   @click="action('delete')">Delete</a>
        </div>

        <div class="separator"></div>

        <h2>PM2 infos</h2>
        <table>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
          <tr v-for="(info, key) in infos" :key="key">
            <td>{{ key  | naming }}</td>
            <td><div :class="{ status: key=='status', online: info=='online', offline: info!='online' }">{{ info | parse(key) }}</div></td>
          </tr>
        </table>
      </div>

      <div>
        <div>
          <h2>Logs</h2>
          <ul class="logs">
            <li v-for="(log, key) in logs" :key="key">{{log}}</li>
          </ul>
        </div>

        <div>
          <h2>Errors</h2>
          <ul class="logs errlogs">
            <li v-for="(log, key) in err_logs" :key="key">{{log}}</li>
          </ul>
        </div>
      </div>

    </div>
    <loader v-else></loader>
  </div>
</template>

<script>
  import { components, filters } from "@/global.js"

  import moment from 'moment'
  import izitoast from 'izitoast'

  export default {
    components,

    data() {
      return {
        loaded: false,
        infos: {},
        logs: [],
        err_logs: []
      }
    },

    created(){
      this.api.event.process = this.$route.params.id
      this.api.event.onprocess = process => {
        if (process && process.infos){
          this.infos      = process.infos
          this.logs       = process.logs
          this.err_logs   = process.err_logs
          this.loaded     = true
        }else{
          if (this.$route.params.id) izitoast.error({message: `The process ${this.$route.params.id} doesn't exists`})
          this.$router.replace('/')
        }
      }
    },

    methods: {
      action(action){
        this.api.process(this.$route.params.id).action(action, rs => {
          if (rs.success) izitoast.success( { title: "Success", message: rs.message         })
          else            izitoast.error(   { title: "Error",   message: rs.error.message   })
          
          if (action == "delete") this.$router.replace('/');
        });
      }
    },

    filters: {
      ...filters,

      naming(val){
        return {
          id: "Process ID",
          name: "Process name",
          username: "Username",
          version: "Version",
          memory: "Memory usage",
          cpu: "CPU usage",
          restarts: "Restarts",
          unstable_restarts: "Unstable restarts",
          interpreter: "Interpreter",
          instances: "Instance number",
          uptime: "Started",
          status: "Status"

        }[val]
      },

      parse(val, type){
        switch (type) {
          case "interpreter": return filters.uppercasefirst(val);
          case "memory": return filters.memory(val) + " Mo";
          case "cpu": return val + "%";
          case "status": return filters.uppercasefirst(val);
          case "uptime": return moment(val).fromNow()
          default: return val;
        }
      }
    }

  }
</script>

<style scoped>

.two-column {
  margin: 50px;
  display: grid;
  grid: auto / 50% 50%;
}

table {
  border-collapse: collapse;
  width: calc(100% - 50px);
  font-size: 18px;
  line-height: 30px;
  margin: 0 auto;
}

th, td {
  padding: 8px;
  text-align: left;
}

tr {
  border-bottom: 1px solid var(--color7);
}

.actions {
  display: grid;
  grid: auto / 50% 50%;
  grid-gap: 5px;
  width: 300px;
  margin: 0 auto;
}

.actions > .action {
  padding: 5px 0;
  font-size: 18px;
  line-height: 25px;
  color: var(--color2);
  text-decoration: none;
  background-color: var(--color7);
}

.action.red          { box-shadow: inset 0px -2px var(--red) }
.action.red:hover    { box-shadow: inset 0px -35px var(--red) }

.action.green        { box-shadow: inset 0px -2px var(--color9) }
.action.green:hover  { box-shadow: inset 0px -35px var(--color9) }

.logs {
  background-color: var(--color5);
  margin: 20px;
  padding: 25px 30px;
  border-radius: 7px;
  box-shadow: 1px 3px 16px -6px var(--color5);
  text-align: left;
  list-style: none;
  font-family: monospace;
  font-size: 17px;
  min-height: 300px
}

.logs.errlogs { color: var(--red) }

.logs > *:before { content: "> " }

.separator { height:50px }

</style>