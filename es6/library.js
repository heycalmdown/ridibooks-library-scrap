import superagent from 'superagent';
import Xray from 'x-ray';
import Promise from 'bluebird';
import mkdirp from 'mkdirp';

import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

import config from './config';
import driver from './driver';

const getDirName = path.dirname;
const mkdirP = Promise.promisify(mkdirp);
const writeFile = Promise.promisify(fs.writeFile);
function writeFileP(path, contents) {
  return mkdirP(getDirName(path)).then(() => {
    return writeFile(path, contents);
  });
}

const agent = superagent.agent();

const query = {query: {user_id: config.id, password: config.password}};
const uri = `https://ridibooks.com/account/action/login${url.format(query)}`;

export default function () {
  const req = agent.get(uri);
  return Promise.promisify(req.end, req)().then((res) => {
    const x = Xray().driver(driver(agent)).delay(100);
    const query = x('http://ridibooks.com/library', '#book_', [{
      title: 'span.title_text',
      author: '.book_metadata.author > a',
      series: '.series_book > .book_count',
      id: '.book_thumbnail label@for'
    }]).paginate('.btn_next > a@href');

    return Promise.promisify(query)();
  }).then(books => {
    books = books.map(book => {
      book.title = _.trim(book.title);
      book.series = book.series || 1;
      return book;
    });
    return writeFileP('./tmp/books.json', JSON.stringify(books)).then(() => books);
  });
}
