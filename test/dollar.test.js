import {before, describe, test} from 'node:test'
import assert from 'node:assert/strict'
import {promises as fs} from 'fs'
import {JSDOM} from 'jsdom'
import * as dollar from '../src/dollar.js'

describe('with example html', () => {
  const htmlPromise = fs.readFile('./example/wikipedia.html', 'utf-8')
  let html
  before(async () => {
    html = await htmlPromise
  })

  test('dollar local faster', async () => {
    const $ = await dollar.get({html})
    const h1 = $('h1').text().trim()
    assert.equal(h1, 'The Free Encyclopedia')
  })

  test('dollar local faster with promise', async () => {
    const $ = await dollar.get({html: htmlPromise})
    const h1 = $('h1').text().trim()
    assert.equal(h1, 'The Free Encyclopedia')
  })

  test('dollar local jQuery', async () => {
    const $ = await dollar.get({html, jQuery: true})
    const h1 = $('h1').text().trim()
    assert.equal(h1, 'The Free Encyclopedia')
  })

  describe('just JSDOM', () => {
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
  })
})
