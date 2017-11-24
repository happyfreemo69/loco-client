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
exports.getAsset = function(o, id){
    return _get(o, '/api/assets/'+id);
}
exports.getLocales = function(o){
    return _get(o, '/api/locales');
}

exports.getExport = function(o, locale){
    return _get(o, '/api/export/locale/'+locale+'.json?format=i18next');
}
