import re, json

src = open('src/data/sites.ts', encoding='utf-8').read()
blocks = re.split(r'\n  \{', src)
res = {}
for b in blocks:
    idm = re.search(r"id: '(\w+)'", b)
    nm = re.search(r"name: '([^']+)'", b)
    mm = re.search(r"monologue:\s*\n?\s*'([\s\S]*?)',", b)
    if idm and mm:
        res[idm.group(1)] = {'name': nm.group(1) if nm else '', 'mono': mm.group(1).strip()}

with open('scripts/narration-src.json', 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
print(len(res), 'sites')
for k, v in res.items():
    print(k, '|', v['name'], '|', len(v['mono']))
