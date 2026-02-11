# Editorial Calendar SILO (6 meses, 7 articulos por semana)

> Plan corregido: 1 articulo semanal por cada pilar/SILO.
>
> Total semanal: 7 articulos.
>
> Total 6 meses (26 semanas): 182 articulos.

## Regla operativa

- Cada semana se publica:
  - 1 de `ai`
  - 1 de `devops`
  - 1 de `git`
  - 1 de `web-development`
  - 1 de `engineering-culture`
  - 1 de `linux`
  - 1 de `tools`
- Cada articulo enlaza:
  - al hub de su categoria (`/blog/category/<category>/`)
  - al pillar del SILO
  - a 1-2 clusters relacionados

## Mapa de publicacion por semana

Cada semana usa el item `N` de cada backlog por SILO (N = numero de semana).

Ejemplo:

- Semana 1 -> AI#1 + DevOps#1 + Git#1 + WebDev#1 + EngCulture#1 + Linux#1 + Tools#1
- Semana 2 -> AI#2 + DevOps#2 + Git#2 + WebDev#2 + EngCulture#2 + Linux#2 + Tools#2
- ...
- Semana 26 -> AI#26 + DevOps#26 + Git#26 + WebDev#26 + EngCulture#26 + Linux#26 + Tools#26

## Backlog por SILO (26 titulos cada uno)

## AI (26)

1. Prompt Engineering para Developers: guia practica de produccion (Pillar)
2. PRD + RULES + SKILLS + MCP: contexto compartido para que la IA sirva de verdad
3. RAG con TypeScript desde cero: arquitectura minima que si funciona
4. Code Review asistido por IA: que si y que no
5. Integracion de LLM APIs: retries, costos y observabilidad
6. Guardrails en apps con IA: politicas, validacion y seguridad
7. Evaluacion de prompts en equipos: metricas sin humo
8. Agentes IA para tareas de dev: limites y patrones utiles
9. IA en soporte tecnico: flujo operativo y escalamiento
10. IA para mortales: workflows cotidianos (estudio, trabajo, productividad)
11. Costo por token en produccion: control financiero real
12. Prompt patterns para debugging backend
13. Prompt patterns para refactor seguro
14. IA para generar tests: cobertura util y riesgos
15. LLM caching: cuando conviene y cuando no
16. Hallucinations en producto: deteccion y mitigacion
17. RAG multi-fuente: docs, tickets y base de conocimiento
18. Sistema de memoria para asistentes internos
19. IA para analisis de logs y incidentes
20. Ranking de respuestas en RAG: reranking practico
21. IA y privacidad de datos: checklist para equipos
22. IA para documentacion tecnica viva
23. AI ops para equipos pequeños: roadmap de 90 dias
24. Integrar Claude/GPT/Gemini con estrategia de fallback
25. Gobernanza de prompts: versionado y auditoria
26. Estado del arte 2026 para developers: que vale la pena adoptar

## DevOps (26)

1. CI/CD con GitHub Actions y VPS: pipeline real desde cero (Pillar)
2. Docker en Node.js sin dolor: permisos, volumenes y DX
3. Nginx en produccion: vhosts, SSL y headers bien configurados
4. Estrategia de rollback en VPS con PM2
5. Zero-downtime deploy en apps Node/Astro
6. Secrets management en CI/CD sin filtrar credenciales
7. Health checks y smoke tests post-deploy
8. Logs de aplicacion: estructura y retencion util
9. Monitoreo basico con alertas accionables
10. Fail2ban + hardening minimo para VPS
11. Estrategia de backups y restore probado
12. Canary release simple para equipos pequeños
13. Control de costos en infraestructura small/medium
14. Migraciones DB en pipelines sin bloquear release
15. Queue workers y resiliencia operativa
16. Redis en produccion: patrones basicos y limites
17. Incident response tecnico: playbook real
18. Performance budget en backend y web
19. Dependabot y estrategia de actualizacion segura
20. IaC pragmatica: cuando usar Terraform
21. Seguridad en headers HTTP para apps modernas
22. Multi-ambiente staging/preprod/prod bien definido
23. Postmortems sin culpa: aprendizaje operativo
24. Release trains vs continuous delivery
25. Checklist pre-deploy para evitar incidentes tontos
26. DevOps maturity model para equipos de producto

## Git (26)

1. Conventional Commits: guia completa para equipos (Pillar)
2. Multiples cuentas Git con SSH sin conflictos
3. Firma de commits y trazabilidad en equipos
4. Estrategia de ramas para equipos de producto
5. Rebase vs merge: decision framework
6. Git hooks para calidad: lint, test y convenciones
7. Mensajes de commit que ayudan a futuro
8. Git bisect para debugging rapido
9. Changelog automatico con conventional commits
10. Pull request templates que si mejoran calidad
11. CODEOWNERS y ownership tecnico real
12. Reglas de proteccion de ramas en GitHub
13. Resolucion de conflictos sin perder contexto
14. Squash vs merge commit: tradeoffs por equipo
15. Estrategia de hotfix en produccion
16. Historial limpio sin fanatismo
17. Git tags para releases confiables
18. Monorepo git workflows para equipos medianos
19. Branch naming conventions utiles
20. Peer review etiquette en PRs complejos
21. Revert seguro y rollback de cambios
22. Automatizar labels y flujos de PR
23. Checklist de PR para cambios criticos
24. Git para incidentes: timeline y auditoria
25. Politica de commits para repos publicos
26. Workflow Git 2026 para equipos de alta velocidad

## Web Development (26)

1. TypeScript avanzado en proyectos reales: patrones y tradeoffs (Pillar)
2. Arquitectura de APIs robustas: idempotencia y retry
3. Email resiliente: backoff, jitter y observabilidad
4. Diseno de contratos API versionables
5. Validacion de entrada sin deuda tecnica
6. Error handling consistente en backend
7. Pagination y filtros escalables en APIs
8. Caching HTTP bien aplicado
9. Estrategia de autenticacion para apps modernas
10. Rate limiting por caso de uso
11. Webhooks robustos: firma, retry y idempotencia
12. Event-driven vs request-driven: cuando aplicar
13. Testing de integracion para APIs reales
14. Domain-driven boundaries en proyectos medianos
15. Estructura de carpetas sostenible en TypeScript
16. Seguridad web baseline para productos SaaS
17. Feature flags sin caos operativo
18. Migration strategy de monolito a servicios
19. API docs utiles para equipos internos
20. Manejo de errores de terceros sin romper UX
21. Search backend: relevancia, filtros y costo
22. Arquitectura multitenant pragmatica
23. Estrategia de colas para tareas asincronas
24. SLAs tecnicos y observabilidad en producto
25. Debt management para codebases vivas
26. Decision records tecnicos (ADR) para equipos

## Engineering Culture (26)

1. Como hacer code reviews efectivos sin bloquear al equipo (Pillar)
2. Story points sin humo: como estimar mejor
3. De senior dev a tech lead: que cambia de verdad
4. Criterios de arquitectura en equipos de producto
5. Definicion de done que protege calidad
6. Como reducir retrabajo en sprints tecnicos
7. Acuerdos de equipo para decisiones tecnicas
8. Feedback tecnico que mejora sin friccion
9. Mentoria tecnica en equipos senior
10. Priorizar deuda tecnica con criterio de negocio
11. Liderazgo tecnico en incidentes de produccion
12. Diseno de RFCs que se puedan ejecutar
13. Decision making en entornos ambiguos
14. Team health tecnico: senales tempranas
15. Como manejar tradeoffs con producto
16. Reuniones tecnicas utiles y cortas
17. Onboarding tecnico para acelerar impacto
18. Cultura de ownership sin burnout
19. Como decir "no" a soluciones fragiles
20. Definir standards sin burocracia
21. Escalar equipo de 5 a 15 devs
22. Conflictos tecnicos: mediacion con datos
23. KPI de ingenieria que no destruyen cultura
24. Productividad sostenible en ciclos largos
25. Playbook de guardias y rotaciones
26. Evolucion de cultura tecnica por etapas

## Linux (26)

1. Linux para developers: checklist mensual de mantenimiento (Pillar)
2. Disk cleanup seguro en Ubuntu
3. Optimizar red en Ubuntu para workstation
4. Configurar audio por defecto al iniciar sesion
5. Configurar perifericos en Linux sin drama
6. Hardening basico de desktop Linux
7. Logs del sistema: donde mirar y como leer
8. Servicios systemd para tareas recurrentes
9. Diagnostico rapido de problemas de red
10. Tuning basico de rendimiento en laptop Linux
11. DNS troubleshooting para developers
12. Gestión de paquetes sin romper sistema
13. Seguridad SSH para entornos personales
14. Backup local automatizado en Linux
15. Script toolbox para mantenimiento semanal
16. Troubleshooting USB y dispositivos externos
17. Kernel updates: buenas practicas
18. Manejo de espacio en /var y /home
19. Firewall basico con ufw bien configurado
20. Cron vs systemd timers
21. Dotfiles mantenibles para productividad
22. Seguridad de navegador en Linux
23. Network namespaces para pruebas locales
24. Uso de journalctl para incidentes
25. Migrar entre versiones Ubuntu sin dolor
26. Linux workflow 2026 para developers

## Tools (26)

1. Cursor AI: reglas, contexto y workflow productivo (Pillar)
2. Terminal setup productivo: Kitty + Ranger + aliases
3. OBS para tutoriales de codigo: calidad alta y archivos ligeros
4. VS Code vs Cursor: flujo real para equipos
5. Snippets personales y reutilizacion efectiva
6. Configuracion de atajos para reducir friccion
7. Gestion de notas tecnicas para devs
8. Templates de PR y issue que ahorran tiempo
9. Automatizaciones locales con scripts simples
10. Timeboxing tecnico con herramientas livianas
11. Dashboards personales de productividad
12. Captura de conocimiento tecnico reutilizable
13. Setup de debugging visual para backend
14. Herramientas de profiling para Node/TS
15. Setup de terminal remoto seguro
16. Toolchain minima para equipos pequeños
17. Flujo de screencasts para contenido tecnico
18. Configuracion de lint/format robusta
19. Workflows de AI IDE sin dependencia excesiva
20. Plantillas de arquitectura reutilizables
21. Herramientas para visualizacion de logs
22. QA personal antes de abrir PR
23. Automatizar tareas repetitivas de developer
24. Tooling para documentacion tecnica viva
25. Setup portable entre laptop y desktop
26. Stack de herramientas 2026: que mantener y que soltar

## Checklist semanal de publicacion (7/7)

- [ ] Publicado AI
- [ ] Publicado DevOps
- [ ] Publicado Git
- [ ] Publicado Web Development
- [ ] Publicado Engineering Culture
- [ ] Publicado Linux
- [ ] Publicado Tools

## KPI del plan

- 7 URLs nuevas indexables por semana.
- Cobertura de hubs por crecimiento continuo de cluster.
- Incremento de impresiones por SILO en GSC.
- Mejora de CTR en pilares por autoridad topical.
