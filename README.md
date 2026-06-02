# ASI Cargas e Mudancas

Site institucional da ASI - Alexandre Solucoes Integradas, publicado em:

- https://asicargasemudancas.com.br
- https://www.asicargasemudancas.com.br

## Estrutura

- `index.html` e paginas `.html`: site fonte.
- `assets/`: imagens publicas usadas no site.
- `data/`: dados renderizados no frontend, incluindo reputacao.
- `build-dist.ps1`: gera o build publico.
- `build-dist.mjs`: gera o mesmo build publico em ambiente Node/Vercel.
- `dist/`: build gerado para deploy, nao versionado.

## Build

```powershell
powershell -ExecutionPolicy Bypass -File ".\build-dist.ps1"
```

Build usado pela Vercel a partir do GitHub:

```powershell
npm run build
```

## Deploy atual

O projeto Vercel correto e `asi-cargas-e-mudancas`, na conta ASI.

Deploy manual a partir do build gerado:

```powershell
cd ".\dist"
vercel.cmd deploy . --prod --yes --global-config "C:\Users\Yuri\.vercel-asi-configs\asi"
```

## Observacoes

- O DNS fica na HostGator apontando para a Vercel.
- Nao versionar `.vercel/`, `dist/`, capturas de QA ou artefatos temporarios.
- Nao usar a conta pessoal `Lob0Garou` para deploy da ASI.
