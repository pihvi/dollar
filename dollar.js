var Q = require("q")
var cheerio = require("cheerio")
var request = require("request")

exports.get = function(url) {
  var deferred = Q.defer()
  request(url, function(err, resp, body){
    if (err) {
      deferred.reject(err)
    } else {
      var $ = cheerio.load(body)
      deferred.resolve($)
    }
  })
  return deferred.promise
}
