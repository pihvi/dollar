var dollar = require('./../lib/dollar')
var wikiHtml = require('fs').readFileSync(__dirname + '/wikipedia.html').toString()
var wikiPromise = require('q')(wikiHtml)
var start = Date.now()

console.log('Start..')

dollar.get('https://www.wikipedia.org/').then(function($) {
  console.log(buildOutput('With full jQuery and internet', $, start))
})

dollar.get({url: 'https://www.wikipedia.org/', fullJQuery: false}).then(function($) {
  console.log(buildOutput('With faster and internet', $, start))
})

dollar.get({html: wikiHtml, fullJQuery: false}).then(function($) {
  console.log(buildOutput('With faster local', $, start))
})

dollar.get({html: wikiHtml}).then(function($) {
  console.log(buildOutput('With full jQuery local', $, start))
})

dollar.get({htmlPromise: wikiPromise, fullJQuery: false}).then(function($) {
  console.log(buildOutput('With faster promised local html', $, start))
})

function buildMsg(msg) {
  var result = msg + ':'
  while (result.length < 35) {
    result += ' '
  }
  return result
}

function buildOutput(msg, $, begin) {
  return buildMsg(msg) + extractData($) + ' / ' + (Date.now() - begin) + 'ms'
}

function extractData($) {
  return $('h1').text().trim()
}
