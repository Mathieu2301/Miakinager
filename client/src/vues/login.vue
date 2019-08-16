<template>
    <form @submit="login">
        <input type="text" value="admin" disabled>
        <input type="password" placeholder="Password" v-model="password">
        <input type="submit" value="Login">
    </form>
</template>

<script>
export default {
    data(){
        return {
            password: ""
        }
    },
    methods: {
        login(e){
            e.preventDefault()
            if (this.password.length > 3){
                this.api.login(this.password)
                this.password = ""
            }
        }
    }
}
</script>

<style>

form {
    position: absolute;
    --width: calc(10% + 275px);
    top: 40%;
    left: calc(50% - (var(--width)/2));
    width: var(--width);
    display: grid;
    grid-gap: 10px;
}

input {
    font-size: 16px;
    cursor: pointer;
    border: 0px;
    border-radius: 3px;
    padding: 10px;
    text-decoration: none;
    white-space: nowrap;
    -webkit-box-shadow: 3px 3px 5px 0px var(--color4);
    box-shadow: 3px 3px 5px 0px var(--color4);
}

input[type=text],
input[type=password] {
    height: 20px;
}

input[type=submit] {
    background-color: var(--color8);
}

</style>