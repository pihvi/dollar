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

### Encoding support ###
```javascript
var dollar = require('dollar')
dollar
  .get({url: 'http://reaktor.fi/', encoding: 'ISO-8859-1'})
  .then(function($) {
    console.log($('h1').text())
  })
```
Output encoding can be set with "encodingTo" parameter.

### Faster performance ###
```javascript
var dollar = require('dollar')
dollar
  .get({url: 'http://reaktor.fi/', fullJQuery: false})
  .then(function($) {
    console.log($('h1').text())
  })
```
Uses cheerio instead of jQuery for better performance.

### All parameters and defaults ###
```javascript
{
  fullJQuery: true,
  url: undefined,
  html: undefined,
  htmlPromise: undefined,
  encoding: 'UTF-8',
  encodingTo: 'UTF-8'
}
```

## Changelog ##
### 0.3.3 - 2017-10-25 ###
- Upgrade jQuery to 3.2.1 and use it via npm

### 0.3.2 - 2017-10-25 ###
- Upgrade npm deps

### 0.3.1 - 2016-01-28 ###
- Upgrade npm deps

### 0.3.0 - 2016-08-21 ###
- Encoding support

### 0.2.0 - 2016-08-18 ###
- Upgrade jQuery from 2 to 3
- Upgrade npm deps

### 0.1.0 - 2014-03-30 ###
- something

## License ##
Apache 2.0
