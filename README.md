Web scraper with a jQuery like wrapper.

## Usage ##
```javascript
var dollar = require('dollar')
dollar
  .get('http://reaktor.fi/')
  .then(function($) {
    console.log($('h1').text())
  })
```

## License ##
Apache 2.0
