
const fs           = require('fs');
const path         = require('path');
const EventEmitter = require('events');
const debounce     = require('debounce');

me = module.exports;

class PushFSBase extends EventEmitter
{
  constructor(basedirname, session)
  {
    super();

    basedirname = path.normalize(path.join(process.cwd(), basedirname + '/'));
    basedirname = basedirname.substr(0, basedirname.length - 1);

    if ( !session )
      session = 'default';

    const dirname = path.join(basedirname, session);

    this.basedirname = () => basedirname;
    this.session     = () => session;
    this.dirname     = () => dirname;

    this.cleanup();
  }

  async cleanup()
  {
    const rimraf      = require('rimraf');
    const basedirname = this.basedirname();

    fs.readdirSync(basedirname).forEach(filename => {
      if ( fs.statSync(basedirname + '/' + filename).isDirectory() )
        rimraf.sync(basedirname + '/' + filename);
    });
  }
}

// --- //

me.PushFSWatcher = class PushFSWatcher extends PushFSBase
{
  constructor(basedirname, session)
  {
    super(basedirname, session);

    const dirname = this.dirname();

    if ( fs.existsSync(dirname) )
      throw new Error('Session already locked');

    fs.mkdirSync(dirname);

    process.chdir(dirname); // To lock directory, search for a better way

    const commands = {};

    fs.watch('.', (action, filename) =>
    {
      if ( !commands[filename] )
        commands[filename] = debounce(() => {

          if ( !fs.existsSync(filename) )
            return;

          delete commands[filename];

          var message = JSON.parse(fs.readFileSync(filename, 'utf8'));

          fs.unlinkSync(filename);

          this.emit('message', message);

        }, 100);

      commands[filename]();
    });
  }
}

// --- //

me.PushFSSender = class PushFSSender extends PushFSBase
{
  constructor(basedirname, session)
  {
    super(basedirname, session);

    if ( !fs.existsSync(this.dirname()) )
      throw new Error('Session not watched');
  }

  send(message)
  {
    const unique = ((new Date().getTime()).toString() + Math.random()).replace(/\./, '');

    fs.writeFileSync(this.dirname() + '/' + unique + '.json', JSON.stringify(message));
  }
}

// --- //

me.open  = (basedirname, session) => { return new me.PushFSSender (basedirname, session); }
me.watch = (basedirname, session) => { return new me.PushFSWatcher(basedirname, session); }
