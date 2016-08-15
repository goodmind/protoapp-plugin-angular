import { hyphenCase } from '../../utils'
import { Context } from '../..'

function generateRpc (model: any): any {
  let options: { [s: string]: any } = {}
  for (let opt in model.options) {
    let keys = opt.split('.')
    let key = keys.pop()

    if (!options[keys.join('.')]) {
      options[keys.join('.')] = {}
    }

    options[keys.join('.')][key] = model.options[opt]
  }

  return Object.assign({}, model, { options })
}

export function generateService (model: any, namespace: string[], context: Context): Promise<any> {
  for (let m in model.rpc) {
    model.rpc[m] = generateRpc(model.rpc[m])
  }

  let name = hyphenCase(model.name)

  return context.dustTemplate('service', model).then((out: string) => ({
    type: 'service',
    files: [{
      filename: `${name}.service.ts`,
      body: out
    }]
  }))
}
