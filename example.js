var dollar = require('./dollar')
console.log('Start..')

dollar.get('http://reaktor.fi/').then(function($) {
  console.log($('h1').text())
})
