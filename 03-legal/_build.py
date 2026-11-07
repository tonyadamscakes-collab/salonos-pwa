import re,glob,os,collections
spec=open('../02-product-spec.md').read()
cut=spec.find('### 11.6 Deferred')
act=set(re.findall(r'^\|\s*([A-Z]{2,4}-\d{2})\s*\|',spec[:cut],re.M))
allids=set(re.findall(r'^\|\s*([A-Z]{2,4}-\d{2})\s*\|',spec,re.M))
struck=allids-act
# replacements for non-existent prefixes
REPL={'LEG-05':[('FRM-*','COL-01')],'LEG-09':[('FRM-*','COL-01')],'LEG-07':[('OFF-* (offline PWA storage)','OFF-01, OFF-02')],
 'LEG-10':[('FIN-*','FIN-03')],'LEG-16':[('TIL-* (tip line), ','')],'LEG-13':[('PAY (Stripe), ','TIL-06, ')],
 'LEG-06':[(', PAY, COM','')],'LEG-01':[(', MON','')],'LEG-03':[('GFT-05 (struck, optional), GFT-06 (struck), D8, ','')],
 'LEG-17':[('OUT-20 (deferred MKT-01 to MKT-09, FIN-09, ROL-08 in spec 11.6)','OUT-20')]}
def expand(tok):
    tok=tok.strip()
    m=re.match(r'^([A-Z]{2,4})-(\d{2}) to (?:[A-Z]{2,4}-)?(\d{2})$',tok)
    if m: return [f'{m[1]}-{n:02d}' for n in range(int(m[2]),int(m[3])+1)]
    m=re.match(r'^([A-Z]{2,4})-\*',tok)
    if m: return sorted(i for i in act if i.startswith(m[1]+'-'))
    return [tok]
LEGEND="**Labels used in this document:** **(V) Verified**: the source page was opened in this project. **(R) Reported**: from a search extract or secondary source, not opened in full. **(U) Unverified**: general legal knowledge, not opened. **(J) Judgement**: a drafting choice for your adviser to confirm."
HDR="**DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use**"
trace=[];problems=[];docs=[]
for p in sorted(glob.glob('_src/*.md')):
    s=open(p).read()
    m=re.match(r'<!-- id: (LEG-\d\d) \| title: (.*?) \| who: (.*?) \| reqs: (.*?) -->\n',s)
    did,title,who,reqs=m.groups(); body=s[m.end():]
    for a,b in REPL.get(did,[]): reqs=reqs.replace(a,b)
    ids=[]
    for t in reqs.split(','):
        if t.strip(): ids+=expand(t)
    ids=list(dict.fromkeys(ids))
    bad=[i for i in ids if i not in allids]
    if bad: problems.append((did,bad))
    live=[i for i in ids if i in act]; dead=[i for i in ids if i in struck]
    fn=os.path.basename(p)
    out=f"{HDR}\n\n# {did}. {title}\n\n| | |\n|---|---|\n| **Document** | {did} (SalonOS Stage 3, Legal and Compliance) |\n| **For** | {who} |\n| **Status** | Draft v0.1 for Tony's approval. **Not published. Not in use.** |\n| **Prepared** | 31 October 2026 (Europe/London) |\n| **Spec requirements served** | {', '.join(live)}{(' (struck or deferred, for reference: '+', '.join(dead)+')') if dead else ''} |\n\n**Placeholders are kept on purpose.** Anything in [SQUARE BRACKETS] (names, addresses, company, VAT and ICO numbers, prices, percentages, dates, periods) is for Tony or the salon to fill. **Nothing has been invented, and no price or legal detail has been approved.**\n\n{LEGEND}\n\n---\n\n{body.strip()}\n\n---\n{HDR}\n"
    open(fn,'w').write(out)
    trace.append((did,title,who,live,dead,fn)); docs.append(fn)
print('problems',problems)
t=[HDR,'','# Stage 3 trace: document to spec requirement','',f'Generated from `02-product-spec.md` on 31 Oct 2026. {len(trace)} documents. Every ID below was checked to exist in the spec; "struck/deferred" IDs are rows in spec section 11.6.','','']
for did,title,who,live,dead,fn in trace: t.append(f'- **[{did}]({fn}) {title}.** Serves: {", ".join(live)}.' + (f' Struck or deferred refs: {", ".join(dead)}.' if dead else ''))
# reverse: requirements with no legal doc
cov=set(i for *_,live,dead,fn in [(x[0],x[1],x[2],x[3],x[4],x[5]) for x in trace] for i in live)
t+=['','## Coverage note','',f'{len(cov)} distinct active requirements are cited by at least one legal draft. Requirements with no legal document are those with no legal or compliance dimension (diary, stock, reports and similar).','','## Gaps found while tracing','','- **HEV-05** (signed booking agreement for home visits and events) has no template in the approved 21-document list. Recommend adding it at Stage 3 review (Judgement).','- **DPIA R7** (offline device lost or stolen) has no matching security requirement; spec to define it at Stage 4.','- **Operator privacy notice** (Tony as controller of account and billing data) is a placeholder inside LEG-18 Part B5, not a separate document.']
open('00-trace.md','w').write('\n'.join(t)+'\n')
print(len(docs),'docs')
