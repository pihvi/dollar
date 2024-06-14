import * as cheerio from 'cheerio'
import * as jsdom from 'jsdom'
import {promises as fs} from 'fs'

const jQueryPromise = fs.readFile('./node_modules/jquery/dist/jquery.js', 'utf8')

const defaults = {
  jQuery: false,
  url: undefined,
  html: undefined,
}

const dollar = async (urlOrOptions, options) => {
  const opts = buildOptions(urlOrOptions, options)
  const $ = await (opts.jQuery ? jsdomify(opts.html) : cheerify(opts.html))
  $.dollarOptions = opts
  return $
}

const cheerify = async (htmlPromise) =>
  cheerio.load(await htmlPromise)

const jsdomify = async (htmlPromise) => {
  const [jquery, html] =
    await Promise.all([jQueryPromise, htmlPromise])
  const dom = new jsdom.JSDOM(html, {runScripts: 'outside-only'})
  dom.window.eval(jquery)
  return dom.window.$
}

const buildOptions = (urlOrOptions, options) => {
  const opts = moveUrlToDefaultOptions(urlOrOptions, options)
  return {...opts, html: htmlPromise(opts)}
}

const htmlPromise = (options) => {
  if (options.url) {
    return promiseFromUrl(options)
  } else if (typeof options.html === 'string') {
    return Promise.resolve(options.html)
  } else if (options.html) {
    return options.html
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

const moveUrlToDefaultOptions = (urlOrOptions, options = {}) => {
  if (typeof urlOrOptions === 'string') {
    return {...defaults, ...options, url: urlOrOptions}
  } else {
    return {...defaults, ...urlOrOptions}
  }
}

export default dollar
