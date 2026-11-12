# EduConnect — Frontend

Frontend demonstrativo de um portal acadêmico responsivo e acessível.
Os dados são fictícios (`src/data/academic.ts`) e a interface está pronta para ser ligada a uma API.

## Stack
- React 18 + TypeScript (modo estrito)
- Vite 5
- Tailwind CSS 3
- Lucide React (ícones)
- Inter variável, hospedada localmente via `@fontsource-variable/inter`

## Rodar localmente

```bash
npm install      # ou: npm ci (usa exatamente o package-lock.json)
npm run dev
```

Outros comandos: `npm run build` (checa tipos e gera `dist/`), `npm run typecheck`, `npm run preview`.

> A pasta `node_modules` **não** deve ser enviada nem versionada. Ela é recriada pelo `npm install`.
> O `.gitignore` já a ignora.

## Estrutura

```
src/
  App.tsx              layout, rota, toasts, estado global
  types.ts             tipos compartilhados
  data/academic.ts     dados fictícios por semestre + constantes (prazo, limites)
  lib/format.ts        números, datas e médias em pt-BR
  lib/hooks.ts         rota por hash, localStorage, fechar menus
  components/          Sidebar, Header, MobileNav, DeadlineBanner, ui (Modal, Badge...)
  pages/               Dashboard, Notas, Disciplinas, Matricula, Perfil
```

## Pontos de atenção para o backend

- `TODAY` em `src/data/academic.ts` é uma data fixa de demonstração. Troque por `new Date()` ao integrar.
- Login, troca de senha e envio de foto são simulados. A foto fica em `localStorage`.
- Persistência atual (`localStorage`): semestre escolhido, perfil, matrícula e notificações lidas.
