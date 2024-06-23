import dollar from '../src/dollar.js'
import fs from 'fs'

const wikiHtml = fs.readFileSync(`./example/wikipedia.html`, 'utf8')
const wikiPromise = Promise.resolve(wikiHtml)
console.log('Start..')

const fetchData = async () => {
  let start = Date.now()
  const $1 = await dollar('https://www.wikipedia.org/', {jQuery: true})
  console.log(buildOutput('', $1, start))

  start = Date.now()
  const $2 = await dollar('https://www.wikipedia.org/')
  console.log(buildOutput('', $2, start))

  start = Date.now()
  const $3 = await dollar({html: wikiHtml})
  console.log(buildOutput('', $3, start))

  start = Date.now()
  const $4 = await dollar({html: wikiHtml, jQuery: true})
  console.log(buildOutput('', $4, start))

  start = Date.now()
  const $5 = await dollar({html: wikiPromise, jQuery: false})
  console.log(buildOutput('promise', $5, start))
}

fetchData()
  .then(() => console.log('End..'))

const buildMsg = (msg, $) => {
  const type = $.dollarOptions.jQuery ? 'jQuery' : 'Cheerio'
  const source = $.dollarOptions.url ? 'internet' : 'local html'
  let result = `${type} and ${source} ${msg}`
  while (result.length < 35) {
    result += ' '
  }
  return result
}

const buildOutput = (msg, $, begin) => {
  const txt = $('h1').text().trim().replace(/\n/g, ' ')
  return `${buildMsg(msg, $)}${txt} / ${(Date.now() - begin)} ms`
}