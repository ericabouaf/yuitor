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

var srcPath = path.resolve(process.argv[2]);

var newProjectName = path.basename(srcPath) + '3';
var newProjectPath = path.resolve(srcPath, '..');


yproject.createProject(newProjectName, newProjectPath);


function generateModule(file) {

   var filename = path.basename(file);
   var moduleName = filename.substr(0, filename.length - 3);

   yproject.createModule(moduleName, {tests:true, lang: true}, path.join(newProjectPath, newProjectName) );

   var jsFileName = path.join(newProjectPath, newProjectName, 'src', moduleName, 'js', moduleName+'.js');
   var code = fs.readFileSync(file).toString();
   var ret = yuitor.transform(code);
   fs.writeFileSync(jsFileName, ret.code);

   // TODO: writing dependencies in meta !

}

function walkDirectory(dir) {

   //console.log("processing "+dir);

   var files = fs.readdirSync(dir);

   files.forEach(function(file) {

      if(path.extname(file) == '.js') {
         //console.log("js file found: "+file);
         generateModule(path.join(dir, file));
      }
      else if (fs.statSync(path.join(dir, file)).isDirectory()) {
         walkDirectory(path.join(dir, file));
      }

   });

}
walkDirectory(srcPath);
