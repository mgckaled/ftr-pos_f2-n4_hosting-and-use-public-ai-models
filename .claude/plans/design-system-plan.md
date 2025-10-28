# Plano de Design System - AI Image Captioning

**Versão:** 1.0
**Data:** 2025-10-28
**Objetivo:** Criar um design system simples, moderno e customizável para o projeto

---

## 1. Paleta de Cores

### Tema: Tecnologia & IA

**Cores Primárias:**

```css
/* Roxo tecnológico - Cor principal da marca */
--color-primary: #7c3aed;        /* violet-600 */
--color-primary-hover: #6d28d9;  /* violet-700 */
--color-primary-light: #a78bfa;  /* violet-400 */

/* Azul cibernético - Cor secundária */
--color-secondary: #0ea5e9;      /* sky-500 */
--color-secondary-hover: #0284c7; /* sky-600 */
```

**Cores de Suporte:**

```css
/* Sucesso */
--color-success: #10b981;  /* green-500 */

/* Erro/Destrutiva */
--color-error: #ef4444;    /* red-500 */

/* Aviso */
--color-warning: #f59e0b;  /* amber-500 */

/* Info */
--color-info: #06b6d4;     /* cyan-500 */
```

**Cores Neutras (Light Mode):**

```css
--color-background: #ffffff;      /* Fundo principal */
--color-surface: #f8fafc;         /* slate-50 - Cards, painéis */
--color-border: #e2e8f0;          /* slate-200 */
--color-text-primary: #0f172a;    /* slate-900 */
--color-text-secondary: #64748b;  /* slate-500 */
```

**Cores Neutras (Dark Mode):**

```css
--color-background: #0f172a;      /* slate-900 */
--color-surface: #1e293b;         /* slate-800 */
--color-border: #334155;          /* slate-700 */
--color-text-primary: #f8fafc;    /* slate-50 */
--color-text-secondary: #94a3b8;  /* slate-400 */
```

---

## 2. Tipografia

### Escala de Tamanhos

```css
/* Títulos */
--text-h1: 2.5rem;    /* 40px */
--text-h2: 2rem;      /* 32px */
--text-h3: 1.5rem;    /* 24px */
--text-h4: 1.25rem;   /* 20px */

/* Corpo */
--text-base: 1rem;    /* 16px */
--text-sm: 0.875rem;  /* 14px */
--text-xs: 0.75rem;   /* 12px */

/* Pesos */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Alturas de linha */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## 3. Espaçamento

### Escala Base-8

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

**Uso Recomendado:**

- Padding interno de botões: `space-4` (vertical) x `space-6` (horizontal)
- Padding de cards: `space-6`
- Gaps entre elementos: `space-4`
- Margens de seções: `space-8` ou `space-12`

---

## 4. Bordas & Cantos

### Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - Inputs, tags */
--radius-md: 0.5rem;     /* 8px - Botões, cards */
--radius-lg: 0.75rem;    /* 12px - Modais, painéis */
--radius-xl: 1rem;       /* 16px - Imagens destacadas */
--radius-full: 9999px;   /* Circular - Avatares, badges */
```

### Border Width

```css
--border-thin: 1px;      /* Padrão */
--border-medium: 2px;    /* Destaque */
--border-thick: 4px;     /* Muito enfatizado */
```

---

## 5. Sombras

### Elevação

```css
/* Sombras para profundidade */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Sombra colorida para elementos em foco */
--shadow-primary: 0 0 0 3px rgba(124, 58, 237, 0.2);
```

**Uso:**

- Cards: `shadow-sm`
- Dropdowns/Modais: `shadow-lg`
- Focus state: `shadow-primary`

---

## 6. Componentes

### 6.1 Botões

**Variantes:**

```css
/* Primary - Ação principal */
bg-primary text-white hover:bg-primary-hover
shadow-sm active:shadow-md

/* Secondary - Ações secundárias */
bg-surface text-text-primary border border-border
hover:bg-slate-100 dark:hover:bg-slate-700

/* Outline - Alternativa neutra */
border-2 border-primary text-primary bg-transparent
hover:bg-primary hover:text-white

/* Ghost - Ações sutis */
text-primary hover:bg-primary/10
```

**Tamanhos:**

- Small: `h-9 px-3 text-sm`
- Default: `h-10 px-4 text-base`
- Large: `h-12 px-8 text-base`

### 6.2 Cards

```css
/* Card padrão */
bg-surface border border-border rounded-lg shadow-sm
p-6

/* Card interativo */
hover:shadow-md transition-shadow cursor-pointer

/* Card destacado */
border-2 border-primary shadow-md
```

### 6.3 Inputs

```css
/* Input padrão */
h-10 px-3 rounded-md
border border-border bg-background
focus:ring-2 focus:ring-primary focus:border-transparent
text-base

/* Input com erro */
border-error focus:ring-error
```

---

## 7. Animações & Transições

```css
/* Duração */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;

/* Easing */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

**Transições Comuns:**

- Hover: `transition-colors duration-200`
- Focus: `transition-all duration-150`
- Modais: `transition-opacity duration-300`

---

## 8. Estados Interativos

### Hover

- Botões: Escurecer 10% ou mudar shadow
- Cards: Aumentar shadow
- Links: Mudar cor para `primary-hover`

### Focus

- Ring: `focus:ring-2 focus:ring-primary focus:ring-offset-2`
- Outline: Remover padrão do browser

### Active

- Botões: `active:scale-95` (leve scale down)
- Cards clicáveis: `active:shadow-sm`

### Disabled

- Opacity: `opacity-50`
- Cursor: `cursor-not-allowed`
- Remover interatividade: `pointer-events-none`

---

## 9. Responsividade

### Breakpoints (Tailwind padrão)

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

**Ajustes Recomendados:**

- Títulos (H1): `text-3xl md:text-4xl`
- Padding de containers: `px-4 md:px-8 lg:px-12`
- Grid de imagens: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

---

## 10. Implementação

### Ordem de Prioridade

1. **Fase 1** (Essencial):
   - Atualizar paleta de cores
   - Ajustar tipografia (h1, h2, base)
   - Padronizar border radius

2. **Fase 2** (Melhoria):
   - Atualizar estilos de botões
   - Melhorar cards com sombras
   - Adicionar transições suaves

3. **Fase 3** (Refinamento):
   - Estados hover/focus consistentes
   - Animações sutis
   - Ajustes de responsividade

### Arquivos a Modificar

1. `src/index.css` - Design tokens
2. `src/components/ui/button.tsx` - Variantes de botão
3. `src/components/ui/card.tsx` - Estilos de card
4. `src/App.tsx` - Layout e espaçamento

---

## 11. Referências Visuais

**Inspiração de Paleta:**

- Roxo: Associado a IA, criatividade, tecnologia avançada
- Azul cibernético: Confiança, modernidade, digital

**Exemplos de Uso:**

- Botão principal: Fundo roxo (#7c3aed)
- Links: Azul cibernético (#0ea5e9)
- Cards: Fundo slate-50 (light) / slate-800 (dark)
- Bordas: Sutil, slate-200 (light) / slate-700 (dark)

---

## Observações Finais

- **Customizável**: Todos os valores são variáveis CSS, fáceis de ajustar
- **Acessível**: Contraste adequado (WCAG AA mínimo)
- **Simples**: Apenas o essencial, sem complexidade excessiva
- **Moderno**: Tendências atuais de UI/UX (2025)
