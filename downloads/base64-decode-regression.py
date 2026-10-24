"""Run: python base64-decode-regression.py path/to/base64-decoder-core.js
Requires Python 3 and Node.js; no packages or network requests.
"""
import base64
import hashlib
import json
import pathlib
import subprocess
import sys

CASES = ['Zg==', 'Zh==', 'Zg', 'SGVsbG8=', '/w==', 'SGVsbG8_', 'Z===', 'A', 'SG Vs\nbG8=']

def run(core):
    js = '''const core=require(process.argv[1]);const cases=JSON.parse(process.argv[2]);
console.log(JSON.stringify({node:process.version,rows:cases.map(input=>{
let page;try{const r=core.decode(input);page={hex:Buffer.from(r.bytes).toString('hex'),nonCanonical:r.nonCanonical};}catch(e){page={error:true};}
return {input,page,nodeHex:Buffer.from(input,'base64').toString('hex')};})}));'''
    result = json.loads(subprocess.check_output(['node', '-e', js, str(pathlib.Path(core).resolve()), json.dumps(CASES)], text=True))
    result['python'] = sys.version.split()[0]
    for row in result['rows']:
        try:
            row['pythonHex'] = base64.b64decode(row['input'], validate=True).hex()
        except (ValueError, base64.binascii.Error):
            row['pythonHex'] = 'REJECT'
        if 'hex' in row['page']:
            row['page']['sha256'] = hashlib.sha256(bytes.fromhex(row['page']['hex'])).hexdigest()
    return result

if __name__ == '__main__':
    core = sys.argv[1] if len(sys.argv)>1 else 'base64-decoder-core.js'
    print(json.dumps(run(core), indent=2))
