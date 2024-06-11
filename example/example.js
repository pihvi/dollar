import * as dollar from './../lib/dollar.js'
import fs from 'fs'

const wikiHtml = fs.readFileSync(`./example/wikipedia.html`, 'utf8')
const wikiPromise = Promise.resolve(wikiHtml)
const start = Date.now()
console.log('Start..')

dollar.get('https://www.wikipedia.org/').then(($) => {
  console.log(buildOutput('With full jQuery and internet', $, start))
})

dollar.get({url: 'https://www.wikipedia.org/', fullJQuery: false}).then(($) => {
  console.log(buildOutput('With faster and internet', $, start))
})

dollar.get({html: wikiHtml, fullJQuery: false}).then(($) => {
  console.log(buildOutput('With faster local', $, start))
})

dollar.get({html: wikiHtml}).then(($) => {
  console.log(buildOutput('With full jQuery local', $, start))
})

dollar.get({htmlPromise: wikiPromise, fullJQuery: false}).then(($) => {
  console.log(buildOutput('With faster promised local html', $, start))
})

const buildMsg = (msg) => {
  let result = `${msg}:`
  while (result.length < 35) {
    result += ' '
  }
  return result
}

const buildOutput = (msg, $, begin) => {
  return `${buildMsg(msg)}${extractData($).replace(/\n/g, ' ')} / ${(Date.now() - begin)}ms`
}

const extractData = ($) => {
  return $('h1').text().trim()
}
