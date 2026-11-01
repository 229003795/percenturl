(function(root){
'use strict';
function validate(pairs){if(!Array.isArray(pairs)||pairs.length>1000)throw new Error('Supply an array of at most 1,000 string pairs.');for(const pair of pairs){if(!Array.isArray(pair)||pair.length!==2||pair.some(v=>typeof v!=='string'))throw new Error('Each entry must contain exactly two strings.');if(pair.some(v=>!v.isWellFormed()))throw new Error('Lone surrogate rejected: this checker keeps well-formed input only.');}return pairs;}
function inspect(pairs){validate(pairs);const params=new URLSearchParams(pairs),object=Object.fromEntries(params),viaSet=new URLSearchParams();for(const [key,value] of pairs)viaSet.set(key,value);return {encoded:params.toString(),roundTripPairs:Array.from(new URLSearchParams(params.toString())),readings:Array.from(new Set(pairs.map(p=>p[0])),key=>({key,first:params.get(key),all:params.getAll(key),objectValue:object[key],count:params.getAll(key).length})),viaSet:viaSet.toString(),viaObject:new URLSearchParams(object).toString()};}
const api={inspect};if(typeof module!=='undefined')module.exports=api;else root.QueryPairsLab=api;
})(globalThis);
