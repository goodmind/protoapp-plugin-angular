import { generateComponent } from './blueprints/component'
import { generateService } from './blueprints/service'
import { generateInterface } from './blueprints/interface'
import * as path from 'path'

export interface Context {
  dirname: string
  generateImportsService: Function
  generateImportsMessage: Function
  primitiveTypes: string[]
  dustTemplate: Function
}

export default function (context: Context) {
  let { generateImportsService, generateImportsMessage, primitiveTypes } = context

  context.dirname = path.join(__dirname, 'blueprints')

  return {
    visitor: {
      Service (service: any, namespace: string[]): Promise<any> {
        let model = Object.assign({}, service, {
          imports: generateImportsService(service, primitiveTypes)
        })

        return Promise
          .all([
            generateService,
            generateComponent
          ].map(fn => fn(model, namespace, context)))
      },

      Message (message: any, namespace: string[]): Promise<any> {
        let model = Object.assign({}, message, {
          imports: generateImportsMessage(message, primitiveTypes)
        })

        return Promise
          .all([
            generateInterface
          ].map(fn => fn(model, namespace, context)))
      }
    }
  }
}
