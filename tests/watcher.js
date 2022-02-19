
require('..').watch('./sessions', process.argv[2]).on('message', message => {
  if ( message.log )
    console.log(message.log);
  else if ( message.command )
    require('child_process').exec(message.command);
});
