<template>
    <Popover :settings="popover" @close="$emit('cancel')">
        <template slot="heading">
            <h1 class="bt-popover-title">Fout rapporteren</h1>
            <p class="bt-popover-intro">Vul hieronder een korte omschrijving, en eventueel een uitgebreidere beschrijving, van de fout in om deze te rapporteren aan The Cre8ion.Lab.</p>
        </template>

        <div class="bt-popover-form" v-if="!flags.isSuccessful">
            <div class="bt-popover-field">
                <label class="bt-field-label bt-is-required" for="title" :class="{ 'bt-is-disabled': flags.isLoading }">Korte omschrijving</label>
                <input class="bt-field-control" type="text" id="title" v-model.trim="fields.title" placeholder="Vul hier je korte omschrijving in…" :disabled="flags.isLoading">
            </div>

            <div class="bt-popover-field">
                <label class="bt-field-label" for="description" :class="{ 'bt-is-disabled': flags.isLoading }">Beschrijving</label>
                <textarea class="bt-field-control" id="description" v-model.trim="fields.description" placeholder="Vul hier je (eventuele) beschrijving in…" :disabled="flags.isLoading"></textarea>
            </div>
        </div>

        <div class="bt-popover-success" v-else>
            <i class="bt-popover-tick"></i>
            <p class="bt-popover-message">De fout is succesvol gerapporteerd en zal zo snel mogelijk in behandeling worden genomen.</p>
        </div>

        <template slot="actions">
            <button class="bt-popover-button-secondary" :disabled="flags.isLoading" @click="$emit('cancel')" v-if="!flags.isSuccessful">Annuleren</button>
            <button class="bt-popover-button-primary" :disabled="flags.isLoading" @click="onSubmit" v-if="!flags.isSuccessful">Rapporteren</button>

            <button class="bt-popover-button-secondary" @click="$emit('cancel')" v-if="flags.isSuccessful">Sluiten</button>
        </template>
    </Popover>
</template>

<script>
import Popover from './Popover'

import bowser from 'bowser'
import axios from 'axios'
import qs from 'qs'

export default {
    components: { Popover },
    computed: {
        popover: function () {
            const selection = this.settings.selection

            return {
                isLoading: this.flags.isLoading,
                position: {
                    top: selection.top + selection.height + 7,
                    left: selection.left + ((selection.width - 408) / 2),
                },
            }
        },
    },
    data: function () {
        return {
            fields: {
                description: '',
                title: '',
            },
            flags: {
                isSuccessful: false,
                isLoading: false,
            },
        }
    },
    props: {
        settings: Object,
    },
    methods: {
        onSubmit: function () {
            this.flags.isLoading = true

            const userAgent = bowser.getParser(window.navigator.userAgent).parsedResult
            const extra = []

            const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

            let description = this.fields.description

            if (userAgent.browser.name) {
                let browser = `**Browser:** ${userAgent.browser.name}`

                if (userAgent.browser.version) {
                    browser += ` ${userAgent.browser.version}`
                }

                if (userAgent.engine.name) {
                    browser += ` (using ${userAgent.engine.name}`

                    if (userAgent.engine.version) {
                        browser += ` ${userAgent.engine.version}`
                    }

                    browser += ')'
                }

                extra.push(browser)
            }

            if (userAgent.engine.name && !userAgent.browser.name) {
                let renderingEngine = `**Rendering Engine:** ${userAgent.engine.name}`

                if (userAgent.engine.version) {
                    renderingEngine += ` ${userAgent.engine.version}`
                }

                extra.push(renderingEngine)
            }

            if (userAgent.os.name) {
                let operatingSystem = `**Operating System:** ${userAgent.os.name}`

                if (userAgent.os.version) {
                    operatingSystem += ` ${userAgent.os.version}`
                }

                extra.push(operatingSystem)
            }

            const url = new URL(window.location.href)

            extra.push(`**Browser size:** ${width}x${height}px`)
            extra.push(`**Page:** ${url.pathname}`)

            if (description.length > 0 && extra.length > 0) {
                description += '\n\n'
            }

            const data = {
                description: description + extra.join('\n'),
                screenshot: this.settings.screenshot.replace(/^data:image\/png;base64,/, ''),
                title: this.fields.title,
                path: url.pathname,

                project_id: this.settings.project,

                selection_width: this.settings.selection.width,
                selection_height: this.settings.selection.height,
                page_width: width,
                page_height: height,
                dot_x: this.settings.selection.left - (30 / 2),
                dot_y: this.settings.selection.top - (30 / 2),
            }

            axios.post('bugs', qs.stringify(data))
                .then((response) => {
                    this.flags.isSuccessful = true

                    this.$emit('submit', {
                        title: this.fields.title,
                        description: this.fields.description,
                        selection_width: this.settings.selection.width,
                        selection_height: this.settings.selection.height,
                        page_width: width,
                        page_height: height,
                        id: response.data.id,
                        dot_x: data.dot_x,
                        dot_y: data.dot_y,
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
                .then(() => {
                    this.flags.isLoading = false
                })
        },
    },
}
</script>

<style lang="sass" scoped>
$font-family: "Roboto", sans-serif;

* {
    box-sizing: border-box;
}

.bt-popover {
    .bt-popover-form {
        padding: 16px;

        .bt-popover-field {
            .bt-field-label {
                display: block;
                margin: 0 0 4px;
                padding: 0;
                font-family: $font-family;
                font-weight: 500;
                font-size: 10px;
                color: #333;
                text-transform: uppercase;
                letter-spacing: .5px;
                line-height: (10px * 1.0 * 1.2);
                transition: opacity ease-in-out .1s;

                &.bt-is-required {
                    &::after {
                        margin-left: 4px;
                        font-family: $font-family;
                        font-weight: 600;
                        font-size: 10px;
                        color: #ff4c43;
                        text-transform: uppercase;
                        letter-spacing: .5px;
                        line-height: (10px * 1.0 * 1.2);
                        content: "*";
                    }
                }

                &.bt-is-disabled {
                    opacity: .5;
                }
            }

            .bt-field-control {
                display: block;
                width: 100%;
                margin: 0;
                padding: 8px;
                font-family: $font-family;
                font-weight: 400;
                font-size: 12px;
                color: #333;
                line-height: (12px * 1.0 * 1.2);
                background-color: #fff;
                border-radius: 3px;
                border: 1px solid #ddd;
                -webkit-appearance: none;
                transition: background-color ease-in-out .1s, border-color ease-in-out .1s, box-shadow ease-in-out .2s, opacity ease-in-out .1s;

                &::placeholder {
                    font-family: $font-family;
                    font-weight: 400;
                    font-style: italic;
                    font-size: 12px;
                    color: rgba(#333, .5);
                    line-height: (12px * 1.0 * 1.2);
                    opacity: 1;
                    transition: opacity ease-in-out .2s;
                }

                &:hover {
                    border-color: #bababa;
                }

                &:active,
                &:focus {
                    border-color: #ff4c43;
                    box-shadow: 0 0 0 2px rgba(#ff4c43, .15);
                    outline: none;

                    &::placeholder {
                        opacity: 0;
                    }
                }

                &[disabled] {
                    background-color: rgba(#000, .05);
                    opacity: .5;

                    &:hover {
                        border-color: #ddd;
                    }
                }

                .bt-has-error & {
                    border-color: #ff4c43;

                    &:hover {
                        border-color: #e5443c;
                    }
                }
            }

            textarea.bt-field-control {
                height: 60px;
                resize: none;
            }

            .bt-field-message {
                display: block;
                font-family: $font-family;
                font-weight: 400;
                font-size: 10px;
                color: #333;
                line-height: (10px * 1.0 * 1.2);
                transition: color ease-in-out .1s;

                .field__control + & {
                    margin-top: 4px;
                }

                .has-error & {
                    color: #ff4c43;
                }
            }

            & + .bt-popover-field {
                margin-top: 16px;
            }
        }
    }

    .bt-popover-success {
        display: flex;
        height: 109px + 32px * 2;
        padding: 32px 16px;
        flex-direction: column;
        align-items: center;

        .bt-popover-tick {
            display: block;
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
            background-position: center center;
            background-repeat: no-repeat;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAzMiAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMC4xMjUgMC42NjY2MjZMMTAuNzUgMjAuMjVMMS44NzUgMTEuNDE2NkwwIDEzLjMzMzNMMTAuNzUgMjRMMzIgMi41ODMyOUwzMC4xMjUgMC42NjY2MjZaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjc1Ii8+Cjwvc3ZnPgo=");
            background-color: #6bcb3e;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .bt-popover-message {
            display: block;
            margin: 0;
            font-family: $font-family;
            font-weight: 400;
            font-size: 12px;
            color: #333;
            text-align: center;
            line-height: (12px * 1.0 * 1.25);
        }
    }
}
</style>
