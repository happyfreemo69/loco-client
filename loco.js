#!/usr/local/bin/node
var https = require('https');
var querystring = require('querystring');
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

function _post(o,url, body){
    var P = exports.Promise || Promise;
    return new P(function(resolve, reject){
        var path = url + (url.includes('?')?'&':'?')+'key='+o.loco_apiKey;
        var post_data = querystring.stringify(body);
        var req = https.request({
            method:'POST',
            path:path,
            hostname:'localise.biz',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        }, function(res){
            var s = '';
            res.on('data', function(chunk){
                if(res.statusCode != 200 && res.statusCode !=201){
                    return reject('failed to get'+res.statusCode+' '+chunk.toString());
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
        req.write(post_data);
        req.end();
    });
}


exports.getTranslation = function(o, id, locale){
    return _get(o, '/api/translations/'+id+'/'+locale);
}

/**
 * [createTranslation description]
 * @param  {[type]} o    [description]
 * @param  {{id, name}} body [description]
 * @return {[type]}      [description]
 */
exports.createTranslation = function(o, body, locale){
    return _post(o, '/api/translations/'+body.id+'/'+locale, {name:body.name});
}

/**
 * [createAsset description]
 * @param  {[type]} o    [description]
 * @param  {{id, name}} body name for the default source language
 * @return {[type]}      [description]
 */
exports.createAsset = function(o, body){
    return _post(o, '/api/assets', body);
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
translate:
    node loco.js -t idToTranslate -l fr

create asset:
    node loco.js -c -b id

create translation for asset
    node loco.js -c -t idToTranslate -l fr -b data

exporting:
    
    node loco.js -e -l fr

listing all locales:

    node loco.js --list-locales`)
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
        .options('e', {
            alias : 'export',
            describe: 'or exports'
        })
        .options('a', {
            alias : 'list-locales',
            describe: 'list all existing locales'
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
    if(!argv.t && !argv.e && !argv.a && !argv.c){
        optimist.showHelp()
        process.exit(0);   
    }

    if(argv.c){
        if(argv.t){
            if(!argv.locale){
                throw 'expect locale';
            }
            if(!argv.body){
                throw 'expect body';
            }
            return exports.createTranslation(cred, {id:argv.t, name:argv.body}, argv.locale).then(x=>{
                console.log(JSON.stringify(x,null,1));
            })
        }

        return exports.createAsset(cred, {id:argv.body, name:argv.body}).then(x=>{
            console.log(JSON.stringify(x,null,1));
        })
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