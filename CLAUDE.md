# Instruções para Claude Code

## Contexto do Projeto

Repositório da disciplina **Hospedagem e uso de modelos públicos de IA (Nível 4)**,
Fase 2 do curso Tech Developer 360 (Rocketseat FTR).

**Projeto principal**: Aplicação web que combina geração de legendas de imagens,
tradução e síntese de fala usando modelos de IA públicos rodando em CPU (sem GPU).

**Stack**: JavaScript, React, Node.js, Python, Transformers.js, ONNX Runtime.

## Regras Gerais

- Sempre usar `pnpm` (bash) <https://pnpm.io/>

### Markdown

- **SEMPRE** obedeça TODAS as regras de lint ao gerar arquivos `.md`.
- Use títulos hierárquicos corretos (não pule níveis: H1 → H2 → H3).
- Deixe linha em branco antes e depois de blocos de código.
- Deixe linha em branco antes e depois de listas.
- Use listas ordenadas quando a sequência importa.
- Evite linhas muito longas (max 120 caracteres quando possível).
- Finalize arquivos com linha em branco.
- Use o padrão da língua portuguesa.

### Código

- Prefira JavaScript/TypeScript moderno (ES6+).
- Use async/await ao invés de callbacks.
- Comente código complexo em inglês
- Mantenha funções pequenas e com responsabilidade única.

### Organização

- Documentação pessoal vai em `.claude/`.
- Exemplos e testes vão em pastas dedicadas.
- Mantenha estrutura limpa e organizada.

## Estrutura do Repositório

```text
.
├── CLAUDE.md              # Este arquivo (instruções)
├── .claude/               # Documentação e notas pessoais
│   ├── resumo_projeto.md  # Resumo da disciplina (resumo por aula e tecnologias utilizadas)
│   └── v01_context7.md    # Pesquisa Context7 (versão 1)
├── README.md              # Documentação pública (quando aplicável)
└── src/                   # Código fonte (quando aplicável)
```

## Observações

- Este é um repositório de **aprendizado e experimentação**.
- Priorize clareza e didática sobre otimização prematura.
- Documente decisões técnicas importantes.
- Mantenha exemplos simples e reproduzíveis.
- Use o padrão da língua portuguesa.
- sempre detalhe o commit em ingles e nunca informe nada sobre o claude dentro do texto do commit