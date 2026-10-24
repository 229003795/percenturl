/* Local Base64 decoding policy; shared by the page and its regression checks. */
(function(root){
  'use strict';
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function decode(raw){
    let text=String(raw).replace(/[\t\n\f\r ]/g,'').replace(/-/g,'+').replace(/_/g,'/');
    if(!text) return {bytes:new Uint8Array(),nonCanonical:false};
    if(!/^[A-Za-z0-9+/]*={0,2}$/.test(text)) throw new Error('Invalid Base64 character or misplaced padding. Percent-decode URL escapes separately first.');
    const body=text.replace(/=+$/,''), padding=text.length-body.length, remainder=body.length%4;
    if(remainder===1 || (padding && (text.length%4!==0 || padding!==(4-remainder)%4))) throw new Error('Invalid Base64 length or padding. Check for a missing or extra character.');
    const bytes=[];
    let bits=0,value=0;
    for(const ch of body){value=(value<<6)|alphabet.indexOf(ch);bits+=6;if(bits>=8){bits-=8;bytes.push((value>>>bits)&255);}}
    return {bytes:new Uint8Array(bytes),nonCanonical:bits>0 && (value&((1<<bits)-1))!==0};
  }
  const api={decode};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  else root.Base64Decoder=api;
})(globalThis);
