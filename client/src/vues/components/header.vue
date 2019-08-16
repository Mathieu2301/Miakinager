<template>
    <header>
        <svg class="homebutton" :class="{ turn: $route.path=='/'}" @click="navigate" viewBox="0 0 24 24"><g><path d="M8.92893219,12 L16.7071068,19.7781746 C17.0976311,20.1686989 17.0976311,20.8018639 16.7071068,21.1923882 C16.3165825,21.5829124 15.6834175,21.5829124 15.2928932,21.1923882 L6.80761184,12.7071068 C6.41708755,12.3165825 6.41708755,11.6834175 6.80761184,11.2928932 L15.2928932,2.80761184 C15.6834175,2.41708755 16.3165825,2.41708755 16.7071068,2.80761184 C17.0976311,3.19813614 17.0976311,3.83130112 16.7071068,4.22182541 L8.92893219,12 Z"></path></g></svg>
        <div class="title">{{ $route.name }}</div>
        <svg class="logoutbutton" viewBox="0 0 100 100" @click="logout"><path d="M58.63,96.86A8.85,8.85,0,0,0,63,98a9,9,0,0,0,4.76-1.36L88.36,83.74A11.93,11.93,0,0,0,94,73.57V26.43a11.92,11.92,0,0,0-5.64-10.17L67.74,3.37A9,9,0,0,0,54,11v3H26A12,12,0,0,0,14,26v8a4,4,0,0,0,8,0V26a4,4,0,0,1,4-4H54V78H26a4,4,0,0,1-4-4V66a4,4,0,0,0-8,0v8A12,12,0,0,0,26,86H54v3A9,9,0,0,0,58.63,96.86ZM62,11a.94.94,0,0,1,.51-.86A1,1,0,0,1,63,10a.92.92,0,0,1,.51.16L84.12,23A4,4,0,0,1,86,26.43V73.57A4,4,0,0,1,84.12,77L63.5,89.84a.91.91,0,0,1-1,0A.94.94,0,0,1,62,89V11Z"/><path d="M74,58a4,4,0,0,0,4-4V46a4,4,0,0,0-8,0v8A4,4,0,0,0,74,58Z"/><path d="M32.47,61.69A3.88,3.88,0,0,0,34,62a4,4,0,0,0,2.83-1.17l8-8a4,4,0,0,0,0-5.66l-8-8A4,4,0,0,0,30,42v4H10a4,4,0,0,0,0,8H30v4A4,4,0,0,0,32.47,61.69Z"/></svg>
    </header>
</template>

<script>
export default {
    methods: {
        navigate(){
            if (this.$route.path != "/"){
                this.$router.push('/')
            }else{
                this.$router.go(-1);
            }
        },

        logout(){
            localStorage.removeItem("auth")
        }
    }
}
</script>

<style>
header {
    background-color: var(--color8);
    height: 75px;
    display: grid;
    grid: auto / 75px auto 60px;
    text-align: left;
}

.homebutton {
    fill: var(--color6);
    cursor: pointer;
    margin: 15px;
}

.logoutbutton {
    fill: var(--color6);
    cursor: pointer;
    margin: 15px;
    width: 30px;
    height: 45px;
}

.turn {
    transform: rotate3d(0, 1, 0, 180deg);
}

.title {
    font-size: 30px;
    padding: 20px 0;
    text-shadow: 1px 4px 8px var(--color7);
}
</style>