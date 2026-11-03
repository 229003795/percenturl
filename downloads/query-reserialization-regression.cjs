const assert=require('node:assert/strict');
const fixtures=require('./query-reserialization-fixtures.json');
for(const input of fixtures){const u=new URL(input);const values=[...u.searchParams];u.searchParams.sort();assert.deepEqual([...u.searchParams].sort(),values.sort(),`decoded key/value multiset changed: ${input}`);assert.equal(u.searchParams.toString(),u.search.slice(1),`serialization mismatch: ${input}`);if(input.includes('q=a%20b~'))assert.equal(u.search,'?q=a+b%7E');if(input.includes('flag'))assert.equal(u.search,'?flag=');}
console.log(`PASS ${fixtures.length} fixtures; decoded pairs preserved after URLSearchParams.sort(); ${process.version}`);
