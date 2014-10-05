
lomadee-offer
=============

Simplified version of the API Lomadee to provide its products and offers. Version for NodeJS.

## Dependencies

* [superagent](http://github.com/visionmedia/superagent)
* [underscore](http://github.com/jashkenas/underscore)
* [nomnom](http://github.com/harthur/nomnom)

## Usage examples

Full example:

```javascript
var lomadee = require('lomadee-offer');

lomadee({keywords: 'test'})
  .id('api key')
  .source('source id')
  .country('BR')
  .limit(5)
  .done(function (err, result) {
    console.log(JSON.stringify(result));
  });
```

Limit to one result:

```javascript
var lomadee = require('lomadee-offer');

lomadee({keywords: 'test'})
  .id('api key')
  .source('source id')
  .one()
  .done(function (err, result) {
    console.log(JSON.stringify(result));
  });
```

Pass in keywords directly

```javascript
var lomadee = require('lomadee-offer');

lomadee('test')
  .id('api key')
  .source('source id')
  .done(function (err, result) {
    console.log(JSON.stringify(result));
  });
```

Add client IP address if calling on someone else's behalf

```javascript
var lomadee = require('lomadee-offer');

lomadee('test')
  .id('api key')
  .source('source id')
  .client('192.168.1.1')
  .done(function (err, result) { ... })
```

## LICENSE

The MIT License (MIT)
Copyright (c) 2014 Paulo Vítor Bischof, Based on the "buscape-lookup" of Adam Rudd.

