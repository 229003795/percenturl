const fs=require('node:fs');
const assert=require('node:assert/strict');
const fixtures=JSON.parse(fs.readFileSync(__dirname+'/valid-url-fixtures.json','utf8'));
const rows=fixtures.map(f=>{let valid=false,issue=null;try{if(/%(?![0-9A-Fa-f]{2})/.test(f.input)) throw new Error('incomplete percent escape'); if(/[\u0000-\u0020]/.test(f.input)) throw new Error('raw whitespace/control'); new URL(f.input); valid=true}catch(e){issue=e.message}return {...f,observed:valid,issue}});
assert.deepEqual(rows.map(r=>r.observed),fixtures.map(f=>f.valid));
console.log(JSON.stringify({node:process.version,fixtures:rows},null,2));
