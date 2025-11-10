# 🚀 Deploy no Railway - BrinLê Neuro

Este guia explica como fazer o deploy completo do BrinLê Neuro no Railway.

## ✅ Pré-requisitos

- Conta no [Railway](https://railway.app)
- Código do projeto em um repositório Git (GitHub, GitLab, ou Bitbucket)
- Ou, Railway CLI instalado (já incluído no projeto)

## 📋 O Projeto Já Está Configurado

Todos os arquivos necessários já estão prontos:

- ✅ `railway.json` - Configuração do Railway
- ✅ `nixpacks.toml` - Configuração de build
- ✅ `package.json` - Scripts de build e start
- ✅ Servidor configurado para PORT dinâmico

## 🌐 Método 1: Deploy via Dashboard (Recomendado)

### Passo 1: Criar Novo Projeto

1. Acesse [railway.app](https://railway.app)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize o Railway a acessar seu GitHub
5. Selecione o repositório do BrinLê Neuro

### Passo 2: Configuração Automática

O Railway irá detectar automaticamente:
- Node.js como runtime
- Os comandos de build e start do `railway.json`
- A configuração do Nixpacks

### Passo 3: Variáveis de Ambiente (Opcional)

Se seu app usar banco de dados ou outras variáveis:

1. No dashboard do projeto, clique em **"Variables"**
2. Adicione as variáveis necessárias:
   ```
   NODE_ENV=production
   DATABASE_URL=sua_url_do_banco (se usar)
   ```

### Passo 4: Deploy

1. O Railway iniciará o deploy automaticamente
2. Aguarde o build completar (você verá os logs em tempo real)
3. Quando aparecer "✓ Deployed", seu app está no ar!

### Passo 5: Acessar o App

1. Clique em **"Settings"** no seu serviço
2. Clique em **"Generate Domain"** para criar uma URL pública
3. Ou configure um domínio customizado

Seu app estará disponível em: `https://seu-projeto.up.railway.app`

## 💻 Método 2: Deploy via Railway CLI

### Passo 1: Login

```bash
npx railway login
```

### Passo 2: Inicializar Projeto

```bash
npx railway init
```

Selecione "Create new project" e dê um nome ao projeto.

### Passo 3: Deploy

```bash
npx railway up
```

### Passo 4: Abrir no Browser

```bash
npx railway open
```

## 🔧 Configurações do Railway

O projeto usa estas configurações (já definidas em `railway.json`):

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### O que acontece no deploy:

1. **Install**: `npm install` - Instala dependências
2. **Build**: `npm run build` - Gera:
   - Frontend buildado em `dist/public/`
   - Backend bundled em `dist/index.js`
3. **Start**: `npm start` - Inicia o servidor em produção

## 📊 Monitoramento

No dashboard do Railway você pode:

- Ver logs em tempo real
- Monitorar uso de CPU e memória
- Ver métricas de requisições
- Configurar alertas

## 🔄 Atualizações Automáticas

Cada push para a branch principal no GitHub:
1. Dispara um novo build automaticamente
2. Faz o deploy da nova versão
3. Zero downtime com rollback automático se falhar

## 🌍 Domínio Customizado

Para usar seu próprio domínio:

1. No dashboard, vá em **Settings**
2. Clique em **"Custom Domain"**
3. Adicione seu domínio
4. Configure os DNS records conforme instruções
5. Railway gerencia SSL automaticamente

## 💰 Planos e Custos

- **Trial Plan**: Grátis com $5 de crédito
- **Hobby Plan**: $5/mês + uso
- **Pro Plan**: $20/mês + uso

Recursos ilimitados, você paga pelo que usar.

## 🐛 Troubleshooting

### Build falhou

Verifique os logs no dashboard:
```bash
npx railway logs
```

### App não inicia

Verifique se:
- O comando `npm start` funciona localmente
- A variável PORT não está hardcoded
- Todas as dependências estão no `dependencies` (não só em `devDependencies`)

### Timeout no deploy

Aumente o timeout nas configurações do Railway ou otimize o build.

## 📞 Suporte

- [Documentação Railway](https://docs.railway.app)
- [Discord da Railway](https://discord.gg/railway)
- [GitHub Issues](https://github.com/railwayapp/railway/issues)

## 🎉 Pronto!

Seu BrinLê Neuro está no ar! 🚀

Para ver o status:
```bash
npx railway status
```

Para ver logs em tempo real:
```bash
npx railway logs
```
