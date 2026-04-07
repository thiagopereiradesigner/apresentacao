# Apresentações (HTML estático)

Repositório para decks em HTML/CSS/JS, publicáveis no **GitHub Pages**.

## Conteúdo atual

- **Cestas Onnibank — Backoffice:** `cestas-onnibank/slides-cestas-bo.html`  
- A raiz `index.html` redireciona para esse deck.

## Publicar no GitHub (sem GitHub CLI)

1. No GitHub: **New repository** → nome sugerido `apresentacoes` → **Public** → criar **sem** README (este já existe localmente).
2. Na pasta deste projeto:

```bash
cd apresentacoes
git init
git add .
git commit -m "chore: repositório de apresentações + deck Cestas Onnibank BO"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/apresentacoes.git
git push -u origin main
```

3. No repositório: **Settings → Pages** → **Deploy from branch** → branch `main`, pasta **`/(root)`** → Save.

URL típica: `https://SEU_USUARIO.github.io/apresentacoes/` (abre o `index.html` → redireciona para o deck).

## GitHub CLI (opcional)

Instale [GitHub CLI](https://cli.github.com/) e use `gh auth login` e `gh repo create` para criar o remoto pela linha de comando.
