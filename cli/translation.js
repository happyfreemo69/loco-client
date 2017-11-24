#!/usr/bin/node
var api = require('../apicli');

var optimist = require('optimist').usage(
`get translation:
    node loco.js -t idToTranslate -l fr

create translation for asset
    node loco.js -c idToTranslate -l fr -b data
`)
        .options('t', {
            alias : 'translate',
            describe: 'translate the id'
        })
        .options('c', {
            alias : 'create',
            describe: 'create a translation'
        })
        .options('l', {
            alias : 'locale',
            describe: 'for the given locale'
        })
        .options('b', {
            alias : 'body',
            describe: 'data for the translation'
        })
var argv = optimist.argv;
if(argv.help){
    optimist.showHelp()
    process.exit(0);
}
if(!process.env.LOCO_APIKEY){
    throw 'missing export LOCO_APIKEY=something';
}
const cred = {loco_apiKey: process.env.LOCO_APIKEY};
if(!argv.t && !argv.c){
    optimist.showHelp()
    process.exit(0);   
}

if(argv.c){
    if(!argv.locale){
        throw 'expect locale';
    }
    if(!argv.body){
        throw 'expect body';
    }
    return api.createTranslation(cred, {id:argv.t, name:argv.body}, argv.locale).then(x=>{
        console.log(JSON.stringify(x,null,1));
    })
}

if(argv.t){
    if(!argv.l){
        throw 'expect locale';
    }
    return api.getTranslation(cred, argv.t, argv.locale).then(x=>{
        console.log(JSON.stringify(x,null,1));
    })
}