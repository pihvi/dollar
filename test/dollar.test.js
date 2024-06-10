import test from 'node:test'
import assert from 'node:assert/strict'
import {JSDOM} from 'jsdom'
import {promises as fs} from 'fs'

test('jsdom init', () => {
  const html = '<html lang=""><body><h1>lol</h1></body></html>'
  const dom = new JSDOM(html)
  const h1 = dom.window.document.querySelector('h1').textContent
  assert.equal(h1, 'lol')
})

test('jsdom jQuery', async () => {
  const html = '<html lang=""><body><h1>lol</h1></body></html>'
  const dom = new JSDOM(html, {runScripts: 'outside-only'})
  const jQueryPath = './node_modules/jquery/dist/jquery.js'
  const jQuery = await fs.readFile(jQueryPath, 'utf-8')
  dom.window.eval(jQuery)
  const h1 = dom.window.$('h1').text()
  assert.equal(h1, 'lol')
})
