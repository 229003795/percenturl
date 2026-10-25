(function(root){
  'use strict';
  function decode(input, variant='standard') {
    if(input.length>1000000) throw Error('Input limit: 1,000,000 characters.');
    const alphabet=variant==='hex'?'0123456789ABCDEFGHIJKLMNOPQRSTUV':'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const s=input.toUpperCase();
    if(/\s/.test(s)) throw Error('Remove whitespace before decoding.');
    const match=s.match(/^([^=]*)(=*)$/);
    if(!match) throw Error('Padding must appear only at the end.');
    const body=match[1], pads=match[2].length, rem=body.length%8;
    if(![0,2,4,5,7].includes(rem)) throw Error('Invalid Base32 length.');
    const expected=(8-rem)%8;
    if(pads && (pads!==expected || s.length%8!==0)) throw Error('Incorrect padding length.');
    let acc=0,bits=0;const bytes=[];
    for(const c of body){
      const n=alphabet.indexOf(c);
      if(n<0) throw Error('Character outside the selected Base32 alphabet: '+c);
      acc=(acc<<5)|n;bits+=5;
      if(bits>=8){bits-=8;bytes.push((acc>>bits)&255);acc &= (1<<bits)-1;}
    }
    if(acc!==0) throw Error('Non-zero trailing pad bits (rejected by this tool).');
    return Uint8Array.from(bytes);
  }
  if(typeof module!=='undefined') module.exports={decode};
  root.PercentBase32={decode};
  if(typeof document==='undefined')return;
  const el=id=>document.getElementById(id);let bytes=null,text=null;
  function update(){
    bytes=null;text=null;el('b32-out').value='';el('b32-hex').value='';
    el('b32-download').disabled=true;el('b32-copy').disabled=true;
    try{
      bytes=decode(el('b32-in').value,el('b32-alphabet').value);
      el('b32-hex').value=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(' ');
      el('b32-status').textContent=bytes.length+' decoded bytes. Lowercase and unpadded input are accepted by this tool.';
      el('b32-download').disabled=false;
      try{text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);el('b32-out').value=text;el('b32-copy').disabled=false;}
      catch(e){el('b32-status').textContent+=' Not valid UTF-8: use hex or download the original bytes.';}
    }catch(e){el('b32-status').textContent=e.message;}
  }
  el('b32-in').addEventListener('input',update);el('b32-alphabet').addEventListener('change',update);
  el('b32-example').addEventListener('click',()=>{el('b32-in').value=el('b32-alphabet').value==='hex'?'CPNMU===':'MZXW6===';update();});
  el('b32-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);el('b32-status').textContent='Decoded text copied.';}catch(e){el('b32-status').textContent='Copy unavailable. Select the decoded text and copy manually.';}});
  el('b32-download').addEventListener('click',()=>{if(!bytes)return;const u=URL.createObjectURL(new Blob([bytes],{type:'application/octet-stream'}));const a=document.createElement('a');a.href=u;a.download='base32-decoded.bin';a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);});
})(typeof globalThis!=='undefined'?globalThis:this);
