/**
 * mcg v0.0.5 - markdown catalogues generator
 * Copyright (c) 2016, Hai Jiang. (MIT Licensed)
 * https://github.com/jianghai/mcg
 */

'use strict'

var fs = require('fs')

var getCataloguesStr = function(catalogues) {
  var result = ''

  function catalogueRender(list, indent) {
    list.forEach(function(item) {
      var title = item.orders.join('.') + ' ' + item.title
      var href = item.orders.join('') + '-' + item.title
      href = href.toLowerCase()
      href = href.replace(/\s/g, '-')
      result += Array(indent + 1).join(' ') + '* [' + title + '](#' + href + ')\r\n'
      item.children && catalogueRender(item.children, indent + 2)
    }, this)
  }
  catalogueRender(catalogues, 0)
  return result
}

var getOrderedFileContentAndCatalogues = function(fileContent) {
  var orders = []
  var catalogues = []
  var replacer = function(match, level, title) {
    var start = level.length - 2
    if (orders.length !== start + 1) {
      orders.length = start + 1
      orders[start] || (orders[start] = 0)
    }
    orders[start]++

    var temp = catalogues
    var i = 0
    while (orders[++i]) {
      temp = temp[orders[i - 1] - 1]
      temp.children || (temp.children = [])
      temp = temp.children
    }

    temp.push({
      orders: orders.concat(),
      title: title
    })
    return level + ' ' + orders.join('.') + ' ' + title
  }
  return [fileContent.replace(/(#{2,})\s*[\d\.\s]*(.*)/g, replacer), catalogues]
}

var getFileContentWithCatalogues = function(getCataloguesStr, res) {
  return res[0].replace(/\n[\s\S]*?##/, '\n\n' + getCataloguesStr(res[1]) + '\n##')
}

var readFile = function(fs, file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

var writeFile = function(fs, dist, fileContent) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(dist, fileContent, function(err) {
      if (err) reject(err)
      console.log('Build `' + dist + '` successed.')
    })
  })
}

/**
 * Entry
 */
var generate = function(file, dist) {
  readFile(fs, file)
    .then(getOrderedFileContentAndCatalogues)
    .then(getFileContentWithCatalogues.bind(null, getCataloguesStr))
    .then(writeFile.bind(null, fs, dist || file))
    .catch(function(reason) { console.log(reason) })
}

module.exports = generate