var dollar = require('./dollar')
console.log('Start..')

dollar.get('http://www.hs.fi/').then(function($) {
  console.log('With full jQuery:\t\t', extractData($))
})

dollar.get('http://www.hs.fi/', {fullJQuery: false}).then(function($) {
  console.log('With faster jQuery like:\t', extractData($))
})

function extractData($) {
  var a = $('.module.teaser').first().find('a.article-link').first()
  return a.text().trim() + ' / ' + a.data('article-id')
}
