import VueCustomElement from 'vue-custom-element'
import BugTracker from './components/BugTracker'
import Vue from 'vue'

Vue.use(VueCustomElement)

Vue.customElement('bug-tracker', BugTracker)
