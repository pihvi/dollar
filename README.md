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
## Changelog ##

### 0.2.0 - 2016-08-18 ###
- Upgrade jQuery from 2 to 3
- Upgrade npm deps

### 0.1.0 - 2014-03-30 ###
- something

## License ##
Apache 2.0
