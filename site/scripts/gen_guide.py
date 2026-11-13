"""Generate src/app/guide-content.json from content/guide.src.json.

The source holds Simplified Chinese (zh) and English (en); the Traditional
Chinese (tw) text is converted with OpenCC (s2twp, Taiwan phrasing).

    pip install opencc-python-reimplemented
    python scripts/gen_guide.py
"""
import json
from pathlib import Path

from opencc import OpenCC

ROOT = Path(__file__).resolve().parent.parent
cc = OpenCC("s2twp")
# Product / UI words OpenCC would otherwise change.
KEEP = {"沙棗": "沙棗"}


def convert(node):
    if isinstance(node, dict):
        if "zh" in node and "en" in node and set(node) <= {"zh", "en", "tw"}:
            tw = cc.convert(node["zh"])
            for k, v in KEEP.items():
                tw = tw.replace(k, v)
            return {"zh": node["zh"], "tw": tw, "en": node["en"]}
        return {k: convert(v) for k, v in node.items()}
    if isinstance(node, list):
        return [convert(v) for v in node]
    return node


src = json.loads((ROOT / "content" / "guide.src.json").read_text(encoding="utf-8"))
out = ROOT / "src" / "app" / "guide-content.json"
out.write_text(json.dumps(convert(src), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("wrote", out)
