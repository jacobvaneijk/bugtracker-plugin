import VueCustomElement from 'vue-custom-element'
import axios from 'axios'
import Vue from 'vue'

import BugTracker from './components/BugTracker'

axios.defaults.baseURL = 'http://188.166.121.197:4321/'

Vue.config.productionTip = false

Vue.use(VueCustomElement)
Vue.customElement('bug-tracker', BugTracker)
