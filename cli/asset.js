#!/usr/bin/node
var api = require('../apicli');

var optimist = require('optimist').usage(
`
create asset:
    $0 -c -a id -b somedefaulttrad

get asset:
    $0 -a id
    `).options('c', {
        alias : 'create',
        describe: 'create an asset'
    })
    .options('a', {
        alias : 'assetId',
        describe: 'id of asset asset'
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
if(!argv.a){
    optimist.showHelp()
    process.exit(0);   
}

if(argv.c){
    if(!argv.b){
        throw 'expect body';
    }
    return api.createAsset(cred, {id:argv.assetId, name:argv.body}).then(x=>{
        console.log(JSON.stringify(x,null,1));
    })
}

return api.getAsset(cred, argv.assetId).then(x=>{
    console.log(JSON.stringify(x,null,1));
})