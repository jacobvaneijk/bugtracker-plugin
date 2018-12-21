<template>
    <div :style="style.wrapper">
        <div
            class="bt-mask"

            :style="mask"

            v-for="mask in style.masks"
        />

        <div
            class="bt-selection-target"

            @mousedown="onSelectionStart"
            @mousemove="onSelectionMove"
            @mouseup="onSelectionEnd"
        />

        <div
            class="bt-selection"

            :style="style.selection"

            v-if="showSelection"
        />
    </div>
</template>

<script>
export default {
    computed: {
        showSelection: function () {
            return this.selection.width > 0 && this.selection.height > 0
        },
        masks: function () {
            const masks = []

            if (this.selection.width > 0 && this.selection.height > 0) {
                const left = (this.settings && this.settings.offset) ? this.selection.left + this.settings.offset : this.selection.left

                // Calculate the 'top' mask.
                masks.push({
                    width: this.pageWidth,
                    height: this.selection.top + 2,
                    left: 0,
                    top: 0,
                })

                // Calculate the 'bottom' mask.
                masks.push({
                    width: this.pageWidth,
                    height: this.pageHeight - (this.selection.top + this.selection.height + 2),
                    left: 0,
                    top: this.selection.top + this.selection.height - 2,
                })

                // Calculate the 'left' mask.
                masks.push({
                    width: left + 2,
                    height: this.selection.height - 4,
                    top: this.selection.top + 2,
                    left: 0,
                })

                // Calculate the 'right' mask.
                masks.push({
                    width: this.pageWidth - (left + this.selection.width),
                    height: this.selection.height - 4,
                    top: this.selection.top + 2,
                    left: left + this.selection.width,
                })
            } else {
                // Arrange the masks so that the entire page is covered.
                const height = this.pageHeight / 2
                const width = this.pageWidth / 2

                for (let i = 0; i < 4; ++i) {
                    masks.push({
                        width: width,
                        height: height,
                        top: 0,
                        left: 0,
                    })
                }

                masks[2].top = masks[3].top = height
                masks[1].left = masks[3].left = width
            }

            return masks
        },
        style: function () {
            const masks = []
            let wrapper = {}

            for (let i = 0; i < this.masks.length; ++i) {
                masks.push({
                    width: `${this.masks[i].width}px`,
                    height: `${this.masks[i].height}px`,
                    top: `${this.masks[i].top}px`,
                    left: `${this.masks[i].left}px`,
                })
            }

            // Determine if an offset to the entire selection should be applied.
            // This will make the selection (more) responsive.
            if (this.settings && this.settings.offset) {
                wrapper = {
                    position: 'absolute',
                    top: 0,
                    left: `${(this.settings.offset || 0) * -1}px`,
                }
            }

            return {
                wrapper: wrapper,
                selection: {
                    width: `${this.selection.width}px`,
                    height: `${this.selection.height}px`,
                    top: `${this.selection.top}px`,
                    left: `${this.selection.left + ((this.settings && this.settings.offset) || 0)}px`,
                },
                masks: masks,
            }
        },
    },
    props: {
        settings: Object,
    },
    data: function () {
        return {
            flags: {
                isSelecting: false,
            },
            selection: {
                startX: 0,
                startY: 0,
                width: (this.settings && this.settings.width) || 0,
                height: (this.settings && this.settings.height) || 0,
                left: ((this.settings && this.settings.left) || 0),
                top: (this.settings && this.settings.top) || 0
            },
            pageWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            pageHeight: Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
        }
    },
    created: function () {
        window.addEventListener('resize', this.onResize)
    },
    methods: {
        onResize: function () {
            this.pageWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
            this.pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
        },
        getScreenCoordinates: function (event) {
            const eventDocument = (event.target && event.target.ownerDocument) || document
            const body = eventDocument.body
            const doc = eventDocument.documentElement

            // Calculate the actual position of the mouse cursor on the page.
            return {
                left: event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0),
                top: event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0),
            }
        },
        onSelectionStart: function (event) {
            // Determine if the selection is allowed.
            if (
                this.flags.isSelecting
                || !(typeof (this.settings && this.settings.maySelect) === 'undefined' ? true : this.settings.maySelect)
            ) {
                return
            }

            const coordinates = this.getScreenCoordinates(event)

            // Save the starting position of the selection.
            this.selection.startLeft = this.selection.left = coordinates.left
            this.selection.startTop = this.selection.top = coordinates.top

            // Reset the selection.
            this.selection.width = this.selection.height = 0

            // Enable the 'selecting' flag.
            this.flags.isSelecting = true
        },
        onSelectionMove: function (event) {
            if (!this.flags.isSelecting) {
                return
            }

            const coordinates = this.getScreenCoordinates(event)

            // Test to see if the cursor is going to the left of the starting
            // point.
            if (coordinates.left < this.selection.startLeft) {
                this.selection.left = coordinates.left
            }

            // Test to see if the cursor is going above the starting point.
            if (coordinates.top < this.selection.startTop) {
                this.selection.top = coordinates.top
            }

            // Calculate the difference between the current mouse position and
            // the starting point. We take the absolute value of this calculation
            // which makes the selection possible to go in every direction.
            this.selection.width = Math.abs(coordinates.left - this.selection.startLeft)
            this.selection.height = Math.abs(coordinates.top - this.selection.startTop)
        },
        onSelectionEnd: function () {
            if (!this.flags.isSelecting) {
                return
            }

            // Disable the 'selecting' flag.
            this.flags.isSelecting = false

            // Emit an event to indicate that the selection is complete.
            this.$emit('selection', {
                width: this.selection.width,
                height: this.selection.height,
                left: this.selection.left,
                top: this.selection.top,
            })
        },
    },
}
</script>

<style lang="sass" scoped>
* {
    box-sizing: border-box;
}

.bt-mask {
    position: absolute;
    z-index: 1000;
    background-color: rgba(#000, .5);
}

.bt-selection-target {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1200;
    width: 100%;
    height: 100%;
}

.bt-selection {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1100;
    border-radius: 3px;
    border: 2px solid #ff6961;
    box-shadow: 0 0 5px rgba(#000, .5);
}
</style>
