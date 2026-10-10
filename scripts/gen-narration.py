# 批量生成讲解音频：python gen-narration.py <起始序号> <结束序号>
import json, subprocess, sys, os

PLUGIN = r"C:/Users/MINYUE/AppData/Roaming/kimi-desktop/daimon-share/daimon/runtime/kimi-code/home/plugins/managed/audio_generation"
OUT = r"C:/Users/MINYUE/Documents/kimi/workspace/gujian-memory-map/public/audio"
STD_VOICE = "05Cdh2gw2NMzDvykn1nm"  # 沉稳中年男声 · 普通话
DIA_VOICE = "Q63G7WZ5riIGbK8KmqO9"  # 年轻男声 · 方言版

std = json.load(open('scripts/narration-src.json', encoding='utf-8'))
dia = json.load(open('scripts/narration-dia.json', encoding='utf-8'))

# 任务列表：(id, 文本, voice, 输出名)
tasks = []
for sid, v in std.items():
    tasks.append((sid, v['mono'], STD_VOICE, f'{sid}-std.mp3'))
    tasks.append((sid, dia[sid], DIA_VOICE, f'{sid}-dia.mp3'))

lo, hi = int(sys.argv[1]), int(sys.argv[2])
for i, (sid, text, voice, name) in enumerate(tasks):
    if not (lo <= i < hi):
        continue
    out = os.path.join(OUT, name)
    if os.path.exists(out) and os.path.getsize(out) > 10000:
        print('SKIP', name)
        continue
    r = subprocess.run(
        ['python3', 'scripts/audio_generation_tool.py', 'speech',
         '--text', text, '--voice-id', voice, '--output', out],
        cwd=PLUGIN, capture_output=True, text=True, timeout=300)
    ok = os.path.exists(out) and os.path.getsize(out) > 10000
    print(('OK  ' if ok else 'FAIL'), name)
    if not ok:
        print(r.stdout[-300:], r.stderr[-300:])
print('chunk done')
