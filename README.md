Web scraper with a jQuery like wrapper.

## Usage ##
Uses Cheerio by default instead of jQuery for better performance.
```javascript
import dollar from 'dollar'

const $ = await dollar('https://www.wikipedia.org/')
console.log($('h1').text())
```

### Use real jQuery which is slower ###
```javascript
const $ = await dollar('https://www.wikipedia.org/', {jQuery: true})
console.log($('h1').text())
```

### Use given html ###
```javascript
const $ = await dollar({html: '<html><h1>hello</h1></html>'})
console.log($('h1').text())
```

### All parameters and defaults ###
```javascript
{
  jQuery: false,
  url: undefined, // or string
  html: undefined, // or string or Promise returning string
}
```

## License ##
Apache 2.0

## Changelog ##
### 3.1.0 - 2025-04-20 ###
- Update deps, Cheerio v1, jsdom v26

### 3.0.1 - 2024-06-14 ###
- Update docs

### 3.0.0 - 2024-06-14 ###
- Remove get from API
- Dollar call signature changed to take options also as 2nd parameter  

### 2.0.1 - 2024-06-13 ###
- Update docs

### 2.0.0 - 2024-06-13 ###
- Parameter names changed
- html parameter can be a Promise or a string

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
