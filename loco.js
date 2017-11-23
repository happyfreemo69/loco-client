#!/usr/local/bin/node
var https = require('https');

var exports = module.exports;
function _get(o,url){
    var P = exports.Promise || Promise;
    return new P(function(resolve, reject){
        var data = JSON.stringify({
            validated: true
        });

        var path = url + (url.includes('?')?'&':'?')+'key='+o.loco_apiKey;
        var req = https.request({
            method:'GET',
            path:path,
            hostname:'localise.biz',
        }, function(res){
            var s = '';
            res.on('data', function(chunk){
                if(res.statusCode != 200){
                    return reject('failed to get'+chunk.toString());
                }
                return s+=chunk.toString();
            });
            res.on('end', function(){
                try{
                    var d = JSON.parse(s);
                    return resolve(d)
                }catch(e){
                    return reject(e);
                }
            })
        });
        req.on('error', function(err){
            return reject('failed to get'+chunk.toString());
        });
        req.end();
    });
}

exports.getTranslation = function(o, id, locale){
    return _get(o, '/api/translations/'+id+'/'+locale);
}

exports.getLocales = function(o){
    return _get(o, '/api/locales');
}

exports.getExport = function(o, locale){
    return _get(o, '/api/export/locale/'+locale+'.json?format=i18next');
}

if(!module.parent){
    var optimist = require('optimist')
        .usage(
`translating: 
    
    node loco.js -t idToTranslate -l fr

exporting:
    
    node loco.js -e -l fr

listing all locales:

    node loco.js --list-locales`)
        .options('t', {
            alias : 'translate',
            describe: 'translate the id'
        })
        .options('l', {
            alias : 'locale',
            describe: 'for the given locale'
        })
        .options('e', {
            alias : 'export',
            describe: 'or exports'
        })
        .options('a', {
            alias : 'list-locales',
            describe: 'list all existing locales'
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
    if(!argv.t && !argv.e && !argv.a){
        optimist.showHelp()
        process.exit(0);   
    }
    if(argv.t){
        if(!argv.l){
            throw 'expect locale';
        }
        return exports.getTranslation(cred, argv.t, argv.locale).then(x=>{
            console.log(JSON.stringify(x,null,1));
        })
    }
    if(argv.e){
        if(!argv.l){
            throw 'expect locale';
        }
        return exports.getExport(cred, argv.locale).then(x=>{
            console.log('x', x);
        })
    }
    return exports.getLocales(cred).then(x=>{
        console.log(JSON.stringify(x,null,1))
    })
}