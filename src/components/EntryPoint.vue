<template>
    <button @click="$emit('click')">Bug tracker</button>
</template>

<script>
export default {
}
</script>

<style lang="sass" scoped>
* {
    box-sizing: border-box;
}

button {
    position: fixed;
    right: 25px;
    bottom: 25px;
    z-index: 1300;
    width: 50px;
    height: 50px;
    text-indent: -9999px;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml,%3Csvg width='1792' height='1792' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1088 1248v224q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-224q0-26 19-45t45-19h256q26 0 45 19t19 45zm30-1056l-28 768q-1 26-20.5 45t-45.5 19h-256q-26 0-45.5-19t-20.5-45l-28-768q-1-26 17.5-45t44.5-19h320q26 0 44.5 19t17.5 45z' fill='%23fff'/%3E%3C/svg%3E");
    background-color: #ff6961;
    background-size: 25px 25px;
    border-radius: 50%;
    border: 0;
    box-shadow: 0 2px 5px rgba(#000, .2);
    cursor: pointer;
    transition: bottom ease-in-out .2s, box-shadow ease-in-out .2s, background-color ease-in-out .2s;

    &:hover {
        bottom: 26px;
        background-color: darken(#ff6961, 5%);
        box-shadow: 0 2px 5px rgba(#000, .3);
    }
}
</style>
