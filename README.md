#  YUItor !

EXPERIMENTAL: use at your own risks !

YUItor converts YUI2 javascript code to YUI3 equivalent functions.

This project is just a proof of concept, but we used it to effectively decrease migration time.


## How it works

The code is parsed using [esprima](http://esprima.org/).

The syntax tree is then manipulated to replace YUI functions with newer ones.

The syntax tree is finally transformed into code using [escodegen](https://github.com/Constellation/escodegen).

Additionnaly, the source is transformed into a shifter YUI3 module structure using [yproject](https://github.com/neyric/yproject)

