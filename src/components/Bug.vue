<template>
    <div>
        <div class="bt-bug-wrapper" :style="style.wrapper">
            <Selection :settings="selection" v-if="flags.isOpened" />

            <div
                class="bt-bug"

                :style="style.bug"

                @click="onBugClick"

                v-if="!flags.isOpened"
            />
        </div>

        <Popover :settings="popover" @close="onPopoverClose" v-if="flags.isOpened">
            <div class="bt-popover-body">
                <h2 class="bt-popover-title">{{ settings.title }}</h2>

                <p class="bt-popover-description" v-if="description">{{ description }}</p>
                <p class="bt-popover-description bt-empty" v-else>Geen beschrijving</p>

                <div class="bt-popover-status">
                    <span class="bt-popover-label">Status</span>
                    <span class="bt-popover-value">In behandeling</span>
                </div>
            </div>

            <template slot="actions">
                <button class="bt-popover-button-secondary" @click="onPopoverClose">Sluiten</button>
                <a class="bt-popover-button-secondary" :href="trelloUrl" target="_blank">Bekijk voortgang</a>
            </template>
        </Popover>
    </div>
</template>

<script>
import Selection from './Selection'
import Popover from './Popover'

export default {
    components: { Selection, Popover },
    computed: {
        trelloUrl: function () {
            return `https://trello.com/c/${this.settings.id}`
        },
        popover: function () {
            const selection = this.selection

            return {
                position: {
                    top: selection.top + selection.height + 7,
                    left: selection.left + ((selection.width - 408) / 2) + ((this.pageWidth - this.settings.page_width) / 2),
                },
            }
        },
        selection: function () {
            const settings = this.settings

            return {
                maySelect: false,
                offset: (this.pageWidth - this.settings.page_width) / 2,
                width: settings.selection_width,
                height: settings.selection_height,
                top: settings.dot_y + (30 / 2),
                left: settings.dot_x + (30 / 2),
            }
        },
        style: function () {
            return {
                wrapper: {
                    width: `${this.settings.page_width}px`,
                    height: `${this.settings.page_height}px`,
                },
                bug: {
                    top: `${this.settings.dot_y}px`,
                    left: `${this.settings.dot_x}px`,
                },
            }
        },
        description: function () {
            return this.settings.description.substring(0, this.settings.description.indexOf('**Browser:**'))
        },
    },
    props: {
        settings: Object,
    },
    data: function () {
        return {
            flags: {
                isOpened: false,
            },
            pageWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        }
    },
    created: function () {
        window.addEventListener('resize', this.onResize)
    },
    methods: {
        onPopoverClose: function () {
            this.flags.isOpened = false

            this.$emit('return')
        },
        onBugClick: function () {
            this.flags.isOpened = true

            this.$emit('view', this.settings);
        },
        onResize: function () {
            this.pageWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        },
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
