#!/usr/bin/env python3
"""Synthetic JWT parser fixtures. Python 3; standard library only.
Public test key; never use it for production. No JWT acceptance decision.
"""
import base64
import hashlib
import hmac
import json

FIXTURES = [{'case': 'unique', 'raw': '{"sub":"alpha","exp":2000000000}', 'default': {'sub': 'alpha', 'exp': 2000000000}, 'strict': 'accepted by this duplicate-key check', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbHBoYSIsImV4cCI6MjAwMDAwMDAwMH0.bcSh9P_H2fK_QElnPCYcnU8_19u3HLhSwIIeC9KayDw'}, {'case': 'repeated subject', 'raw': '{"sub":"alpha","sub":"beta"}', 'default': {'sub': 'beta'}, 'strict': 'duplicate key: sub', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbHBoYSIsInN1YiI6ImJldGEifQ.xyCaftEYiBvo_Bh1xvzCrpBvSnDXfV983GZNHmnEa24'}, {'case': 'repeated expiry', 'raw': '{"exp":100,"exp":2000000000}', 'default': {'exp': 2000000000}, 'strict': 'duplicate key: exp', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEwMCwiZXhwIjoyMDAwMDAwMDAwfQ.qFYIa-xiLxCZ8cICbJnlb1JTarda9I7M1Zd28RDTsZY'}, {'case': 'escaped name', 'raw': '{"sub":"alpha","\\u0073ub":"beta"}', 'default': {'sub': 'beta'}, 'strict': 'duplicate key: sub', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbHBoYSIsIlx1MDA3M3ViIjoiYmV0YSJ9.i_i2ZUmdn4uzekqeSWFkjQnx5EZJwToZIxo3OX9Iguw'}, {'case': 'different case', 'raw': '{"sub":"alpha","SUB":"beta"}', 'default': {'sub': 'alpha', 'SUB': 'beta'}, 'strict': 'accepted by this duplicate-key check', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbHBoYSIsIlNVQiI6ImJldGEifQ.fVKHdNf5RfK_AE2JEowHTIdys6lKKKHqa2baw7oWv94'}, {'case': 'nested repeat', 'raw': '{"profile":{"label":"a","label":"b"}}', 'default': {'profile': {'label': 'b'}}, 'strict': 'duplicate key: label', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlIjp7ImxhYmVsIjoiYSIsImxhYmVsIjoiYiJ9fQ.wmqrr-xtB0e2tc2qX1q465qs5etZycAttO1gyVdln0Q'}, {'case': 'separate objects', 'raw': '{"left":{"label":"a"},"right":{"label":"b"}}', 'default': {'left': {'label': 'a'}, 'right': {'label': 'b'}}, 'strict': 'accepted by this duplicate-key check', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZWZ0Ijp7ImxhYmVsIjoiYSJ9LCJyaWdodCI6eyJsYWJlbCI6ImIifX0.kC_X41Auf6ima6ReH_vzkuf2GONCTtXTSsLqcREaaN0'}]

def reject_repeated_names(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate key: " + key)
        result[key] = value
    return result

def run():
    for row in FIXTURES:
        header, payload, signature = row["token"].split(".")
        raw = base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)).decode("utf-8")
        assert raw == row["raw"], "raw payload changed"
        mac = hmac.new(b"public-test-key-not-for-production", (header + "." + payload).encode("ascii"), hashlib.sha256).digest()
        encoded_mac = base64.urlsafe_b64encode(mac).decode("ascii").rstrip("=")
        assert hmac.compare_digest(encoded_mac, signature), "synthetic fixture HMAC mismatch"
        parsed = json.loads(raw)
        assert parsed == row["default"], "default parser mismatch"
        try:
            json.loads(raw, object_pairs_hook=reject_repeated_names)
            policy = "accepted by this duplicate-key check"
        except ValueError as error:
            policy = str(error)
        assert policy == row["strict"], "rejecting policy mismatch"
        print(row["case"])
        print("  raw: " + raw)
        print("  default: " + json.dumps(parsed, separators=(",", ":")))
        print("  policy: " + policy)
    print("PASS: 7 fixtures; raw payload, synthetic HMAC, default parse and duplicate policy match.")
    print("Fixture integrity only: issuer, audience, time and application authorization are not validated.")

if __name__ == "__main__":
    run()
