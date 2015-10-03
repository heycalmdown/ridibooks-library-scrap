import fetchLibrary from './library';
import fetchInfo from './info';
import makeCsv from './csv';

makeCsv();
/*
fetchLibrary().then(books => {
  console.log(books.length);
}).then(() => {
  return fetchInfo();
}).then(() => {
  return makeCsv();
});
*/
