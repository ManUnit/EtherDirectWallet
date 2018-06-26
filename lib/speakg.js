//npm install --save speakeasy
var speakeasy = require('speakeasy');
var secret = speakeasy.generateSecret({length: 20});
console.log(secret.base32); 