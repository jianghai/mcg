# Markdown 目录生成器

## 使用前

test.md

```
# title

## title1

### title1-1

## title2
```

## 使用后

test.md

```
# title

## 1 title1

### 1.1 title1-1

## 2 title2
```

test-contents.md

```
* [1 title1](#1-title1)
  * [1.1 title1-1](#11-title1-1)
* [2 title2](#2-title2)
```

## 安装

```sh
$ npm install -g mcg
```

## 使用方法

```sh
$ mcg --source ./test.md
```

## 文档

* --source file 源文件
* --dist file 目标文件，如果不指定，则覆盖源文件
* --no-contents 不生成目录文件，默认生成
* --start number 目录开始级别，默认从 h2 开始，h1 开始则指定为 1 即可