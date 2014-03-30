var dollar = require('./../lib/dollar')
var hs = require('fs').readFileSync(__dirname + '/hs.fi.html').toString()
var hsPromise = require('q')(hs)
var start = Date.now()

console.log('Start..')

dollar.get('http://www.hs.fi/').then(function($) {
  console.log(buildOutput('With full jQuery and internet', $, start))
})

dollar.get({url: 'http://www.hs.fi/', fullJQuery: false}).then(function($) {
  console.log(buildOutput('With faster and internet', $, start))
})

dollar.get({html: hs, fullJQuery: false}).then(function($) {
  console.log(buildOutput('With faster local', $, start))
})

dollar.get({html: hs}).then(function($) {
  console.log(buildOutput('With full jQuery local', $, start))
})

dollar.get({htmlPromise: hsPromise, fullJQuery: false}).then(function($) {
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
  var a = $('.module.teaser').first().find('a.article-link').first()
  return a.text().trim() + ' / ' + a.attr('data-article-id')
}
