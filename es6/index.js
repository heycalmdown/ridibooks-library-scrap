import fetchLibrary from './library';
import fetchInfo from './info';
import makeCsv from './csv';

fetchLibrary().then(books => {
  console.log(books.length);
}).then(() => {
  return fetchInfo();
}).then(() => {
  return makeCsv();
});
