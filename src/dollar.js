import cheerio from 'cheerio'
import * as jsdom from 'jsdom'
import {promises as fs} from 'fs'

const jQueryPromise = fs.readFile('./node_modules/jquery/dist/jquery.js', 'utf8')

const defaults = {
  fullJQuery: false,
  url: undefined,
  html: undefined,
  htmlPromise: undefined,
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
  return {...options, htmlPromise}
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
  return await response.text()
}

const moveUrlToDefaultOptions = (urlOrOptions) => {
  if (typeof urlOrOptions === 'string') {
    return {...defaults, url: urlOrOptions}
  } else {
    return {...defaults, ...urlOrOptions}
  }
}
