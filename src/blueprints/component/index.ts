import { hyphenCase } from '../../utils'
import { Context } from '../..'

function component (model: any, context: Context) {
  let name = hyphenCase(model.name)

  return Promise.all([
    context.dustTemplate('component', model),
    context.dustTemplate('component.component.ts', model),
    context.dustTemplate('component.component.html', model),
    context.dustTemplate('component.component.css', model)
  ]).then(([index, component, html, css]) => ({
    type: 'component',
    files: [{
      filename: `${name}/index.ts`,
      body: index
    }, {
      filename: `${name}/${name}.component.ts`,
      body: component
    }, {
      filename: `${name}/${name}.component.html`,
      body: html
    }, {
      filename: `${name}/${name}.component.css`,
      body: css
    }]
  }))
}

export function generateComponent (model: any, namespace: string[], context: Context): Promise<any> {
  let components = Object.keys(model.rpc).map((x: string) => {
    let opts = model.rpc[x].options
    let params: string[] = opts['(google.api.http)'].post.match(/\{([a-z]+)}/g) || []

    return Object.assign({}, model, {
      name: opts['(component)'].name,
      service: model.name,
      method: x,
      params: params.map(x => x.replace(/\{([a-z]+)}/, '$1'))
    })
  }).map(m => component(m, context))

  return Promise.all(components)
}
