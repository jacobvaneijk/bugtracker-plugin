<template>
    <div v-if="flags.isOpened">
        <Selection
            @selection="onSelection"
        />

        <ReportBug
            :settings="reportBug"

            @cancel="onReportBugCancel"

            v-if="flags.hasSelection"
        />
    </div>

    <div v-else>
        <div v-for="bug in bugs">
            <Bug
                :settings="bug"
                :key="bug.title"

                @view="onBugView"
                @return="onBugReturn"

                v-if="bug.shown"
            />
        </div>

        <EntryPoint
            @click="onEntryPointClick"
        />
    </div>
</template>

<script>
import html2canvas from 'html2canvas'

import EntryPoint from './EntryPoint'
import ReportBug from './ReportBug'
import Selection from './Selection'
import Bug from './Bug'

export default {
    components: { EntryPoint, ReportBug, Selection, Bug },
    created: function () {
        this.bugs = JSON.parse(window.localStorage.getItem('bugs') || '[]')

        this.bugs.forEach((bug) => {
            bug.shown = true
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
        onEntryPointClick: function () {
            this.flags.hasSelection = false
            this.flags.isOpened = !this.flags.isOpened
        },
        onBugReturn: function () {
            this.bugs.forEach((bug) => {
                bug.shown = true
            })

            this.$forceUpdate()
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
    },
}
</script>

<style lang="sass" scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,600');

* {
    box-sizing: border-box;
}
</style>
