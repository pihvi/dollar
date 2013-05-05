var dollar = require('./dollar')
var hs = require('fs').readFileSync("./hs.fi.html").toString()
console.log('Start..')

dollar.get('http://www.hs.fi/').then(function($) {
  console.log('With full jQuery:\t', extractData($))
})

dollar.get('http://www.hs.fi/', {fullJQuery: false}).then(function($) {
  console.log('With faster:\t\t', extractData($))
})

dollar.get(hs, {fullJQuery: false}).then(function($) {
  console.log('With faster local:\t', extractData($))
})

dollar.get(hs).then(function($) {
  console.log('With full jQuery local:\t', extractData($))
})

function extractData($) {
  var a = $('.module.teaser').first().find('a.article-link').first()
  return a.text().trim() + ' / ' + a.data('article-id')
}
