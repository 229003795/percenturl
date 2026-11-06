const fs=require('node:fs');const assert=require('node:assert/strict');
const f=JSON.parse(fs.readFileSync(__dirname+'/convert-url-fixtures.json','utf8'));
function convert(raw,mode){const u=new URL(raw);const t=mode==='encode'?x=>encodeURIComponent(decodeURIComponent(x)):decodeURIComponent;const path=u.pathname.split('/').map(x=>x?t(x):'').join('/');const p=[];for(const x of u.search.slice(1).split('&')){if(!x)continue;const i=x.indexOf('=');const k=i<0?x:x.slice(0,i),v=i<0?'':x.slice(i+1);p.push(t(k)+(i<0?'':'='+t(v)))}return u.protocol+'//'+u.host+path+(p.length?'?'+p.join('&'):'')+(u.hash?'#'+t(u.hash.slice(1)):'')}
for(const x of f)assert.equal(convert(x.input,x.mode),x.result);console.log(JSON.stringify({node:process.version,fixtures:f,status:'passed'},null,2));
