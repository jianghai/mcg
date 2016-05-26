/**
 * mcg v0.0.5 - markdown catalogues generator
 * Copyright (c) 2016, Hai Jiang. (MIT Licensed)
 * https://github.com/jianghai/mcg
 */

'use strict'

var fs = require('fs')

var recurse = function(executer) {
  return executer.apply(null, [].slice.call(arguments, 1).concat(executer))
}

var getCataloguesStr = function(catalogues) {
  var result = ''
  recurse(function(list, indent, executer) {
    list.forEach(function(item) {
      var title = item.orders.join('.') + ' ' + item.title
      var href = item.orders.join('') + '-' + item.title
      href = href.toLowerCase()
      href = href.replace(/\s/g, '-')
      result += Array(indent + 1).join(' ') + '* [' + title + '](#' + href + ')\r\n'
      item.children && executer(item.children, indent + 2)
    })
  }, catalogues, 0)
  return result
}

var parse = function(getCataloguesStr, fileContent) {
  var orders = []
  var catalogues = []
  fileContent = fileContent.replace(/(#{2,})\s*[\d\.\s]*(.*)/g, function(match, level, title) {
    var start = level.length - 2
    if (orders.length !== start + 1) {
      orders.length = start + 1
      orders[start] || (orders[start] = 0)
    }
    orders[start]++
    
    var temp = catalogues
    orders.slice(1).forEach(function(order, i) {
      temp = temp[orders[i] - 1]
      temp.children || (temp.children = [])
      temp = temp.children
    })
    temp.push({
      orders: orders.concat(),
      title: title
    })
    
    return level + ' ' + orders.join('.') + ' ' + title
  })
  return fileContent.replace(/\n[\s\S]*?##/, '\n\n' + getCataloguesStr(catalogues) + '\n##')
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
    .then(parse.bind(null, getCataloguesStr))
    .then(writeFile.bind(null, fs, dist || file))
    .catch(function(reason) { console.log(reason) })
}

module.exports = generate