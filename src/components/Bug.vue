<template>
    <div>
        <div class="bt-bug-wrapper" :style="{ width: settings.width + 'px', height: settings.height + 'px' }" data-html2canvas-ignore>
            <div class="bt-bug" :class="{ 'is-active': isOpened }" :style="{ top: settings.y + 'px', left: settings.x + 'px' }" @click="isOpened = !isOpened"></div>
        </div>

        <Popover :x="popover.x" :y="popover.y" v-if="isOpened" @closePopover="isOpened = false">
            <div class="popover__body">
                <h2 class="popover__title">{{ settings.title }}</h2>

                <p class="popover__description" v-if="settings.description">{{ settings.description }}</p>
                <p class="popover__no-description" v-else>Geen beschrijving</p>

                <div class="popover__status">
                    <span class="popover__label">Status</span>
                    <span class="popover__value">In behandeling</span>
                </div>
            </div>

            <template slot="actions">
                <div>
                    <a class="popover__button-secondary" :href="trelloUrl" target="_blank">Bekijk voortgang</a>
                </div>
            </template>
        </Popover>
    </div>
</template>

<script>
import Popover from './Popover'

export default {
    components: { Popover },
    computed: {
        trelloUrl: function () {
            return `https://trello.com/c/${this.settings.id}`
        },
        popover: function () {
            return {
                x: this.settings.x + (30 - 408) / 2,
                y: this.settings.y + 30 + 7,
            }
        },
    },
    props: {
        settings: Object,
    },
    data: () => {
        return {
            isOpened: false,
        }
    },
}
</script>

<style lang="sass">
$font-family: "Roboto", sans-serif;

* {
    box-sizing: border-box;
}

.bt-bug-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;

    .bt-bug {
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

        &.is-active,
        &:hover {
            background-color: lighten(#ff4c43, 25%);
        }
    }
}

.popover {
    pointer-events: auto;

    .popover__body {
        padding: 16px;

        .popover__title {
            display: block;
            margin: 0 0 12px;
            font-family: $font-family;
            font-weight: 400;
            font-size: 16px;
            color: #000;
            line-height: (14px * 1.0 * 1.0);
        }

        .popover__description {
            display: block;
            margin: 0 0 16px;
            font-family: $font-family;
            font-weight: 400;
            font-size: 12px;
            color: #333;
            line-height: (12px * 1.0 * 1.2);
        }

        .popover__no-description {
            display: block;
            margin: 0 0 16px;
            font-family: $font-family;
            font-weight: 400;
            font-style: italic;
            font-size: 12px;
            color: #999;
            line-height: (12px * 1.0 * 1.2);
        }

        .popover__status {
            .popover__label {
                display: block;
                margin: 0 0 4px;
                font-family: $font-family;
                font-weight: 600;
                font-size: 10px;
                color: #ff4c43;
                letter-spacing: .15px;
                text-transform: uppercase;
                line-height: (10px * 1.0 * 1.0);
            }

            .popover__value {
                display: block;
                margin: 0;
                font-family: $font-family;
                font-weight: 400;
                font-size: 12px;
                color: #666;
                line-height: (12px * 1.0 * 1.0);
            }
        }
    }
}
</style>
