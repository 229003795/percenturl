const assert=require('node:assert/strict');
const {compare}=require('../assets/url-unicode-normalization.js');
const fixtures=require('./url-unicode-normalization-fixtures.json');
const rows=fixtures.map(f=>{const r=compare(f.a,f.b);assert.equal(r.equal.raw,false);assert.equal(r.equal.NFC,f.nfcEqual);assert.equal(r.equal.NFKC,f.nfkcEqual);for(const [s,d] of [[f.a,r.left],[f.b,r.right]])for(const form of ['raw','NFC','NFKC'])assert.equal(decodeURIComponent(d[form]),form==='raw'?s:s.normalize(form));return {name:f.name,...r};});
assert.throws(()=>compare('\uD800','a'),/Lone surrogate/);
console.log(JSON.stringify({date:'2026-10-31',node:process.version,unicode:process.versions.unicode,rows},null,2));
