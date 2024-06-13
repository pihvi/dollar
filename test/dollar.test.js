import {before, describe, test} from 'node:test'
import assert from 'node:assert/strict'
import {JSDOM} from 'jsdom'
import {promises as fs} from 'fs'

describe('with example html', () => {
  let html
  before(async () => {
    html = await fs.readFile('./example/wikipedia.html', 'utf-8')
  })

  test('jsdom init', () => {
    const dom = new JSDOM(html)
    const h1 = dom.window.document.querySelector('h1').textContent.trim()
    assert.equal(h1, 'The Free Encyclopedia')
  })

  test('jsdom jQuery', async () => {
    const dom = new JSDOM(html, {runScripts: 'outside-only'})
    const jQueryPath = './node_modules/jquery/dist/jquery.js'
    const jQuery = await fs.readFile(jQueryPath, 'utf-8')
    dom.window.eval(jQuery)
    const h1 = dom.window.$('h1').text().trim()
    assert.equal(h1, 'The Free Encyclopedia')
  })

  test('dollar local faster', async () => {
    const html = '<html lang=""><body><h1>lol</h1></body></html>'
    const dom = new JSDOM(html)
    const h1 = dom.window.document.querySelector('h1').textContent
    assert.equal(h1, 'lol')
  })
})
