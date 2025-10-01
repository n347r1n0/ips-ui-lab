You are Codex working LOCALLY in a 2-root workspace.

Roots:
- PROD = ips-website-prod/frontend
- DEV  = ips-ui-lab/frontend

Hard constraints (entire task):
- DO NOT run shell/PowerShell/ripgrep or open terminals.
- DO NOT change deps/build/config/migrations/edge functions.
- DO NOT touch node_modules, dist/build, .idea, public.
- Work only under the two roots above. Always prefix paths with DEV:/PROD:.
- Reports → DEV:/src/PROD_comparison/reports/
- Drafts/patches → DEV:/src/PROD_comparison/drafts/

File access policy:
- First, request a ONE-TIME READ BATCH with exact paths you need (see format below).
- After I provide contents, stay chat-only unless you explicitly request a second read batch (rare).

Reply first with:
1) Short confirmation you will follow the one-time read batch policy
2) The 5–8 rules you’ll follow (bulleted)
3) Your [READ-BATCH REQUEST] block with the paths you need
