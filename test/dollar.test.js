import test from 'node:test'
import assert from 'node:assert/strict'
//import * as dollar from '../lib/dollar.js'
import {JSDOM} from 'jsdom'
import {promises as fs} from 'fs'

test('jsdom init', (t) => {
  const html = '<html lang=""><body><h1>lol</h1></body></html>'
  const dom = new JSDOM(html)
  const h1 = dom.window.document.querySelector('h1').textContent
  assert.equal(h1, 'lol')
})

test('jsdom jQuery', async (t) => {
  const html = '<html lang=""><body><h1>lol</h1></body></html>'
  const dom = new JSDOM(html, {runScripts: 'outside-only'})
  const jQuery = await fs.readFile('./node_modules/jquery/dist/jquery.js', 'utf-8')
  dom.window.eval(jQuery)
  const h1 = dom.window.$('h1').text()
  assert.equal(h1, 'lol')
})
