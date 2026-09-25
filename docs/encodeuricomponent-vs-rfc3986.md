# encodeURIComponent vs RFC 3986 - where they differ

Both agree on letters, digits and `-._~`. They disagree on exactly these ASCII characters:

| char | name | RFC 3986 | encodeURIComponent |
|---|---|---|---|
| `!` | exclamation | `%21` | `!` |
| `*` | asterisk | `%2A` | `*` |
| `(` | left paren | `%28` | `(` |
| `)` | right paren | `%29` | `)` |
| `'` | apostrophe | `%27` | `'` |

## Why it matters

- RFC 3986 treats `!*'()` as reserved/sub-delims and percent-encodes them inside a component.
- `encodeURIComponent()` in JavaScript deliberately leaves them unescaped, because they are safe in a URI component.
- Both directions round-trip safely: every decoder accepts `%21`, `%2A`, `%28`, `%29`, `%27`.
- Only these five characters change representation; the character set is otherwise identical.

## How this table was produced (traceable)

- `encodeURIComponent` column: returned by Node.js v22 (V8) for codepoints 32-126 plus `é`, `中`, `😀`.
- `RFC 3986` column: computed in Python - UTF-8 encode, then percent-encode every byte outside unreserved `A-Z a-z 0-9 - . _ ~`.
- `differ = YES` marks rows where the two disagree.

Full per-character data is in [`../data/percent-encoding.csv`](../data/percent-encoding.csv).
