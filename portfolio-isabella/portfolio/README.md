# Portfólio · Isabella Ana Dutra de Sousa

Site pessoal feito com **HTML, CSS e JavaScript** puro.

🔗 **Acesse:** https://isabellana20.github.io

## Funcionalidades
- Layout responsivo (celular, tablet e computador)
- Tema claro e escuro (a escolha fica salva)
- Efeito de digitação no topo
- Animações ao rolar a página
- Projetos em destaque com galeria de telas (Anna's Suplementos e Dia das Crianças)
- Site do Dia das Crianças rodando ao vivo dentro do portfólio
- Outros repositórios carregados automaticamente da API do GitHub
- Botão para copiar o e-mail

## Estrutura
```
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── isabella.jpg
│   └── projetos/            (capturas de tela dos projetos)
└── projetos/
    ├── annas-suplementos/   (código PHP da loja)
    └── dia-das-criancas/    (site completo, abre em /projetos/dia-das-criancas/)
```

## Como publicar no GitHub Pages
1. Crie um repositório chamado **`isabellana20.github.io`**.
2. Envie todos os arquivos desta pasta (incluindo a pasta `assets`).
3. Vá em **Settings → Pages**, em *Source* escolha **Deploy from a branch**, branch **main**, pasta **/ (root)** e salve.
4. Em 1–2 minutos o site estará no ar em `https://isabellana20.github.io`.

> **Obs.:** o GitHub Pages não executa PHP. Por isso, o projeto Anna's Suplementos aparece no portfólio
> com as telas e o código. Para rodá-lo localmente: `cd projetos/annas-suplementos && php -S localhost:8000`.
