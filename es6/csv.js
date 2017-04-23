import Promise from 'bluebird';
import * as _fs from 'fs';
import * as _ from 'lodash';

const fs = Promise.promisifyAll(_fs);

export default function () {
  return fs.readFileAsync('./tmp/info.json').then(info => {
    info = JSON.parse(info);
    const header = ['id', 'category', 'title', 'author', 'rating', 'series'];
    const body = _.map(info, book => header.map(col => book[col] && `"${book[col]}"`).join(','));
    return fs.writeFileAsync('./tmp/out.csv', [header.join(',')].concat(body).join('\n'));
  });
}
