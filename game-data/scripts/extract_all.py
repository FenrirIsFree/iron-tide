#!/usr/bin/env python3
"""Extract JSON from all XNB files in the WoSB data archive."""
import json
import os
import sys

def extract_json_from_xnb(filepath):
    """Extract JSON payload from an XNB file."""
    with open(filepath, 'rb') as f:
        data = f.read()
    for i, b in enumerate(data):
        if b in (0x5b, 0x7b):  # [ or {
            text = data[i:].decode('utf-8', errors='ignore').rstrip('\x00').rstrip()
            try:
                return json.loads(text)
            except json.JSONDecodeError:
                return None
    return None

def parse_localization(filepath):
    """Parse space-separated localization file."""
    loc = {}
    with open(filepath, 'r', errors='ignore') as f:
        for line in f:
            line = line.strip()
            idx = line.find(' ')
            if idx > 0:
                loc[line[:idx]] = line[idx+1:]
    return loc

def main():
    extracted_dir = '/tmp/wosb/extracted'
    output_dir = '/tmp/wosb/json'
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract JSON from all top-level XNB files
    xnb_files = []
    for f in sorted(os.listdir(extracted_dir)):
        if f.endswith('.xnb'):
            xnb_files.append(f)
    
    print(f"Found {len(xnb_files)} XNB files")
    
    results = {}
    for f in xnb_files:
        filepath = os.path.join(extracted_dir, f)
        data = extract_json_from_xnb(filepath)
        name = f.replace('.xnb', '')
        if data is not None:
            output_path = os.path.join(output_dir, f'{name}.json')
            with open(output_path, 'w') as out:
                json.dump(data, out, indent=2)
            count = len(data) if isinstance(data, list) else 1
            results[name] = count
            print(f"  ✅ {name}: {count} entries")
        else:
            print(f"  ⏭️  {name}: binary asset (no JSON)")
    
    # Parse localization
    loc_path = '/tmp/wosb/local_en.fx'
    if os.path.exists(loc_path):
        loc = parse_localization(loc_path)
        loc_output = os.path.join(output_dir, 'localization_en.json')
        with open(loc_output, 'w') as out:
            json.dump(loc, out, indent=2)
        print(f"\n  ✅ Localization: {len(loc)} entries")
    
    # Summary
    print(f"\n{'='*50}")
    print(f"Extracted {len(results)} data files to {output_dir}")
    print(f"Total entries: {sum(results.values())}")
    
    # Save manifest
    manifest_path = os.path.join(output_dir, '_manifest.json')
    with open(manifest_path, 'w') as out:
        json.dump(results, out, indent=2)

if __name__ == '__main__':
    main()
