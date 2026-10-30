const assert=require('node:assert/strict');
const {inspect}=require('../assets/uri-surrogate-lab.js');
const fixtures=[['plain','A','A',[]],['pair','\uD83D\uDE00','%F0%9F%98%80',[]],['high','\uD800','URIError',[0]],['low','\uDC00','URIError',[0]],['reversed','\uDC00\uD800','URIError',[0,1]],['slice-half','\uD83D\uDE00'.slice(0,1),'URIError',[0]],['replacement','\uFFFD','%EF%BF%BD',[]],['inside','A\uD800B','URIError',[1]],['two-high','\uD800\uD800','URIError',[0,1]]];
const rows=fixtures.map(([name,s,direct,invalid])=>{const r=inspect(s);assert.equal(r.direct,direct);assert.deepEqual(r.invalid,invalid);assert.equal(decodeURIComponent(r.repaired),s.toWellFormed());return {name,...r};});
assert.equal(rows[2].repaired,rows[6].repaired);
assert.equal(rows[2].form,rows[6].form);
console.log(JSON.stringify({runDate:'2026-10-30',node:process.version,rows},null,2));
