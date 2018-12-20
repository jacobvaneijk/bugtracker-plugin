<template>
    <div>
        <div class="bt-bug-wrapper" :style="style.wrapper">
            <div
                class="bt-bug"

                :class="{ 'is-active': isOpened }"
                :style="style.bug"

                @click="isOpened = !isOpened"
            />
        </div>

        <Popover :settings="popover" @close="isOpened = false" v-if="isOpened">
            <div class="bt-popover-body">
                <h2 class="bt-popover-title">{{ settings.title }}</h2>

                <p class="bt-popover-description" v-if="settings.description">{{ settings.description }}</p>
                <p class="bt-popover-description bt-empty" v-else>Geen beschrijving</p>

                <div class="bt-popover-status">
                    <span class="bt-popover-label">Status</span>
                    <span class="bt-popover-value">In behandeling</span>
                </div>
            </div>

            <template slot="actions">
                <a class="bt-popover-button-secondary" :href="trelloUrl" target="_blank">Bekijk voortgang</a>
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
                position: {
                    top: this.settings.top + 30 + 7,
                    left: this.settings.left + ((30 - 408) / 2),
                },
            }
        },
        style: function () {
            return {
                wrapper: {
                    width: `${this.settings.width}px`,
                    height: `${this.settings.height}px`,
                },
                bug: {
                    top: `${this.settings.top}px`,
                    left: `${this.settings.left}px`,
                },
            }
        },
    },
    props: {
        settings: Object,
    },
    data: function () {
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

.bt-popover {
    .bt-popover-body {
        padding: 16px;

        .bt-popover-title {
            display: block;
            margin: 0 0 12px;
            font-family: $font-family;
            font-weight: 400;
            font-size: 16px;
            color: #000;
            line-height: (14px * 1.0 * 1.0);
        }

        .bt-popover-description {
            display: block;
            margin: 0 0 16px;
            font-family: $font-family;
            font-weight: 400;
            font-size: 12px;
            color: #333;
            line-height: (12px * 1.0 * 1.2);

            &.bt-empty {
                font-style: italic;
                color: #999;
            }
        }

        .bt-popover-status {
            .bt-popover-label {
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

            .bt-popover-value {
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
