Web scraper with a jQuery like wrapper.

## Usage ##
Uses Cheerio by default instead of jQuery for better performance.
```javascript
import * as dollar from 'dollar'

const $ = await dollar.get('https://www.wikipedia.org/')
console.log($('h1').text())
```

### Use real jQuery which is slower ###
```javascript
const $ = await dollar.get({url: 'http://reaktor.fi/', fullJQuery: false})
console.log($('h1').text())
```

### All parameters and defaults ###
```javascript
{
  fullJQuery: false,
  url: undefined,
  html: undefined,
  htmlPromise: undefined,
}
```

## License ##
Apache 2.0

## Changelog ##
### 1.0.0 - 2024-06-11 ###
- Use ES6
- Remove Q and use native promises
- Remove lodash and use native functions
- Remove request and use fetch
- Remove encoding lib
- Upgrade rest i.e. jQuery, Cheerio and jsdom


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
