# Telegraph-API

Telegram's [Telegraph](http://telegra.ph/) doesn't have API. Package suggest some missed handles for publishing posts on Telegraph's platform.

## Install

Terminal:
```shell
// npm
npm i telegraph-api --save

// yarn
yarn add telegraph-api
```

## Usage

First of all you need to create new instance of `telegraph-api`.

```javascript
const Post = require('telegraph-api');

// without params
const firstPost = new Post();

// or with params
const secondPost = new Post({
    header: 'Header',
    author: 'Author',
    paragraphs: ['Paragraph']
});
```

Then you can use public getters and setters methods that it provides:

- `getHeader()` - returns String
- `setHeader({String})`
- `getAuthor()` - returns String
- `setAuthor({String})`
- `getParagraphs()` - returns String[]
- `setParagraphs({String[]})`
- `setParagraph({String})`
- `removeLastParagraph()`
- `emptyHeader()`
- `emptyAuthor()`
- `emptyParagraphs()`
- `publishPost({Function({Error}, {String})})`

## Examples

**Filled constructor**

```javascript
const Post = require('telegraph-api');

const myPost = new Post({
    header: 'Telegraph-API',
    author: 'Roman Ponomarev',
    paragraphs: ['First post by Telegraph-API']
});

myPost.publishPost((err, link) => {
    if (err) {
        throw new Error(error);
    }

    console.log(`Link to Post: ${link}`); // => Link to Post: http://telegra.ph/Telegraph-API-11-28
});
```

**Empty constructor**

```javascript
const Post = require('telegraph-api');

const myPost = new Post();

myPost.setHeader('Telegraph-API');
myPost.setAuthor('Roman Ponomarev');
myPost.setParagraph('Second post by Telegraph-API');

console.log(myPost.getHeader()); // => Telegraph-API
console.log(myPost.getAuthor()); // => Roman Ponomarev
console.log(myPost.getParagraphs()); // => ['Second post by Telegraph-API']

myPost.publishPost((err, link) => {
    if (err) {
        throw new Error(error);
    }

    console.log(`Link to Post: ${link}`); // => Link to Post: http://telegra.ph/Telegraph-API-11-28-2
});
```
