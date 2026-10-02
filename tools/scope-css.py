"""Scope a standalone stylesheet under a wrapper class so a whole-site demo can live inside UI Lab without leaking.
usage: python tools/scope-css.py <file.css> <scope-class> [keyframe-prefix]
- :root / html / body selectors become the wrapper itself; other selectors get the wrapper as ancestor.
- @keyframes names are prefixed (they are global) and animation declarations updated to match."""
import re, sys

path, scope, kp = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else sys.argv[2])
S = '.' + scope
src = open(path, encoding='utf8').read()
src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)  # comments would otherwise glue onto the next selector

# find keyframe names
names = re.findall(r'@keyframes\s+([\w-]+)', src)

def split_blocks(text):
    """yield (prelude, body) pairs at the top nesting level"""
    out, i, n = [], 0, len(text)
    while i < n:
        j = text.find('{', i)
        if j == -1:
            out.append((text[i:].strip(), None)); break
        depth, k = 1, j + 1
        while depth and k < n:
            if text[k] == '{': depth += 1
            elif text[k] == '}': depth -= 1
            k += 1
        out.append((text[i:j].strip(), text[j + 1:k - 1]))
        i = k
    return out

def scope_sel(sel):
    sel = sel.strip()
    if not sel: return sel
    if re.match(r'^html\.lenis', sel): return None
    if re.match(r'^(:root|html|body)\b', sel):
        rest = re.sub(r'^(:root|html|body)', '', sel, count=1)
        return S + rest
    if sel == '*': return f'{S} *'
    if sel.startswith('::selection'): return f'{S}::selection, {S} ::selection'
    return f'{S} {sel}'

def scope_rules(text):
    parts = []
    for prelude, body in split_blocks(text):
        if body is None:
            if prelude.strip(): parts.append(prelude)
            continue
        if prelude.startswith('@keyframes'):
            nm = prelude.split()[1]
            parts.append(f'@keyframes {kp}-{nm} {{{body}}}')
        elif prelude.startswith('@media'):
            parts.append(f'{prelude} {{\n{scope_rules(body)}\n}}')
        elif prelude.startswith('@'):
            parts.append(f'{prelude} {{{body}}}')
        else:
            sels = [scope_sel(s) for s in re.split(r',(?![^(]*\))', prelude)]
            sels = [s for s in sels if s]
            if not sels: continue
            parts.append(f'{", ".join(sels)} {{{body}}}')
    return '\n'.join(parts)

out = scope_rules(src)
for nm in names:
    out = re.sub(rf'(animation(?:-name)?\s*:[^;{{}}]*?)(?<![\w-]){re.escape(nm)}(?![\w-])', rf'\1{kp}-{nm}', out)
# wrapper needs its own box: full width, paints its own background, clips horizontal overflow without breaking sticky
out = out.replace('overflow-x: hidden', 'overflow-x: clip')  # hidden would make the wrapper a scroll container and break position: sticky
out = f'{S} {{ position: relative; min-height: 100svh; overflow-x: clip; }}\n' + out
open(path, 'w', encoding='utf8').write(out)
print(path, 'scoped,', len(names), 'keyframes:', names)
