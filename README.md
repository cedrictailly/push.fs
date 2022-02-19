
# Push.fs

A module to push messages using file system in order to send information from inside a Docker container to the host machine.

The premise is that a directory can be shared using the "Volumes" functionnality, a NodeJS process inside the Docker container can write to that directory and a listener one can watches modifications to the host-side directory, quickly and without any bugs.

This package was written due to issues encountered when using the IPC protocol with Docker Desktop on Windows.

Private class variables are not supported everywhere, so functions setters are used instead.

## Installation

```bash
npm install -s push.fs
```

...or :

```bash
yarn add push.fs
```

## Usage

Todo, you can see an exemple in the tests folder.
