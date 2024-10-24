import TemplateSFC from './TemplateComponent.vue'
import Uploader from './Uploader'
import './style.css'
const TemplateComponent = {
  install(app: any, options: any) {
    app.component('TemplateComponent', TemplateSFC)
  },
}
export default TemplateComponent
