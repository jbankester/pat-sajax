# Pat Sajax


A Simple Promise based AJAX library of questionable utility.

# Install

`npm install pat-sajax`

# Usage

```javascript
import patSajax from 'pat-sajax';

let ps = new patSajax();

ps.get('https://contrived.com/example')
.then((result) => {
    console.log('hooray',result);
})
.catch((err) => {
    console.error('boooo',err);
});
```

## The `options` object
The options object is mostly optional. Only the `method` property is required unless using
one of the .get, .push, .put, or .del convenience methods.
```javascript
let options = {
    responseType: 'string',
    method: 'string', //GET,POST,PUT,DELETE
    body: 'object/string',
    basicAuth: 'object',//See description below in setDefaultHeaders()
    user: 'string',
    password: 'string',
    headers: 'array[object]'
}
```
`headers` in the options object is expected to be an array of objects like so:
```javascript
let headers = [
    {"Content-Type":"application/json"},
    {"Special-Snowflake":"i-demand-special-treatment"}
];
```

## Response object
All methods with the exception of .getJSON() will resolve or reject a Promise with this response object
```javascript
{
    status: 'http status code', //200,401,etc
    statusText: 'status text',
    response: 'string' //only included for resolved promises
}
```

# Methods
    
## .send(url,options)
Does what it sounds like. You'll need to set the method in the options object for this one.

## .get(url,options)
Sends a GET request.

## .post(url,data,options)
Sends a POST request.

## .del(url,options)
Sends a DELETE request.

## .put(url,options)
Sends a PUT request.

## .getJSON(url,options)
Sends a GET request and tries to turn the response into an object. Returns slightly different response object:
```javascript
{
   status: 'http status code',
   statusText: 'status text',
   response: 'object',
   originalResponse: 'original response before conversion' 
}
```
## .setDefaultHeaders(headers,[basicAuth])
* Set default headers for all requests. Accepts array of objects.
```javascript
[
    {"Content-Type" : "JSON"},
    {"Accept-Language" : "en-US"}    
]
``` 
* Optional `basicAuth` object sets `Authorization` header with base64 encoded credentials
```javascript
    var basicAuth = {
      username: 'Vanna',
      password: 'BuyAVowel'
    };
``` 

## .spinTheWheel(timeout,[succeed],[payload])
Simulates a request with a given `timeout`. Returns a Promise.
Optional boolean `succeed` determines if Promise is resolved or rejected. 
Optional `payload` will be returned when the Promise is resolved or rejected.

```javascript
import patSajax from 'pat-sajax';

let contestant = new patSajax();

contestant.spinTheWheel(5000,false)
    .then((res) => {
        console.log(res); //TRIP TO MEXICO!
    })
    .catch((err) => {
        //this gets hit here because we passed false for the second parameter
        console.error(err); //BANKRUPT
    });

```

Brand New Car and Trip To Mexico not included.

# License

MIT