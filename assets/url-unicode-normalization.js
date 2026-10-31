(function(root){
function describe(s){if(typeof s!=='string')throw new Error('Both inputs must be JSON strings.');if(!s.isWellFormed())throw new Error('Lone surrogate: use the dedicated URIError checker; this comparison accepts well-formed text only.');return {codePoints:Array.from(s,c=>'U+'+c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')).join(' '),raw:encodeURIComponent(s),NFC:encodeURIComponent(s.normalize('NFC')),NFKC:encodeURIComponent(s.normalize('NFKC'))};}
function compare(a,b){const left=describe(a),right=describe(b);return {left,right,equal:{raw:left.raw===right.raw,NFC:left.NFC===right.NFC,NFKC:left.NFKC===right.NFKC}};}
if(typeof module!=='undefined')module.exports={compare};else root.URLUnicodeLab={compare};
})(globalThis);
