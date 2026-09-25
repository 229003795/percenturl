#!/usr/bin/env python3
"""urlcodec - percent-encode and decode text. RFC 3986 or encodeURIComponent style.

Usage:
  python urlcodec.py encode "a b&c=d" [--mode rfc3986|component] [--space percent|plus]
  python urlcodec.py decode "a%20b%26c%3Dd" [--space percent|plus]
"""
import argparse, sys

UNRESERVED = set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~")
JS_SAFE = set("!'()*")  # encodeURIComponent leaves these unescaped


def encode(s, mode="rfc3986", space="percent"):
    out = []
    for b in s.encode("utf-8"):
        c = chr(b)
        if c == " ":
            out.append("+" if space == "plus" else "%20")
        elif c in UNRESERVED:
            out.append(c)
        elif mode == "component" and c in JS_SAFE:
            out.append(c)
        else:
            out.append("%%%02X" % b)
    return "".join(out)


def decode(s, space="percent"):
    src = s.replace("+", " ") if space == "plus" else s
    buf, out, i = bytearray(), [], 0
    while i < len(src):
        ch = src[i]
        if ch == "%" and i + 2 < len(src) + 1:
            hexpart = src[i + 1:i + 3]
            if len(hexpart) == 2 and all(c in "0123456789abcdefABCDEF" for c in hexpart):
                buf.append(int(hexpart, 16))
                i += 3
                continue
        if buf:
            out.append(buf.decode("utf-8", "replace"))
            buf = bytearray()
        out.append(ch)
        i += 1
    if buf:
        out.append(buf.decode("utf-8", "replace"))
    return "".join(out)


def main():
    p = argparse.ArgumentParser(description="Percent-encode / decode text.")
    p.add_argument("action", choices=["encode", "decode"])
    p.add_argument("text", nargs="?", help="text to process (or read stdin)")
    p.add_argument("--mode", choices=["rfc3986", "component"], default="rfc3986")
    p.add_argument("--space", choices=["percent", "plus"], default="percent")
    a = p.parse_args()
    text = a.text if a.text is not None else sys.stdin.read().rstrip("\n")
    if a.action == "encode":
        print(encode(text, a.mode, a.space))
    else:
        print(decode(text, a.space))


if __name__ == "__main__":
    main()
