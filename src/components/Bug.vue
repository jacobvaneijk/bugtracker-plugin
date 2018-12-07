<template>
    <div class="container" :style="{ width: settings.width + 'px', height: settings.height + 'px' }">
        <div class="dot" :style="{ top: settings.y + 'px', left: settings.x + 'px' }"></div>
    </div>
</template>

<script>
export default {
    props: {
        settings: Object,
    },
}
</script>

<style lang="sass">
.container {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;

    .dot {
        position: absolute;
        z-index: 5000;
        width: 30px;
        height: 30px;
        background-color: #fff;
        border-radius: 50%;
        pointer-events: auto;
        cursor: pointer;
    }
}
</style>
