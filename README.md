# BrinLê Neuro - Plataforma de Leitura Neural

Plataforma educacional de leitura com recursos neurocientíficos e tecnologia de áudio binaural.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **UI**: Shadcn/ui + Tailwind CSS
- **Áudio**: Tone.js (binaural beats)
- **Animações**: Framer Motion

## 📦 Instalação

```bash
npm install
```

## 🛠️ Desenvolvimento

```bash
npm run dev
```

Servidor rodando em `http://localhost:5000`

## 🏗️ Build

```bash
npm run build
```

Gera:
- `dist/public/` - Frontend (HTML, CSS, JS)
- `dist/index.js` - Backend (Express server)

## 🚀 Produção

```bash
npm start
```

Roda o servidor em modo produção (NODE_ENV=production)

## 📋 Scripts

- `npm run dev` - Inicia desenvolvimento (backend + frontend)
- `npm run build` - Build completo (frontend + backend)
- `npm start` - Servidor produção
- `npm run check` - Type checking
- `npm run db:push` - Push schema para database

## 🌐 Deploy

### Railway

O projeto está configurado com `nixpacks.toml` para deploy automático no Railway:

1. Conecte o repositório ao Railway
2. Railway executará automaticamente:
   - `npm install`
   - `npm run build`
   - `npm start`

### Outras Plataformas

Qualquer plataforma que suporte Node.js pode hospedar este projeto. Certifique-se de:

1. Definir `NODE_ENV=production`
2. Executar `npm run build` no build step
3. Executar `npm start` no start command

## 📁 Estrutura

```
.
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── index.html
├── server/          # Backend Express
│   ├── index.ts
│   ├── routes.ts
│   └── vite.ts
├── shared/          # Tipos compartilhados
│   └── schema.ts
└── public/          # Assets estáticos
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz (não commitado):

```env
# Exemplo
DATABASE_URL=your_database_url
PORT=5000
```

## 📄 Licença

MIT
