const fs=require('node:fs');
const assert=require('node:assert/strict');
const fixtures=JSON.parse(fs.readFileSync(__dirname+'/url-format-fixtures.json','utf8'));
const rows=fixtures.map(f=>{const u=new URL(f.input);const serialized=u.href;assert.equal(serialized,f.serialized);return {input:f.input,serialized,parts:{hostname:u.hostname,pathname:u.pathname,search:u.search}}});
console.log(JSON.stringify({node:process.version,fixtures:rows},null,2));
