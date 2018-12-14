<template>
    <div>
        <template v-if="opened" v-for="mask in masks">
            <div class="mask" :style="{ width: mask.width + 'px', height: mask.height + 'px', top: mask.y + 'px', left: mask.x + 'px' }"></div>
        </template>

        <template v-for="bug in bugs" v-if="!opened">
            <transition name="fade">
                <Bug :settings="bug" />
            </transition>
        </template>

        <div class="selection-container" v-if="opened" @mousedown="selectStart" @mousemove="selectMove" @mouseup="selectEnd" @click="cancelReport"></div>
        <div class="selection" v-if="opened && selection.width > 0 && selection.height > 0" :style="{ width: selection.width + 'px', height: selection.height + 'px', top: selection.y + 'px', left: selection.x + 'px' }" @click="cancelReport"></div>

        <transition name="fade">
            <EntryPoint @click="entryPointPressed" v-if="!opened" />
        </transition>

        <ReportBug v-if="selected" :settings="reportBug" @cancel="cancelReport" />
    </div>
</template>

<script>
import html2canvas from 'html2canvas'

import EntryPoint from './EntryPoint.vue'
import ReportBug from './ReportBug.vue'
import Bug from './Bug.vue'

export default {
    components: { EntryPoint, ReportBug, Bug },
    created: function () {
        for (let i = 0; i < 4; ++i) {
            this.masks.push({
                width: 0,
                height: 0,
                x: 0,
                y: 0,
            });
        }

        this.bugs = JSON.parse(window.localStorage.getItem('bugs') || '[]')
    },
    data: () => {
        return {
            isReporting: false,
            selecting: false,
            selection: {
                initialX: 0,
                initialY: 0,
                width: 0,
                height: 0,
                x: 0,
                y: 0,
            },
            reportBug: {},
            selected: false,
            opened: false,
            masks: [],
            bugs: [],
        }
    },
    props: {
        unresolved: {
            required: true,
            type: String,
        },
    },
    methods: {
        cancelReport: function () {
            if (this.isReporting) {
                this.isReporting = false
                this.selecting = false
                this.selected = false
                this.opened = false
            }
        },
        getScreenCoordinates: function (event) {
            const eventDocument = (event.target && event.target.ownerDocument) || document
            const body = eventDocument.body
            const doc = eventDocument.documentElement

            return {
                x: event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0),
                y: event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0),
            }
        },
        entryPointPressed: function () {
            this.selected = false
            this.opened = !this.opened

            this.selection = {
                initialX: 0,
                initialY: 0,
                width: 0,
                height: 0,
                x: 0,
                y: 0,
            }

            this.masks = []

            for (let i = 0; i < 4; ++i) {
                this.masks.push({
                    width: 0,
                    height: 0,
                    x: 0,
                    y: 0,
                });
            }

            const html = document.documentElement
            const body = document.body

            const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

            const height = documentHeight / 2
            const width = window.innerWidth / 2

            for (let i = 0; i < this.masks.length; ++i) {
                this.masks[i].height = height
                this.masks[i].width = width
            }

            this.masks[1].x = this.masks[3].x = width
            this.masks[2].y = this.masks[3].y = height
        },
        selectStart: function (event) {
            if (!this.opened) {
                return
            }

            this.selecting = true
            this.selected = false
            this.opened = true

            const coordinates = this.getScreenCoordinates(event)

            this.selection.initialX = this.selection.x = coordinates.x
            this.selection.initialY = this.selection.y = coordinates.y
            this.selection.width = this.selection.height = 0
        },
        selectMove: function (event) {
            if (!this.opened || !this.selecting) {
                return
            }

            const coordinates = this.getScreenCoordinates(event)

            if (coordinates.x < this.selection.initialX) {
                this.selection.x = coordinates.x
            }

            if (coordinates.y < this.selection.initialY) {
                this.selection.y = coordinates.y
            }

            this.selection.width = Math.abs(coordinates.x - this.selection.initialX)
            this.selection.height = Math.abs(coordinates.y - this.selection.initialY)

            const html = document.documentElement
            const body = document.body

            const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

            // Top Mask
            this.masks[0] = {
                width: parseInt(window.innerWidth),
                height: this.selection.y + 2,
                x: 0,
                y: 0,
            };

            // Right Mask
            this.masks[1] = {
                width: parseInt(window.innerWidth) - (this.selection.x + this.selection.width),
                height: this.selection.height - 4,
                x: this.selection.x + this.selection.width,
                y: this.selection.y + 2,
            };

            // Bottom Mask
            this.masks[2] = {
                width: parseInt(window.innerWidth),
                height: parseInt(documentHeight) - (this.selection.y + this.selection.height) + 2,
                x: 0,
                y: this.selection.y + this.selection.height - 2,
            };

            // Left Mask
            this.masks[3] = {
                width: this.selection.x + 2,
                height: this.selection.height - 4,
                x: 0,
                y: this.selection.y + 2,
            };
        },
        selectEnd: function (event) {
            if (!this.opened || !this.selecting || this.isReporting) {
                return
            }

            // Make sure that the click event occurs before isReporting is set
            // to true, otherwise the report popover immediately disappears.
            window.setTimeout(() => { this.isReporting = true }, 500)

            this.selecting = false
            this.selected = true

            this.reportBug = {
                unresolved: this.unresolved,
                metadata: {
                    x: this.selection.x - 15,
                    y: this.selection.y - 15,
                },
                left: this.selection.x + (this.selection.width - 408) / 2,
                top: this.selection.y + this.selection.height + 7,
            }

            html2canvas(document.body, { logging: false, width: this.selection.width, height: this.selection.height, x: this.selection.x, y: this.selection.y, }).then((canvas) => {
                this.reportBug.screenshot = canvas.toDataURL()
            })
        },
    },
}
</script>

<style lang="sass" scoped>
* {
    box-sizing: border-box;
}

.mask {
    position: absolute;
    z-index: 1000;
    background-color: rgba(0, 0, 0, .5);
}

.selection-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1200;
    width: 100%;
    height: 100%;
}

.selection {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1100;
    border: 2px solid #ff6961;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(#000, .5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-leave-to,
.fade-enter {
  opacity: 0;
}
</style>
