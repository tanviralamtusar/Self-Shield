import json
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding='utf-8'))
analysis = json.loads(Path('graphify-out/.graphify_analysis.json').read_text(encoding='utf-8'))
node_labels = {n['id']: n['label'] for n in extraction['nodes']}

for cid, members in list(analysis['communities'].items())[:30]:
    print(f"Community {cid}:")
    for m in members[:15]:
        print(f"  - {node_labels.get(m, m)}")
    print()
