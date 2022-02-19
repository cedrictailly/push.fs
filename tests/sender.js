
const pushfs = require('..').open('./sessions', process.argv[2]);

pushfs.send({log: 'Hello from inside'});
pushfs.send({command: 'code "' + require('path').normalize(__dirname + '/../') + '"'});
