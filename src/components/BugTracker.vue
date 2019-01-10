<template>
    <div v-if="flags.isOpened">
        <Selection
            @selection="onSelection"
        />

        <ReportBug
            :settings="reportBug"

            @cancel="onReportBugCancel"
            @submit="onBugReported"

            v-if="flags.hasSelection"
        />
    </div>

    <div v-else>
        <div v-for="bug in bugs">
            <Bug
                :settings="bug"
                :key="bug.title"

                @view="onBugView"
                @return="onResize"

                v-if="bug.shown"
            />
        </div>

        <EntryPoint
            @click="onEntryPointClick"
        />
    </div>
</template>

<script>
import EntryPoint from './EntryPoint'
import ReportBug from './ReportBug'
import Selection from './Selection'
import Bug from './Bug'

import html2canvas from 'html2canvas'
import axios from 'axios'

const MOBILE_WIDTH = 768

export default {
    components: { EntryPoint, ReportBug, Selection, Bug },
    created: function () {
        window.addEventListener('resize', this.onResize)

        const pageWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        const url = new URL(window.location.href)

        axios.get(`/bugs?project=${this.project}&path=${url.pathname}`)
            .then((response) => {
                response.data.forEach((bug) => {
                    bug.shown = !((bug.page_width > MOBILE_WIDTH && pageWidth < MOBILE_WIDTH) || (bug.page_width < MOBILE_WIDTH && pageWidth > MOBILE_WIDTH))
                })

                this.bugs = response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
    data: function () {
        return {
            flags: {
                hasSelection: false,
                isOpened: false,
            },
            reportBug: {},
            bugs: [],
        }
    },
    props: {
        project: {
            required: true,
            type: Number,
        },
    },
    methods: {
        onReportBugCancel: function () {
            this.flags.hasSelection = false
            this.flags.isOpened = false
        },
        onBugReported: function (bug) {
            bug.shown = true

            this.bugs.push(bug)
        },
        onEntryPointClick: function () {
            this.flags.hasSelection = false
            this.flags.isOpened = !this.flags.isOpened
        },
        onBugView: function (settings) {
            this.bugs.forEach((bug) => {
                if (bug.id !== settings.id) {
                    bug.shown = false
                }
            })

            this.$forceUpdate()
        },
        onSelection: function (event) {
            // Configure the report bug popover.
            this.reportBug = {
                selection: event,
                project: this.project,
            }

            // Generate the screenshot of the selected area.
            html2canvas(
                document.body,
                {
                    imageTimeout: 0,
                    logging: false,
                    width: event.width,
                    height: event.height,
                    x: event.left,
                    y: event.top,
                }
            ).then((canvas) => {
                this.reportBug.screenshot = canvas.toDataURL()
            })

            this.flags.hasSelection = true
        },
        onResize: function () {
            const pageWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

            this.bugs.forEach((bug) => {
                bug.shown = !((bug.page_width > MOBILE_WIDTH && pageWidth < MOBILE_WIDTH) || (bug.page_width < MOBILE_WIDTH && pageWidth > MOBILE_WIDTH))
            })

            this.$forceUpdate()
        },
    },
}
</script>

<style lang="sass" scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,600');

* {
    box-sizing: border-box;
}
</style>
