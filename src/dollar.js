import * as cheerio from 'cheerio'
import * as jsdom from 'jsdom'
import {promises as fs} from 'fs'

const jQueryPromise = fs.readFile('./node_modules/jquery/dist/jquery.js', 'utf8')

const defaults = {
  jQuery: false,
  url: undefined,
  html: undefined,
}

export const get = (urlOrOptions) => {
  const opts = buildOptions(urlOrOptions)
  if (opts.jQuery) {
    return jsdomify(opts.html)
  } else {
    return cheerify(opts.html)
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
  return {...options, html: htmlPromise(options)}
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

const moveUrlToDefaultOptions = (urlOrOptions) => {
  if (typeof urlOrOptions === 'string') {
    return {...defaults, url: urlOrOptions}
  } else {
    return {...defaults, ...urlOrOptions}
  }
}
