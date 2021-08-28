import { JSDOM } from 'jsdom'

const { window } = new JSDOM('')

global.window = window
global.document = window.document
global.navigator = window.navigator
global.Element = window.Element
global.SVGElement = window.SVGElement
