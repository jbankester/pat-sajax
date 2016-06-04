//This is mostly a joke because I liked the name.
//I'm pretty sure I missed some stuff too. 
'use strict';
import stringView from './mdn-stringView.js';

export default function patSajax() {
    
    let _defaultHeaders = [];
    
    function buildAuthHeader(user,pass){
            let authHeader = '';
             /* btoa() only works in IE >= 10
            *  and shits the bed with unicode strings
            *  so I'm using the MDN StringView lib to do the encoding.
            */
            try{
                let sv = new stringView(user + ':' + pass);
                let b64string = sv.toBase64(); 
                authHeader = {'Authorization':'Basic ' + b64string};
            }catch(ex){
                throw ex;
            }
            return authHeader;
    }
    
    function buildHeaderArray(headers,basicAuth,user,pass) { 
        let newHeaders = headers.concat(_defaultHeaders);
         
        if(basicAuth){
            let auth = buildAuthHeader(basicAuth.username,basicAuth.password);

            //remove default auth header from request because we have a different one
            for(let i = 0; i < newHeaders.length; i++){
                if(newHeaders[i].Authorization){
                    newHeaders.splice(i,1); 
                }
            }
            newHeaders.push(auth);
        }else if(user && pass){
            newHeaders.push({'username': user});
            newHeaders.push({'password': pass});
        }   
        return newHeaders;
    }
    
    return {
        setDefaultHeaders:  function (headers = [],basicAuth) {
                if(!Array.isArray(headers)){
                     console.error('Unexpected data type for headers');
                     return false;
                }
                if(!basicAuth){
                     _defaultHeaders = headers;
                }else{
                    if(!basicAuth.username || !basicAuth.password){
                        console.error('Invalid basicAuth object passed to setDefaultHeaders()');
                        _defaultHeaders = headers;
                        return;
                    }
                  
                    let ah = buildAuthHeader(basicAuth.username,basicAuth.password);
                    _defaultHeaders.push(ah);
                }
        },
        send: function (url,settings) {
            let abort = false; //if something is wrong just reject the promise as soon as its created.
            let responseType = settings.responseType || '',
                method = settings.method || 'GET',
                body = settings.body || undefined,
                basicAuth = settings.basicAuth || undefined,
                user = settings.user || undefined,
                password = settings.password || undefined,
                headers = settings.headers || []
                
            if(!Array.isArray(headers)){
                console.error('Expected array in options.headers. Received ' + typeof headers);
                abort = true;
            }     
            if(body && typeof body !== 'string'){
                //XMLHttpRequest needs a string to send so lets give it one
                body = JSON.stringify(body);
            }
           
            let reqHeaderArray = buildHeaderArray(headers,basicAuth,user,password);
               
            //harass anyone not using https because DON'T DO THAT FFS
            if(basicAuth){
                let reg = /^https:/;
                if(!reg.test(url)){
                    console.warn('Are you sending credentials over http? That\'s a terrible idea.');
                }
            }
            let promise = new Promise((resolve,reject) => {
                if(abort){
                    reject({
                        status: 400, //or something else?
                        statusText: 'Error creating request. Check options object.'
                    });
                }
                let req = new XMLHttpRequest();
                req.responseType = responseType;
                
                req.open(method,url,true);
                
                reqHeaderArray.forEach((obj) => {
                    let key = Object.keys(obj)[0];
                    req.setRequestHeader(key,obj[key]);
                });
                
                if(body){              
                    req.send(body);
                }else{
                    req.send();
                }
               
                req.onload = function () {
                    resolve({
                        status: this.status,
                        statusText: this.statusText,
                        response: this.response
                    });
                };
                
                req.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: this.statusText
                    });
                };
                
            });
            return promise;
        },
        //these are just shortcuts - nothing special
        get: function (url,settings = {}) {
            settings.method = 'GET';
            return this.send(url,settings);
        },
        post: function (url,data,settings = {}) {
            settings.method = 'POST';
            settings.body = data;
            return this.send(url,settings);
        },
        del: function (url,settings = {}) {
            settings.method = 'DELETE';
            return this.send(url,settings);
        },
        put: function (url,settings = {}) {
            settings.method = 'PUT';
            return this.send(url,settings);
        },
        getJSON: function (url,settings = {}) {
             
            settings.method = 'GET';
            return new Promise((resolve,reject)=>{
               this.send(url,settings)
               .then((sendResult)=>{
                   
                   let resp = {
                       status: sendResult.status,
                       statusText: sendResult.statusText,
                       response: undefined,
                       originalResponse: sendResult.response
                   }
                   if(!typeof sendResult.response === 'string'){
                       console.error('Cannot parse. Expected string, received ' + typeof sendResult.response);
                       reject(resp)
                   }
                   resp.response = JSON.parse(sendResult.response);
                   resolve(resp);
               })
               .catch((err)=>{
                   reject(err);
               }); 
            }); 
        },
        spinTheWheel: function (timeout,succeed = true,payload = ''){
            if(!timeout || typeof timeout !== 'number'){
                throw 'Invalid parameter: timeout. Expected number, received ' + typeof timeout;
            }
            if(payload === ''){
                payload = succeed?'A BRAND NEW CAR':'BANKRUPT';
            }
            return new Promise((resolve,reject) => {
                if(succeed){
                  setTimeout(resolve(payload),timeout);  
                }else{
                  setTimeout(reject(payload),timeout);
                }
                
            });
        }
    }
};