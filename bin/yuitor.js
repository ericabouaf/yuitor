#!/usr/bin/env node
/*jshint node:true*/
"use strict";

var fs = require('fs'),
    path = require('path'),
    yproject = require('yproject').yproject,
    yuitor = require('../lib/yuitor');

if (process.argv.length != 3) {
   console.log("Pass a folder !");
   process.exit(1);
}

var srcPath = path.resolve(process.argv[2]),
    newProjectName = path.basename(srcPath) + '3',
    newProjectPath = path.resolve(srcPath, '..');

yproject.createProject(newProjectName, newProjectPath);

function generateModule(file) {

   // name module after its relative path:
   //  ex: components/view.js => component-view
   var t = path.relative( newProjectPath, file).split('/').slice(1).join('-');
   var moduleName = t.substr(0, t.length - 3);

   yproject.createModule(moduleName, {tests:true, lang: true}, path.join(newProjectPath, newProjectName) );

   // JS transformation
   var jsFileName = path.join(newProjectPath, newProjectName, 'src', moduleName, 'js', moduleName+'.js');
   var code = fs.readFileSync(file).toString();
   var ret = yuitor.transform(code);
   fs.writeFileSync(jsFileName, ret.code);

   // Add YUI3 module dependencies in meta description
   var metaFileName = path.join(newProjectPath, newProjectName, 'src', moduleName, 'meta', moduleName+'.json');
   var metaStruct = JSON.parse( fs.readFileSync(metaFileName).toString() );
   ret.dependencies.forEach(function(dep) {
      if (metaStruct[moduleName].requires.indexOf(dep) === -1) {
         metaStruct[moduleName].requires.push(dep);
      }
   });
   fs.writeFileSync(metaFileName, JSON.stringify(metaStruct, null, 3));
}

function walkDirectory(dir) {
   var files = fs.readdirSync(dir);
   files.forEach(function(file) {
      if (path.extname(file) == '.js') {
         generateModule(path.join(dir, file));
      }
      else if (fs.statSync(path.join(dir, file)).isDirectory()) {
         walkDirectory(path.join(dir, file));
      }
   });

}
walkDirectory(srcPath);
