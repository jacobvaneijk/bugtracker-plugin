<template>
    <button @click="$emit('click')">Bug tracker</button>
</template>

<script>
export default {
}
</script>

<style scoped>
button {
    position: fixed;
    right: 25px;
    bottom: 25px;
    z-index: 1300;
    width: 50px;
    height: 50px;
    text-indent: -9999px;
    background-color: #ff6961;
    border-radius: 50%;
    border: 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
    cursor: pointer;
    transition: bottom ease-in-out .2s, box-shadow ease-in-out .2s, background-color ease-in-out .2s;
}

button:hover {
    bottom: 26px;
    background-color: #ff584f;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .3);
}
</style>
