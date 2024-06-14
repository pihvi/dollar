import dollar from '../src/dollar.js'
import fs from 'fs'

const wikiHtml = fs.readFileSync(`./example/wikipedia.html`, 'utf8')
const wikiPromise = Promise.resolve(wikiHtml)
const start = Date.now()
console.log('Start..')

dollar('https://www.wikipedia.org/', {jQuery: true})
  .then(($) => {
    console.log(buildOutput('With full jQuery and internet', $, start))
  })

dollar('https://www.wikipedia.org/')
  .then(($) => {
    console.log(buildOutput('With faster and internet', $, start))
  })

dollar({html: wikiHtml})
  .then(($) => {
    console.log(buildOutput('With faster local', $, start))
  })

dollar({html: wikiHtml, jQuery: true})
  .then(($) => {
    console.log(buildOutput('With full jQuery local', $, start))
  })

dollar({html: wikiPromise, jQuery: false})
  .then(($) => {
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
  const txt = $('h1').text().trim().replace(/\n/g, ' ')
  return `${buildMsg(msg)}${txt} / ${(Date.now() - begin)} ms`
}
