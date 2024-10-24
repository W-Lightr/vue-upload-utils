import TemplateSFC from './TemplateComponent.vue'
import './style.css'
const TemplateComponent = {
  install(app: any, options: any) {
    app.component('TemplateComponent', TemplateSFC)
  },
}

export default TemplateComponent
