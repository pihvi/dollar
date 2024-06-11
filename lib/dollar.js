import cheerio from 'cheerio'
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

export const get = (urlOrOptions) => {
  const opts = buildOptions(urlOrOptions)
  if (opts.fullJQuery) {
    return jsdomify(opts.htmlPromise)
  } else {
    return cheerify(opts.htmlPromise)
  }
}

const cheerify = (htmlPromise) => {
  return htmlPromise.then(body => cheerio.load(body))
}

const jsdomify = (htmlPromise) => {
  return Promise.all([jQueryPromise, htmlPromise])
    .then(([jquery, body]) => new Promise((resolve, reject) => {
      const dom = new jsdom.JSDOM(body, {runScripts: 'outside-only'})
      dom.window.eval(jquery)
      resolve(dom.window.$)
    }))
}

const buildOptions = (urlOrOptions) => {
  const options = moveUrlToDefaultOptions(urlOrOptions)
  const htmlPromise = buildHtmlPromise(options)
  return _.extend(options, {htmlPromise})
}

const buildHtmlPromise = (options) => {
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

const promiseFromUrl = async (options) => {
  const response = await fetch(options.url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${options.url}: ${response.statusText}`)
  }
  const buffer = await response.arrayBuffer()
  const buff = encoding.convert(Buffer.from(buffer), options.encodingTo, options.encoding)
  return buff.toString(options.encodingTo)
}

const moveUrlToDefaultOptions = (urlOrOptions) => {
  if (typeof urlOrOptions === 'string') {
    return _.extend({}, defaults, {url: urlOrOptions})
  } else {
    return _.extend({}, defaults, urlOrOptions)
  }
}
