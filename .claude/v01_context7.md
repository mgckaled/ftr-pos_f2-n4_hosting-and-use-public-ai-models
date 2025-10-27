# Resumo: Hospedagem e Uso de Modelos Públicos de IA

## 📚 Contexto do Repositório

Este repositório documenta a disciplina de **Hospedagem e uso de modelos públicos de IA (Nível 4)**,
da Fase 2 (Estratégia e Inovação), do curso de Pós-Graduação Tech Developer 360 da Rocketseat (FTR).

## 🎯 Objetivo da Disciplina

A disciplina está dividida em **duas partes principais**:

### Parte Teórica

- Conceitos básicos de modelos de IA.
- Trade-offs dos modelos (custo vs. performance).
- Estratégias de hospedagem.

### Parte Prática

Desenvolvimento de um projeto real envolvendo:

1. **Geração de legendas** a partir de imagens (Image Captioning).
2. **Tradução** de texto.
3. **Síntese de fala** (Text-to-Speech).

## 💻 Stack Tecnológica

**Linguagens e Frameworks:**

- JavaScript / Node.js.
- React.
- Python.

**Foco especial:** Executar modelos em computadores comuns **sem necessidade de GPU**.

---

## 🚀 Tecnologias Principais (baseado em context7)

### 1. Transformers.js

*Biblioteca JavaScript para rodar modelos de IA no browser/Node.js.*

**Principais funcionalidades para o projeto:**

#### 📸 Image Captioning (Geração de Legendas)

```javascript
import { pipeline } from '@huggingface/transformers';

const captioner = await pipeline(
    'image-to-text',
    'Xenova/vit-gpt2-image-captioning'
);

const url = 'imagem.jpg';
const result = await captioner(url);
// Saída: [{ generated_text: 'uma praia com areia branca e mar azul' }]
```

#### 🌍 Tradução Multilíngue

```javascript
const translator = await pipeline(
    'translation',
    'Xenova/nllb-200-distilled-600M'
);

const result = await translator('Hello, how are you?', {
    src_lang: 'eng_Latn',
    tgt_lang: 'por_Latn'
});
// Saída: [{ translation_text: 'Olá, como você está?' }]
```

#### 🔊 Text-to-Speech (Síntese de Fala)

```javascript
const synthesizer = await pipeline(
    'text-to-speech',
    'Xenova/speecht5_tts',
    { quantized: false }
);

const result = await synthesizer('Olá, como você está?', {
    speaker_embeddings: 'speaker_embeddings.bin'
});
// Resultado: áudio WAV que pode ser reproduzido no browser
```

**Vantagens:**

- ✅ Roda 100% no browser (sem servidor necessário)
- ✅ Não precisa de GPU
- ✅ API similar ao Hugging Face Transformers (Python)
- ✅ Suporte a Web Workers para não bloquear a UI

---

### 2. ONNX Runtime

*Engine de inferência otimizada para modelos ONNX.*

**Características importantes:**

```python
import onnxruntime as rt

# Configurar para CPU (sem GPU)
session = rt.InferenceSession(
    "model.onnx",
    providers=['CPUExecutionProvider']
)

# Rodar inferência
ort_outputs = session.run(None, ort_inputs)
```

**Vantagens:**

- ✅ Performance otimizada em CPU
- ✅ Cross-platform (Windows, Linux, macOS)
- ✅ Suporte a múltiplos frameworks (PyTorch, TensorFlow, etc.)
- ✅ Uso eficiente de memória

---

### 3. Hugging Face Hub

*Repositório de modelos pré-treinados.*

**Modelos relevantes para o projeto:**

| Tarefa | Modelo Sugerido | Tamanho |
|--------|----------------|---------|
| Image Captioning | `Xenova/vit-gpt2-image-captioning` | ~300MB |
| Tradução | `Xenova/nllb-200-distilled-600M` | ~600MB |
| Text-to-Speech | `Xenova/speecht5_tts` | ~200MB |

---

## 🏗️ Arquitetura Esperada do Projeto

```plaintext
┌─────────────────────────────────────────┐
│  Frontend (React)                       │
│  - Upload de imagem                     │
│  - Exibição de resultados               │
│  - Player de áudio                      │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Transformers.js (JavaScript)           │
│  1. Image → Legendas (inglês)           │
│  2. Tradução (inglês → português)       │
│  3. Texto → Áudio (síntese de fala)     │
└─────────────────────────────────────────┘
```

---

## 🎓 Aprendizados Esperados

1. **Hospedar e executar modelos de IA** em ambientes com recursos limitados.
2. **Otimizar inferência** sem GPU.
3. **Integrar modelos** em aplicações web modernas.
4. **Balancear trade-offs** entre qualidade, velocidade e recursos.

---

## 📦 Setup Inicial Recomendado

```bash
# Instalar Transformers.js
npm install @huggingface/transformers

# Para desenvolvimento React
npm create vite@latest meu-projeto -- --template react
cd meu-projeto
npm install @huggingface/transformers
```

---

Este projeto demonstra como **democratizar IA** ao permitir que modelos avançados rodem em hardware comum, tornando a tecnologia mais acessível e prática para desenvolvedores. 🚀
