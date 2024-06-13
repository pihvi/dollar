import * as cheerio from 'cheerio'
import * as jsdom from 'jsdom'
import {promises as fs} from 'fs'

const jQueryPromise = fs.readFile('./node_modules/jquery/dist/jquery.js', 'utf8')

const defaults = {
  jQuery: false,
  url: undefined,
  html: undefined,
  htmlPromise: undefined,
}

export const get = (urlOrOptions) => {
  const opts = buildOptions(urlOrOptions)
  if (opts.jQuery) {
    return jsdomify(opts.htmlPromise)
  } else {
    return cheerify(opts.htmlPromise)
  }
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
