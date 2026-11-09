"""从标准输入读取分页的 GitHub Releases JSON，更新问题反馈的版本选项。"""

import json
from pathlib import Path
import re
import sys


TAG = re.compile(r"v?(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?", re.ASCII)
START = "        # BEGIN RELEASE OPTIONS\n"
END = "        # END RELEASE OPTIONS\n"
FORM = Path(__file__).resolve().parents[1] / "ISSUE_TEMPLATE" / "bug_report.yml"


def release_options(pages):
    stable = []
    previews = []
    for page in pages:
        for release in page:
            tag = release["tag_name"]
            version = TAG.fullmatch(tag)
            published = release["published_at"]
            if release["draft"] or not published or not version:
                continue
            base = tuple(int(part) for part in version.groups()[:3])
            if release["prerelease"] and version[4]:
                previews.append((base, published, tag))
            elif not release["prerelease"] and not version[4]:
                stable.append((published, base, tag))

    options = [tag for _, _, tag in sorted(stable, reverse=True)[:3]]
    latest_stable = max((base for _, base, _ in stable), default=(-1, -1, -1))
    current_preview = max((entry for entry in previews if entry[0] > latest_stable), default=None)
    if current_preview:
        options.append(current_preview[2])
    return options


def main():
    options = release_options(json.load(sys.stdin))
    text = FORM.read_text(encoding="utf-8")
    if text.count(START) != 1 or text.count(END) != 1:
        raise ValueError("问题反馈模板缺少唯一的版本选项标记")
    before, block = text.split(START)
    _, after = block.split(END)
    updated = before + START + "".join(f"        - {tag}\n" for tag in options) + END + after
    if updated != text:
        FORM.write_text(updated, encoding="utf-8", newline="\n")
    print("版本选项：" + ("、".join(options) or "仅显示手动选项"))


if __name__ == "__main__":
    main()
