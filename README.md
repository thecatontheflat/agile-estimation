# Estimation-tool

## Installation

### Requirements

Before installation of nodejs and npm check http://stackoverflow.com/a/21715730/970721

* node.js
* mongodb
* npm
    * bower
    * grunt-cli
    * express
    * jade

### Prepare environment
1. `sudo apt-get install mongodb-server`
2. `npm install -g bower grunt-cli`

### Setup the project

```
git clone ...
npm install
grunt mongo-start/grunt mongo-stop
grunt dev
```

Command, `grunt mongo-start` will start mongoDb server (don't forget install mongoDb server before).

Command, `grunt mongo-stop` will stop mongoDb server.

Command, `grunt dev`, will compile sources, run mongo server, run node server, start watching your files, open browser.
If you want to stop processes, just use `Ctrl + C`.