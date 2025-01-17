import Vue, { version } from 'vue'
import TemplateComponent from '../src/index'
import App from './App.vue'
import '../src/style.css'


console.warn('Vue version: ', version)
Vue.config.productionTip = false
Vue.use(TemplateComponent)

new Vue({ render: h => h(App) }).$mount('#app')
