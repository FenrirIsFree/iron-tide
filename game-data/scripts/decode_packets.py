#!/usr/bin/env python3
"""Decode WoSB network packets using the XOR cipher from Reskana_7_0.dll"""
import struct
from scapy.all import rdpcap, TCP, IP, Raw

def xor_transform64(data, seed):
    """Python implementation of Protocol.XorTransform64"""
    result = bytearray(len(data))
    num = seed & 0xFFFFFFFF
    
    num_blocks = len(data) // 8
    remainder = len(data) % 8
    
    for i in range(num_blocks):
        num = (num * 1664525 + 1013904223) & 0xFFFFFFFF
        xor_hi = num << 32
        num = (num * 1664525 + 1013904223) & 0xFFFFFFFF
        xor_val = xor_hi | num
        
        offset = i * 8
        original = struct.unpack_from('<Q', data, offset)[0]
        decrypted = original ^ xor_val
        struct.pack_into('<Q', result, offset, decrypted)
    
    if remainder > 0:
        base_offset = num_blocks * 8
        for j in range(remainder):
            num = (num * 1664525 + 1013904223) & 0xFFFFFFFF
            xor_byte = (num >> 24) & 0xFF
            result[base_offset + j] = data[base_offset + j] ^ xor_byte
    
    return bytes(result)

def decode_payload(encrypted_data, hash_key):
    """Decode a packet payload using the hash as XOR seed"""
    return xor_transform64(encrypted_data, hash_key)

# Parse the pcap
packets = rdpcap('/tmp/wosb/Fight_1.pcapng')
game_server_ip = "170.23.68.102"
game_port = 23771

# Reassemble TCP stream from server
server_stream = bytearray()
for pkt in packets:
    if TCP in pkt and Raw in pkt and IP in pkt:
        if pkt[IP].src == game_server_ip and pkt[TCP].sport == game_port:
            server_stream.extend(bytes(pkt[Raw].load))

print(f"Server stream: {len(server_stream)} bytes")

# Parse packets with the 5-byte header: [totalLength:2][hash:2][control:1][payload]
pos = 0
decoded_packets = []
errors = 0

while pos + 5 <= len(server_stream):
    total_length = struct.unpack_from('<H', server_stream, pos)[0]
    
    if total_length < 5 or total_length > 10000:
        pos += 1
        errors += 1
        if errors > 100:
            break
        continue
    
    if pos + total_length > len(server_stream):
        break
    
    hash_val = struct.unpack_from('<H', server_stream, pos + 2)[0]
    control = server_stream[pos + 4]
    
    payload_len = total_length - 5
    encrypted_payload = bytes(server_stream[pos + 5:pos + 5 + payload_len])
    
    if payload_len > 0:
        decrypted = decode_payload(encrypted_payload, hash_val)
        decoded_packets.append({
            'offset': pos,
            'total_length': total_length,
            'hash': hash_val,
            'control': control,
            'payload': decrypted,
            'payload_len': payload_len
        })
    
    pos += total_length
    errors = 0

print(f"Decoded {len(decoded_packets)} packets")

# Analyze the decrypted payloads
print(f"\n=== First 20 decoded packets ===")
for i, pkt in enumerate(decoded_packets[:20]):
    payload = pkt['payload']
    # Check if decryption looks valid (should have structure, null bytes, readable data)
    null_pct = payload.count(0) / max(len(payload), 1) * 100
    ascii_chars = sum(1 for b in payload if 32 <= b < 127)
    ascii_pct = ascii_chars / max(len(payload), 1) * 100
    
    hex_preview = payload[:24].hex()
    print(f"  #{i}: len={pkt['payload_len']}, ctrl={pkt['control']}, hash={pkt['hash']:#06x}, "
          f"nulls={null_pct:.0f}%, ascii={ascii_pct:.0f}% | {hex_preview}")

# Check overall entropy of decrypted data
import math
all_decrypted = b''.join(p['payload'] for p in decoded_packets)
freq = {}
for b in all_decrypted:
    freq[b] = freq.get(b, 0) + 1
ent = -sum((c/len(all_decrypted)) * math.log2(c/len(all_decrypted)) for c in freq.values())
null_total = all_decrypted.count(0)
print(f"\n=== Decryption quality check ===")
print(f"Total decrypted data: {len(all_decrypted)} bytes")
print(f"Entropy: {ent:.2f} bits/byte (should be <7.0 if decryption worked)")
print(f"Null bytes: {null_total} ({null_total/len(all_decrypted)*100:.1f}%)")

# Look for readable strings
import re
strings = re.findall(rb'[\x20-\x7e]{5,}', all_decrypted)
if strings:
    print(f"Readable strings found: {len(strings)}")
    for s in strings[:20]:
        print(f"  '{s.decode('ascii', errors='ignore')}'")
