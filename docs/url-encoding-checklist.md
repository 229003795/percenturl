# URL encoding checklist

Things that break URLs in production, in the order they usually bite.

1. **Space: `%20` or `+`?** `%20` is correct in a path and in a query string. `+` only means
   space in `application/x-www-form-urlencoded` bodies. Pick one per context and be consistent.
2. **Reserved characters in a value.** `&`, `=`, `?`, `#`, `/` inside a value must be escaped,
   otherwise they change the shape of the URL rather than travel as data.
3. **`!*'()` are the five that differ.** RFC 3986 escapes them; `encodeURIComponent()` does not.
   See [encodeuricomponent-vs-rfc3986.md](encodeuricomponent-vs-rfc3986.md).
4. **Non-ASCII must be UTF-8 first.** Percent-encoding operates on bytes, not characters.
   Encode to UTF-8, then escape each byte. `中` is three bytes (`E4 B8 AD`), so it becomes `%E4%B8%AD`.
5. **Do not double-encode.** If a value is already `%20`, encoding again yields `%2520`.
   Decode before you re-encode, and only encode each value once.
6. **Encode per component, never the whole URL.** Encoding `https://` gives `https%3A%2F%2F`.
   Build the URL from parts, encode each part, then join.
7. **`+` in a path is a literal plus.** It is only a space in form-encoded query bodies.
8. **Round-trip test your own values.** Encode, decode, compare to the original string.
   Any mismatch is a bug worth finding before your users do.
