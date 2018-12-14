import VueCustomElement from 'vue-custom-element'
import BugTracker from './components/BugTracker.vue'
import Vue from 'vue'

// Inject the plugin.
var $bugtracker = document.createElement('bug-tracker')
$bugtracker.setAttribute('unresolved', '5bf52bcc81455a2f35ba8e11')

document.body.appendChild($bugtracker)

Vue.use(VueCustomElement)
Vue.customElement('bug-tracker', BugTracker)
