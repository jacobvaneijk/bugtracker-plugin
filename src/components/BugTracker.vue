<template>
    <div>
        <p v-if="opened">Hi from the plugin</p>

        <EntryPoint @click="opened = !opened" />
    </div>
</template>

<script>
import EntryPoint from './EntryPoint'

export default {
    components: { EntryPoint },
    data: () => {
        return {
            opened: false,
        }
    },
}
</script>

<style scoped>
p {
    color: #f0f;
}
</style>
