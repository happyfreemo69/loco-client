#!/usr/bin/node
var api = require('../apicli');

var optimist = require('yargs').usage(
    `$0 -l locale
    `).options('l', {
        alias : 'locale',
        describe: 'for the given locale'
    })
    .demand('l');
var argv = optimist.argv;
if(argv.help){
    optimist.showHelp()
    process.exit(0);
}
if(!process.env.LOCO_APIKEY){
    throw 'missing export LOCO_APIKEY=something';
}
const cred = {loco_apiKey: process.env.LOCO_APIKEY};
return api.getExport(cred, argv.locale).then(x=>{
    console.log(JSON.stringify(x,null,1));
})
