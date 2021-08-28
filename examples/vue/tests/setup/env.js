import './window.js' // Must be imported before vue
import { createApp, nextTick } from 'vue'

export function reset() {
  window.document.title = ''
  window.document.head.outerHTML = ''
}

export function render(component, props = {}) {
  const container = window.document.body
  const app = createApp(component, props).mount(container)
  return { container, app }
}

export function fire(elem, event, details) {
  const evt = new window.Event(event, details)
  elem.dispatchEvent(evt)
  return nextTick()
}
