# Origen y alcance
Copia manual (solo la skill `ui-ux-pro-max`, sin tests) de https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
Commit revisado: 477bcb28c9812b385cb51a4605ddf30d7b2266e2 (v2.13.0, licencia MIT).
Cambios locales: rutas `${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max` → `.claude/skills/ui-ux-pro-max` (relativas a la raíz del proyecto).
Solo biblioteca estándar de Python, sin red. Ejecutar vía Docker:
  docker run --rm -v "$PWD":/w -w /w python:3.12-slim python .claude/skills/ui-ux-pro-max/scripts/search.py "<consulta>" --design-system
No se instalaron las otras skills del repo (design, brand, slides, ui-styling…) ni el CLI de npm.
