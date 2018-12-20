<template>
    <Popover :x="settings.left" :y="settings.top" :loading="isLoading">
        <template slot="heading">
            <h1 class="popover__title">Fout rapporteren</h1>
            <p class="popover__intro">Vul hieronder een korte omschrijving, en eventueel een uitgebreidere beschrijving, van de fout in om deze te rapporteren aan The Cre8ion.Lab.</p>
        </template>

        <div class="popover__form" v-if="!isSuccessful">
            <div class="popover__field">
                <label class="field__label is-required" for="title" :class="{ 'is-disabled': isLoading }">Korte omschrijving</label>
                <input class="field__control" type="text" id="title" v-model.trim="fields.title" placeholder="Vul hier je korte omschrijving in…" :disabled="isLoading">
            </div>

            <div class="popover__field">
                <label class="field__label" for="description" :class="{ 'is-disabled': isLoading }">Beschrijving</label>
                <textarea class="field__control" id="description" v-model.trim="fields.description" placeholder="Vul hier je (eventuele) beschrijving in…" :disabled="isLoading"></textarea>
            </div>
        </div>

        <div class="popover__success" v-if="isSuccessful">
            <i class="popover__tick"></i>
            <p class="popover__message">De fout is succesvol gerapporteerd en zal zo snel mogelijk in behandeling worden genomen.</p>
        </div>

        <template slot="actions">
            <div v-if="!isSuccessful">
                <button class="popover__button-secondary" :disabled="isLoading" @click="$emit('cancel')">Annuleren</button>
                <button class="popover__button-primary" :disabled="isLoading" @click="onSubmit">Rapporteren</button>
            </div>

            <div v-if="isSuccessful">
                <button class="popover__button-secondary" @click="$emit('cancel')">Sluiten</button>
            </div>
        </template>
    </Popover>
</template>

<script>
import Popover from './Popover.vue'

import bowser from 'bowser'
import axios from 'axios'
import qs from 'qs'

export default {
    components: { Popover },
    props: {
        settings: Object,
    },
    data: () => {
        return {
            isSuccessful: false,
            isLoading: false,
            fields: {
                description: '',
                title: '',
            },
        }
    },
    methods: {
        onSubmit: function () {
            this.$emit('submit')
            this.isLoading = true

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

            extra.push(`**Browser size:** ${width}x${height}px`)

            if (description.length > 0 && extra.length > 0) {
                description += '\n\n'
            }

            const data = {
                description: description + extra.join('\n'),
                screenshot: this.settings.screenshot.replace(/^data:image\/png;base64,/, ''),
                title: this.fields.title,
                list: this.settings.unresolved,

                height: height,
                width: width,
                x: this.settings.metadata.x,
                y: this.settings.metadata.y,
            }

            // TODO: Extract this URL to another place.
            axios.post('http://188.166.121.197:4321/bugs', qs.stringify(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then((response) => {
                    this.isSuccessful = true

                    const existingBugs = JSON.parse(window.localStorage.getItem('bugs') || '[]')

                    existingBugs.push({
                        title: this.fields.title,
                        description: this.fields.description,
                        height: height,
                        width: width,
                        id: response.data.id,
                        x: this.settings.metadata.x,
                        y: this.settings.metadata.y,
                    })

                    window.localStorage.setItem('bugs', JSON.stringify(existingBugs))
                })
                .catch((error) => {
                    console.log(error)
                })
                .then(() => {
                    this.isLoading = false
                })
        },
    },
}
</script>

<style lang="sass" scoped>
$font-family: "Roboto", sans-serif;

.popover {
    .popover__form {
        padding: 16px;

        .popover__field {
            .field__label {
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

                &.is-required {
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

                &.is-disabled {
                    opacity: .5;
                }
            }

            .field__control {
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

                .has-error & {
                    border-color: #ff4c43;

                    &:hover {
                        border-color: #e5443c;
                    }
                }
            }

            textarea.field__control {
                height: 60px;
                resize: none;
            }

            .field__message {
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

            & + .popover__field {
                margin-top: 16px;
            }
        }
    }

    .popover__success {
        display: flex;
        height: 109px + 32px * 2;
        padding: 32px 16px;
        flex-direction: column;
        align-items: center;

        .popover__tick {
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

        .popover__message {
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
