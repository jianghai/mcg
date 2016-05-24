/**
 * mcg v0.0.5 - markdown catalogues generator
 * Copyright (c) 2016, Hai Jiang. (MIT Licensed)
 * https://github.com/jianghai/mcg
 */

'use strict'

var fs = require('fs')

function generate(file, dist) {

  function getCataloguesStr(catalogues) {
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

  function getOrderedFileContentAndCatalogues(fileContent) {
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

  function getFileContentWithCatalogues(fileContent, cataloguesStr) {
    return fileContent.replace(/\n[\s\S]*?##/, '\n\n' + cataloguesStr + '\n##')
  }

  var fileContent = fs.readFileSync(file, 'utf-8')
  var res = getOrderedFileContentAndCatalogues(fileContent)
  fileContent = getFileContentWithCatalogues(res[0], getCataloguesStr(res[1]))
  fs.writeFileSync(dist || file, fileContent)
}

module.exports = generate