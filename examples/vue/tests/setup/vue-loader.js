import {
  parse,
  compileScript,
  compileTemplate,
  rewriteDefault
} from '@vue/compiler-sfc'
import { basename } from 'path'

const COMP_IDENTIFIER = `__sfc__`

export function getFormat(url, context, defaultGetFormat) {
  return url.endsWith('.vue')
    ? { format: 'module' }
    : defaultGetFormat(url, context, defaultGetFormat)
}

export function transformSource(source, context, defaultTransformSource) {
  const { url } = context

  if (!url.endsWith('.vue')) {
    return defaultTransformSource(source, context, defaultTransformSource)
  }

  const filename = basename(url)

  const { descriptor, errors } = parse(source.toString(), { filename })
  if (errors.length > 0) {
    errors.forEach((error) => console.error(error))
  }

  let code
  let bindings
  if (descriptor.script || descriptor.scriptSetup) {
    const compiledScript = compileScript(descriptor, {
      id: descriptor.filename,
      refTransform: true,
      inlineTemplate: true
    })
    code = rewriteDefault(compiledScript.content, COMP_IDENTIFIER)
    bindings = compiledScript.bindings
  } else {
    code = `const ${COMP_IDENTIFIER} = {}`
  }

  if (descriptor.template && !descriptor.scriptSetup) {
    const templateResult = compileTemplate({
      source: descriptor.template.content,
      filename: descriptor.filename,
      id: descriptor.filename,
      scoped: descriptor.styles.some((s) => s.scoped),
      slotted: descriptor.slotted,
      ssr: false,
      ssrCssVars: descriptor.cssVars,
      isProd: false,
      compilerOptions: {
        bindingMetadata: bindings
      }
    })
    if (templateResult.errors.length > 0) {
      templateResult.errors.forEach((error) => console.error(error))
    } else {
      code += `\n${templateResult.code.replace(
        /\nexport (function) (render)/,
        `$1 render`
      )}`
      code += `\n${COMP_IDENTIFIER}.render = render`
    }
  }

  code += `\nexport default ${COMP_IDENTIFIER}`

  return {
    source: code
  }
}
