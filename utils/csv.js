const fs = require('fs');
const csv = require('fast-csv');

const fileStream = fs.createWriteStream(`${__dirname}/foo.csv`, { flags: 'a' });

// csv를 만드느 함수
const stream = csv.format();

// nodejs에서 stream은 3가지.
// readable, writable, duplex stream
// promise는 대기, 성공, 실패의 경우로 끝나지만
// stream은 pending이라는 상태가 아니라 데이터 흐를때, 실패가 흐를때, 스트림 종료될때로 나뉨
// done이면 스트림 종료인데 done은 없어도 된다. 대표적인게 서버 로그파일
stream.on('data', data => {
  console.log('데이터가 드렁왔네?');
  console.log(String(data));
});

stream.pipe(fileStream);

// stream.on('end', () => {
//   console.log('stream 끝');
// });

// stream.pipe(process.stdout);
// stream.write({ foo: 1, bar: 'hello' });

// setTimeout(() => {
//   stream.write({ foo: 222, bar: 'dmdkdkdkdk' });
// }, 2000);

setInterval(() => {
  stream.write({
    user: 'doori',
    timestamp: (new Date()).toUTCString(),
    randomValue: Math.floor(Math.random() * 10000),
  });
}, 2000);

// setTimeout(() => {
//   stream.end();
// }, 6000);

console.log(stream);
