const assert=require('node:assert/strict');
const {decode}=require('./base32-decoder.js');
const fixtures=[["MY======", "66"], ["MZXQ====", "666f"], ["MZXW6===", "666f6f"], ["MZXW6YQ=", "666f6f62"], ["MZXW6YTB", "666f6f6261"], ["MZXW6YTBOI======", "666f6f626172"], ["mzxw6", "666f6f"], ["74======", "ff"], ["MZ======", null], ["A", null], ["MZXW6==", null], ["MZX W6===", null], ["M0======", null]];
for(const [input,hex]of fixtures){if(hex===null)assert.throws(()=>decode(input));else assert.equal(Buffer.from(decode(input)).toString('hex'),hex);}
assert.equal(Buffer.from(decode('CPNMU===','hex')).toString(),'foo');
console.log('13 fixtures passed; Base32hex foo passed');
