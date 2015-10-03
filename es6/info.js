import Xray from 'x-ray';
import Promise from 'bluebird';

import * as _fs from 'fs';
import * as _ from 'lodash';

let fs = Promise.promisifyAll(_fs);
let cachedInfo = {};

try {
  cachedInfo = JSON.parse(fs.readFileSync('./tmp/info.json'));
} catch (e) {}

export default function () {
  let books = JSON.parse(fs.readFileSync('./tmp/books.json'));
  let x = Xray().concurrency(10).throttle(10, '1s');

  books = books.filter(book => !cachedInfo[book.id]);
  return Promise.map(books, (book) => {
    let id = book.id.replace('book', '');
    let q = x('http://ridibooks.com/v2/Detail?id=' + id, {
      category: '.info_category_wrap > a',
      rating: '.info_metadata01_wrap meta[itemprop="ratingValue"]@content'
    });
    return Promise.promisify(q)()
      .then(info => _.merge(book, info))
      .then(info => {console.log(info.title); return info; });
  }).then(results => {
    _.merge(cachedInfo, _.indexBy(results, 'id'));
    return fs.writeFileAsync('./tmp/info.json', JSON.stringify(cachedInfo));
  });
}
