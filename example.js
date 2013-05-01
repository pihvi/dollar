var dollar = require('./dollar')
console.log('Start..')

dollar.get('http://reaktor.fi/').then(function($) {
  console.log('With full jQuery:', $('h1').text())
})

dollar.get('http://reaktor.fi/', {fullJQuery: false}).then(function($) {
  console.log('With faster jQuery like:', $('h1').text())
})
