#!/usr/bin/env node

/**
 * Dependencies
 */
var lomadee = require('./')
  , nomnom = require('nomnom');

var opts = nomnom
  .script('lomadee')
  .nocolors()
  .option('id', {
    abbr: 'i',
    required: true,
    help: 'Lomadee api key'
  })
  .option('source', {
    abbr: 's',
    help: 'Set source id'
  })
  .option('country', {
    abbr: 'c',
    help: 'Country to query in'
  })
  .option('keywords', {
    abbr: 'k',
    required: true,
    help: 'Keywords to search'
  })
  .option('test', {
    abbr: 't',
    flag: true,
    help: 'Test mode'
  })
  .option('limit', {
    abbr: 'l',
    help: 'Limit number of returned products'
  })
  .option('one', {
    abbr: '1',
    help: 'Return only one product',
    flag: true,
    default: false
  })
  .option('client', {
    help: 'Set client ip'
  })
  .parse();

lomadee({keywords: opts.keywords})
  .id(opts.id)
  .country(opts.country)
  .test(opts.test)
  .one(opts.one)
  .limit(opts.limit)
  .source(opts.source)
  .client(opts.client)
  .done(function (err, res) {
    console.log(JSON.stringify(res));
  });
