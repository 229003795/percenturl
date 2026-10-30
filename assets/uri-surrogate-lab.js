(function(root){
function inspect(s){
 const invalid=[];
 for(let i=0;i<s.length;i++){let n=s.charCodeAt(i);if(n>=0xD800&&n<=0xDBFF){let m=s.charCodeAt(i+1);if(m>=0xDC00&&m<=0xDFFF)i++;else invalid.push(i);}else if(n>=0xDC00&&n<=0xDFFF)invalid.push(i);}
 let direct;try{direct=encodeURIComponent(s);}catch(e){direct=e.name;}
 return {units:Array.from({length:s.length},(_,i)=>s.charCodeAt(i).toString(16).padStart(4,'0')).join(' '),invalid,direct,repaired:encodeURIComponent(s.toWellFormed()),form:new URLSearchParams({q:s}).toString()};
}
if(typeof module!=='undefined')module.exports={inspect};else root.SurrogateLab={inspect};
})(globalThis);
