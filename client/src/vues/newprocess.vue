<template>
    <div class="middle">
    
        <div v-if="loaded">
            <table>
                <tr>
                    <th class="center">ID</th>
                    <th class="center">Name</th>
                    <th class="center">Version</th>
                    <th class="center">Description</th>
                </tr>

                <tr class="selectable" v-for="(process, id) in unactive_processes" :key="process.id" @click="active(id)">
                    <td class="center">{{ id }}</td>
                    <td class="center">{{ process.name }}</td>
                    <td class="center">{{ process.version }}</td>
                    <td class="center" v-if="process.description">{{ process.description }}</td>
                    <td class="center grey" v-else>No description</td>
                </tr>
            </table>
        </div>

        <loader v-else></loader>
    </div>
</template>

<script>
import { components } from "@/global.js"
import iziToast from 'izitoast';

export default {
    components,

    data(){
        return {
            loaded: false,
            unactive_processes: {}
        }
    },

    mounted(){
        this.load()
    },

    methods: {
        active(id){
            this.api.setActive(id, rs => {
                if (rs.success){
                    this.load()
                    this.$router.push("/")
                    iziToast.success({ title: "Success", message: rs.message })
                }
            })            
        },

        load(){
            this.api.getUnactive(processes => {
                this.unactive_processes = processes
                this.loaded = true
            })
        }
    }
}
</script>

<style scoped>

</style>