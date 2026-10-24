// Synthetic private account_id claims; no real credentials or JWT validation.
const assert = require('node:assert/strict');
const raws = ["{\"account_id\":9007199254740991}", "{\"account_id\":9007199254740992}", "{\"account_id\":9007199254740993}", "{\"account_id\":9007199254740994}", "{\"account_id\":\"9007199254740993\"}", "{\"account_id\":-9007199254740993}", "{\"account_id\":2000000000}"];
const expected = ["9007199254740991", "9007199254740992", "9007199254740992", "9007199254740994", "9007199254740993", "-9007199254740992", "2000000000"];
for (const [i, raw] of raws.entries()) {
  const segment = Buffer.from(raw, 'utf8').toString('base64url');
  const recovered = Buffer.from(segment, 'base64url').toString('utf8');
  assert.equal(recovered, raw);
  const value = JSON.parse(recovered).account_id;
  assert.equal(String(value), expected[i]);
  console.log(JSON.stringify({raw, parsed: String(value), type: typeof value,
    safeInteger: typeof value === 'number' ? Number.isSafeInteger(value) : null,
    roundTrip: JSON.stringify({account_id: value})}));
}
assert.equal(JSON.parse(raws[1]).account_id, JSON.parse(raws[2]).account_id);
assert.equal(BigInt(JSON.parse(raws[2]).account_id).toString(), '9007199254740992');
assert.equal(BigInt(JSON.parse(raws[4]).account_id).toString(), '9007199254740993');
console.log('PASS: 7 raw-text round trips and parsed results; collision and late-BigInt checks match.');
