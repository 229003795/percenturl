(function(scope){
'use strict';
function base32(bytes,padded=true){
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';let bits=0,value=0,out='';
 for(const byte of bytes){value=(value<<8)|byte;bits+=8;while(bits>=5){bits-=5;out+=alphabet[(value>>>bits)&31];}value&=(1<<bits)-1;}
 if(bits)out+=alphabet[(value<<(5-bits))&31];
 if(padded)while(out.length%8)out+='=';return out;
}
function run(text,padded){if(text.length>20000)throw new Error('Use at most 20,000 UTF-16 code units.');const bytes=new TextEncoder().encode(text);const encoded=base32(bytes,padded);return {bytes:bytes.length,encoded,component:encodeURIComponent(encoded),query:new URLSearchParams({token:encoded}).toString()};}
if(typeof module!=='undefined')module.exports={base32,run};
if(typeof document!=='undefined'){
 const input=document.getElementById('b32-input'),padding=document.getElementById('b32-padding');
 function update(){try{const r=run(input.value,padding.checked);document.getElementById('b32-output').value=r.encoded;document.getElementById('b32-component').value=r.component;document.getElementById('b32-query').value=r.query;document.getElementById('b32-status').textContent=r.bytes+' UTF-8 bytes; '+r.encoded.length+' Base32 characters.';}catch(e){for(const id of ['b32-output','b32-component','b32-query'])document.getElementById(id).value='';document.getElementById('b32-status').textContent=e.message;}}
 input.addEventListener('input',update);padding.addEventListener('change',update);update();
}
})(globalThis);
