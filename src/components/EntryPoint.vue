<template>
    <button @click="$emit('click')">Entry!</button>
</template>

<script>
export default {
}
</script>

<style scoped>
button {
    position: absolute;
    right: 5px;
    bottom: 5px;
}
</style>
