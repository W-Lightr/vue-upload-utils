import TemplateSFC from './TemplateComponent.vue'
import Uploader from './Uploader/Uploader.vue'
import './style.css'

const TemplateComponent = {
  install(app: any, options: any) {
    app.component('TemplateComponent', TemplateSFC)
  },
}
export * from './utils/upload'
export * from './utils/common'
export {TemplateComponent,Uploader}
