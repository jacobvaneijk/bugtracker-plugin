<template>
    <div>
        <template v-if="opened" v-for="mask in masks">
            <div class="mask" :style="{ width: mask.width + 'px', height: mask.height + 'px', top: mask.y + 'px', left: mask.x + 'px' }"></div>
        </template>

        <div class="selection-container" v-if="opened" @mousedown="selectStart" @mousemove="selectMove" @mouseup="selectEnd"></div>
        <div class="selection" v-if="opened && selection.width > 0 && selection.height > 0" :style="{ width: selection.width + 'px', height: selection.height + 'px', top: selection.y + 'px', left: selection.x + 'px' }"></div>

        <EntryPoint @click="entryPointPressed" />
        <ReportBug v-if="selected" :top="popover.top" :left="popover.left" :unresolved="unresolved" :screenshot="popover.screenshot" @cancel="selected = false" />
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import EntryPoint from './EntryPoint.vue'
import ReportBug from './ReportBug.vue'

export default {
    components: { EntryPoint, ReportBug },
    created: function () {
        for (let i = 0; i < 4; ++i) {
            this.masks.push({
                width: 0,
                height: 0,
                x: 0,
                y: 0,
            });
        }
    },
    data: () => {
        return {
            selecting: false,
            selection: {
                initialX: 0,
                initialY: 0,
                width: 0,
                height: 0,
                x: 0,
                y: 0,
            },
            selected: false,
            popover: {
                screenshot: '',
                top: 0,
                left: 0,
            },
            opened: false,
            masks: [],
        }
    },
    props: {
        unresolved: {
            required: true,
            type: String,
        },
    },
    methods: {
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

            const height = window.innerHeight / 2
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
                height: this.selection.height - 2,
                x: this.selection.x + this.selection.width,
                y: this.selection.y,
            };

            // Bottom Mask
            this.masks[2] = {
                width: parseInt(window.innerWidth),
                height: parseInt(window.innerHeight) - (this.selection.y + this.selection.height) + 2,
                x: 0,
                y: this.selection.y + this.selection.height - 2,
            };

            // Left Mask
            this.masks[3] = {
                width: this.selection.x + 2,
                height: this.selection.height,
                x: 0,
                y: this.selection.y + 2,
            };
        },
        selectEnd: function (event) {
            if (!this.opened || !this.selecting) {
                return
            }

            this.selecting = false
            this.selected = true

            this.popover.top = this.selection.y + this.selection.height + 7
            this.popover.left = (this.selection.x + (this.selection.width - 408) / 2)

            html2canvas(document.body, { logging: false, width: this.selection.width, height: this.selection.height, x: this.selection.x, y: this.selection.y, }).then((canvas) => {
                this.popover.screenshot = canvas.toDataURL()
            })
        },
    },
}
</script>

<style scoped>
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
    border: 2px solid #0c9ad7;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .5);
}
</style>
