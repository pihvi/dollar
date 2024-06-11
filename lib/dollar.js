import cheerio from 'cheerio'
import request from 'request'
import encoding from 'encoding'
import * as jsdom from 'jsdom'
import _ from 'lodash'
import {promises as fs} from 'fs'

const jQueryPromise = fs.readFile('./node_modules/jquery/dist/jquery.js', 'utf8')

const defaults = {
  fullJQuery: true,
  url: undefined,
  html: undefined,
  htmlPromise: undefined,
  encoding: 'UTF-8',
  encodingTo: 'UTF-8'
}

export function get(urlOrOptions) {
  const opts = buildOptions(urlOrOptions)
  if (opts.fullJQuery) {
    return jsdomify(opts.htmlPromise)
  } else {
    return cheerify(opts.htmlPromise)
  }
}

function cheerify(htmlPromise) {
  return htmlPromise.then(body => cheerio.load(body))
}

function jsdomify(htmlPromise) {
  return Promise.all([jQueryPromise, htmlPromise])
    .then(([jquery, body]) => new Promise((resolve, reject) => {
      const dom = new jsdom.JSDOM(body, {runScripts: 'outside-only'})
      dom.window.eval(jquery)
      resolve(dom.window.$)
    }))
}

function buildOptions(urlOrOptions) {
  const options = moveUrlToDefaultOptions(urlOrOptions)
  const htmlPromise = buildHtmlPromise(options)
  return _.extend(options, {htmlPromise})
}

function buildHtmlPromise(options) {
  if (options.url) {
    return promiseFromUrl(options)
  } else if (options.html) {
    return Promise.resolve(options.html)
  } else if (options.htmlPromise) {
    return options.htmlPromise
  } else {
    throw new Error('Did not get url or html to dollarify.')
  }
}

function promiseFromUrl(options) {
  return new Promise((resolve, reject) => {
    request({uri: options.url, encoding: null}, (err, resp, body) => {
      if (err) {
        reject(err)
      } else {
        const buff = encoding.convert(body, options.encodingTo, options.encoding)
        resolve(buff.toString(options.encodingTo))
      }
    })
  })
}

function moveUrlToDefaultOptions(urlOrOptions) {
  if (typeof urlOrOptions === 'string') {
    return _.extend({}, defaults, {url: urlOrOptions})
  } else {
    return _.extend({}, defaults, urlOrOptions)
  }
}
