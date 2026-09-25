# percenturl-open

Reference data and a small command-line tool for percent-encoding (URL encoding).

Percent-encoding looks simple until it isn't: whether a space becomes `%20` or `+`,
whether `!*'()` get escaped, and how non-ASCII text is turned into bytes all depend on
which variant you are targeting. This repo pins those answers down with data you can check.

## What is in here

- `data/percent-encoding.csv` - every printable ASCII character (32-126) plus `é`, `中`, `😀`,
  with its UTF-8 bytes, its strict RFC 3986 encoding, and what JavaScript `encodeURIComponent()` returns.
- `docs/encodeuricomponent-vs-rfc3986.md` - the exact five characters where JavaScript and RFC 3986 disagree, and why.
- `docs/url-encoding-checklist.md` - failure modes worth checking before you ship a URL.
- `tools/urlcodec.py` - a dependency-free CLI that encodes and decodes in either variant.

If you just want to paste a string and see it encoded in a browser, the browser version of
this tool lives at https://percenturl.com.

## Verify the data yourself

```sh
python tools/urlcodec.py encode "a b&c=d" --mode rfc3986
python tools/urlcodec.py encode "a b&c=d" --mode component
python tools/urlcodec.py decode "a%20b%26c%3Dd"
```

The `encodeURIComponent` column in the CSV was produced by Node.js (V8); the RFC 3986 column
was computed in Python by UTF-8 encoding and escaping every byte outside the unreserved set
`A-Z a-z 0-9 - . _ ~`. Both are reproducible from the commands above.

## License

MIT
