<template>
    <header>
        <svg class="homebutton" :class="{ turn: $route.path=='/'}" @click="navigate" viewBox="0 0 24 24"><g><path d="M8.92893219,12 L16.7071068,19.7781746 C17.0976311,20.1686989 17.0976311,20.8018639 16.7071068,21.1923882 C16.3165825,21.5829124 15.6834175,21.5829124 15.2928932,21.1923882 L6.80761184,12.7071068 C6.41708755,12.3165825 6.41708755,11.6834175 6.80761184,11.2928932 L15.2928932,2.80761184 C15.6834175,2.41708755 16.3165825,2.41708755 16.7071068,2.80761184 C17.0976311,3.19813614 17.0976311,3.83130112 16.7071068,4.22182541 L8.92893219,12 Z"></path></g></svg>
        <div class="title">{{ $route.name }}</div>
    </header>
</template>

<script>
export default {
    methods: {
        navigate(){
            if (this.$router.path != "/"){
                this.$router.replace('/')
            }else{
                this.$router.go(-1);
            }
        }
    }
}
</script>

<style>
header {
    background-color: var(--color8);
    height: 75px;
    display: grid;
    grid: auto / 75px auto;
    text-align: left;
}

.homebutton {
    fill: var(--color6);
    cursor: pointer;
    margin: 15px;
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