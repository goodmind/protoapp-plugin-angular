import { hyphenCase } from '../../utils'
import { Context } from '../..'

export function generateInterface (model: any, namespace: string[], context: Context) {
  let name = hyphenCase(model.name)

  return context.dustTemplate('interface', model).then((out: string) => ({
    type: 'interface',
    files: [{
      filename: `${name}.ts`,
      body: out
    }]
  }))
}
