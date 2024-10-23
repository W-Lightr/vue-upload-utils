import TemplateSFC from './TemplateComponent.vue'

const TemplateComponent = {
  install(app: any, options: any) {
    app.component('TemplateComponent', TemplateSFC)
  },
}

export default TemplateComponent
