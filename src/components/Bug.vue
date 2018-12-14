<template>
    <div class="container" :style="{ width: settings.width + 'px', height: settings.height + 'px' }">
        <a class="dot" :style="{ top: settings.y + 'px', left: settings.x + 'px' }" :href="trelloUrl" target="_blank"></a>
    </div>
</template>

<script>
export default {
    computed: {
        trelloUrl: function () {
            return `https://trello.com/c/${this.settings.id}`
        },
    },
    props: {
        settings: Object,
    },
}
</script>

<style lang="sass">
* {
    box-sizing: border-box;
}

.container {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;

    .dot {
        position: absolute;
        z-index: 5000;
        display: block;
        width: 30px;
        height: 30px;
        background-color: lighten(#ff4c43, 30%);
        border-radius: 50%;
        border: 2px solid #ff4c43;
        box-shadow: 0 2px 8px rgba(#000, .15);
        pointer-events: auto;
        cursor: pointer;
        transition: background-color ease-in-out .1s;

        &:hover {
            background-color: lighten(#ff4c43, 25%);
        }
    }
}
</style>
