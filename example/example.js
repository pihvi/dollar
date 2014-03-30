var dollar = require('./../lib/dollar')
var hs = require('fs').readFileSync(__dirname + '/hs.fi.html').toString()
var hsPromise = require('q')(hs)
var start = Date.now()

console.log('Start..')

dollar.get('http://www.hs.fi/').then(function($) {
  console.log('With full jQuery and internet:', extractData($))
})

dollar.get({url: 'http://www.hs.fi/', fullJQuery: false}).then(function($) {
  console.log('With faster and internet:', extractData($))
})

dollar.get({html: hs, fullJQuery: false}).then(function($) {
  console.log('With faster local:', extractData($))
})

dollar.get({html: hs}).then(function($) {
  console.log('With full jQuery local:', extractData($))
})

dollar.get({htmlPromise: hsPromise, fullJQuery: false}).then(function($) {
  console.log('With faster promised local html:', extractData($))
})

function extractData($) {
  var a = $('.module.teaser').first().find('a.article-link').first()
  return a.text().trim() + ' / ' + a.attr('data-article-id') + (Date.now() - start) + 'ms'
}
