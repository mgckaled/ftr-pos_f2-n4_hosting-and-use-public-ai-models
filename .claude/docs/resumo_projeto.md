# Hospedagem e uso de modelos públicos de IA

**Objetivo Principal deste repositório**: Repositório pessoal de registro, referência e suporte para fins de aprendizado, consulta e acompanhamento da disciplina de Hospedagem e uso de modelos públicos de IA (Nível 4), Fase 2 (Estratégia e Inovação), do curso de Pós-Graduação Tech Developer 360, desenvolvido pela Faculdade de Tecnologia Rocketseat (FTR).

## Resumo Básico da Disciplina

Nesta disciplina, falaremos sobre o uso e a hospedagem de modelos públicos de IA. O conteúdo está dividido em duas partes: uma teórica, onde abordaremos conceitos básicos e trade-offs dos modelos, e outra prática, focada em um projeto real. Vamos usar JavaScript, React e Node, além de um pouco de Python. O projeto envolve geração de legendas, tradução e síntese de fala a partir de imagens. O objetivo é que você consiga rodar tudo em um computador comum, sem necessidade de GPU.

Conteúdo:

- 4 blocos:
  - A - Modelos Públicos (13 viodeaulas)
  - B - Criando Legendas para Imagens (6 viodeaulas)
  - C - Traduzindo Legendas (6 viodeaulas)
  - D - Sintetização de Áudios (8 viodeaulas)

Resumo da Ementa em 3 partes:

1. Conceitos básicos: O que são modelos públicos de IA? Porque usar modelos públicos? Como usar modelos públicos? Como escolher um modelo? Introdução à biblioteca Transformers.

2. Projetos Práticos

- Stack: Vscode, Javascript, React, Node, Python, Transformers(pacote)
- Tarefas de IA: Geração de Legenda, Síntese de fala
- Tipos de Execução: Browser vs. servidor
  
## Bloco A - Modelos Públicos

### 1. O Que São Modelos Públicos?

Nesta aula, discutimos o que são modelos públicos de IA e sua importância. Esses modelos são pré-treinados, o que significa que já passaram por um intenso processo de aprendizado, exigindo grande capacidade de processamento e dados. Embora sejam abertos para uso, isso não garante transparência total, pois a metodologia, o código e os dados de treinamento nem sempre são divulgados. Também abordamos a diferença entre modelos abertos e open source, destacando as restrições que podem existir. Modelos públicos são ótimos para aprendizado e testes, pois já estão prontos para uso.

### 2. Por Que Usar Modelos Públicos

Nesta aula, discutimos as vantagens e desvantagens de usar modelos públicos de IA em comparação com APIs, como a do ChatGPT. Abordei a importância do controle, customização e governança ao rodar um modelo localmente, destacando a transparência no processamento e a segurança dos dados. Também mencionei os trade-offs, como a possível performance inferior dos modelos públicos e a necessidade de hardware especializado. É fundamental considerar esses aspectos ao decidir entre usar uma API ou um modelo público.

### 3. Como Usar Modelos Públicos

Nesta aula, vamos explorar como utilizar modelos de IA, especialmente através da biblioteca Transformers da Hugging Face. Discutimos como esses modelos são distribuídos, seja por links diretos ou em repositórios públicos, facilitando o acesso. A Hugging Face é uma plataforma rica em modelos abertos, onde você pode filtrar e encontrar opções específicas, como para perguntas e respostas. Vamos nos aprofundar em como instalar e usar esses modelos ao longo do módulo, aproveitando a vasta gama de recursos disponíveis.

### 4. Escolhendo Modelos - Parte 1

Na aula de hoje, vamos explorar como escolher o modelo ideal para sua aplicação, começando pelo Hugging Face, que oferece uma vasta gama de opções. Com mais de 1.600.000 modelos disponíveis, a seleção pode ser desafiadora. Embora você possa buscar recomendações no Google ou no ChatGPT, isso não garante que os modelos sugeridos atendam às suas necessidades específicas. Vamos discutir como filtrar por atualizações recentes e quais critérios considerar, como as restrições da sua aplicação e a qualidade dos modelos.

### 5. Escolhendo Modelos - Parte 2

Nesta aula, discutimos as restrições ao escolher um modelo de inteligência artificial para sua aplicação. É crucial entender a tarefa que o modelo deve realizar, pois nem todos são adequados para todas as funções, como gerar texto, imagens ou áudio. Utilizamos a plataforma Hugging Face para explorar diferentes tarefas e modelos disponíveis, considerando também a linguagem e o suporte a frameworks como JavaScript. Isso ajuda a afunilar as opções e encontrar o modelo ideal para suas necessidades.

### 6. Escolhendo Modelos - Parte 3

Nesta aula, discutimos a importância do tamanho dos modelos de IA, especialmente em cenários com recursos limitados. Modelos grandes exigem muita memória e processamento, o que pode ser inviável para aplicações que precisam de respostas rápidas, como chats. Abordamos como o número de parâmetros influencia o tamanho do modelo e a técnica de quantização, que reduz o tamanho dos parâmetros, permitindo que modelos maiores sejam executados em máquinas com menos recursos, embora isso possa impactar a precisão e a performance.

### 7. Escolhendo Modelos - Parte 4

Na aula de hoje, discutimos como avaliar a qualidade de modelos de IA, mesmo após atender às restrições da aplicação. Abordamos a importância de considerar fatores como o usuário que fez o upload do modelo e o número de downloads. Modelos de empresas reconhecidas, como Meta e NVIDIA, geralmente são mais confiáveis. Além disso, um alto número de downloads pode indicar que um modelo é popular e, possivelmente, eficaz, mesmo que não seja conhecido. Vamos explorar essas métricas para fazer escolhas mais informadas.

### 8. Escolhendo Modelos - Parte 5

Nesta aula, discutimos como escolher modelos de IA, focando em aspectos subjetivos que podem influenciar sua decisão. Abordei a importância dos nomes dos modelos, que indicam tamanho e velocidade, e como o fine-tuning pode afetar a performance. Também falamos sobre diferentes arquiteturas, como modelos destilados e a técnica de mixture of experts. Por fim, mencionei a cautela ao usar modelos em preview ou dev, que podem não ser ideais para aplicações sérias.

### 9. Biblioteca Transformers Parte 1

Nesta aula, vamos explorar como utilizar modelos de inteligência artificial com JavaScript, especificamente através da biblioteca Transformers.js. Começamos com um projeto simples no VS Code, onde importamos a biblioteca via CDN. A função pipeline é fundamental, pois transforma texto em vetores numéricos que os modelos entendem. Essa função também facilita a conversão do output de volta para um formato compreensível. Vamos construir juntos um script que simplifica todo esse processo, evitando a necessidade de criar funções complexas manualmente.

### 10. Biblioteca Transformers Parte 2

Nesta aula, exploramos como utilizar a função pipeline do Hugging Face para acessar modelos de inteligência artificial. Falei sobre a importância de escolher a tarefa correta e o modelo adequado, como a geração de texto. Escolhi um modelo pequeno, o HuggingFaceTBSmallLM2, que possui 135 milhões de parâmetros, ideal para rodar no navegador. Também mencionei a quantização e como isso afeta a performance. Por fim, mostrei como capturar o resultado da geração de texto usando promises.

### 11. Biblioteca Transformers Parte 3

Nessa aula, explorei como usar uma função generator para criar texto interativo com um modelo de linguagem. Começamos com um texto inicial, como "once upon a time", e discutimos a importância de escolher o idioma certo, já que o modelo se sai melhor em inglês. Mostrei como a geração de texto é um processo iterativo e como podemos ajustar a aleatoriedade nas respostas. Ao ativar a amostragem, o modelo se torna mais criativo, mas isso pode resultar em respostas inesperadas.

### 12. Biblioteca Transformers Parte 4

Nesta aula, vamos mergulhar em alguns parâmetros essenciais para ajustar a geração de texto da IA. Focamos na temperatura, que regula a criatividade e aleatoriedade do output, e no topK, que limita as opções de palavras. Também discutimos o maxNewTokens, que define o tamanho do texto gerado, considerando custo e tempo de processamento. Esses parâmetros são cruciais para equilibrar criatividade e coerência nas respostas da IA. Explore mais na documentação do Hugging Face para aprofundar seu conhecimento!

### 13. Arquitetura de App IA

Nesta aula, discutimos a arquitetura de aplicações que utilizam modelos de IA, enfatizando a importância de tratá-los como "caixas pretas". Isso significa que a aplicação não deve fazer suposições sobre o funcionamento interno do modelo, apenas interagir através de uma interface bem definida. Abordamos como essa separação permite flexibilidade, facilitando alterações no modelo sem impactar a aplicação. Também exploramos diferentes formas de isolar o modelo, desde funções simples até APIs completas, garantindo que a aplicação permaneça independente de mudanças na lógica do modelo.

## Bloco B - Criando Legendas para Imagens

### 1. Introdução Projeto

Vamos iniciar nosso projeto prático, dividido em três partes. Na primeira, criaremos uma IA para gerar legendas de imagens usando React, onde a execução acontece no navegador do usuário. Na segunda parte, mudaremos para uma stack com Node, focando na tradução de texto, com a IA rodando no backend. Por fim, vamos sintetizar áudio em Python, permitindo que a IA fale as legendas. O objetivo é que você aprenda a criar servidores e containerizar aplicações. Vamos codar!

### 2. Criando App

Na primeira parte do nosso projeto, vamos criar um gerador de legendas para imagens usando React. Começamos configurando o projeto com Vite e inicializando um repositório Git. Após instalar as dependências necessárias, como a biblioteca Transformers da Hugging Face, partimos para a construção da interface. A ideia é ter um campo para inserir a URL da imagem, um botão para gerar a legenda e exibir a imagem com a legenda abaixo. Vamos focar em uma interface simples, mas funcional, para exemplificar o uso dos modelos.

### 3. Criando Hooks

Nessa aula, vamos adicionar novas funcionalidades ao nosso código. Começamos removendo algumas linhas desnecessárias e comitando as alterações para garantir um checkpoint. O objetivo é que, ao inserir um URL em uma caixa de texto, a imagem correspondente apareça, e ao clicar em um botão, o caption mude. Utilizamos o useState para gerenciar o estado da imagem e do caption. Ao final, testamos a funcionalidade com uma imagem de gato e preparamos o terreno para integrar uma IA.

### 4. Criando Interface IA

Nesta aula, vamos construir a interface que se comunica com nosso modelo de geração de legendas. Vamos separar o modelo da aplicação, criando uma pasta chamada "Models" e um arquivo "api.js" para definir a função generateCaption. Essa função receberá a URL da imagem e retornará uma nova legenda. Também discutimos a importância de manter a API isolada, permitindo que testemos a funcionalidade sem depender do modelo. Por fim, vamos implementar o ImageCaptioner, que usará o HuggingFace para gerar as legendas.

### 5. Criando Singleton

Nesta aula, vamos implementar a lógica do nosso modelo de geração de legendas. Focamos na criação de uma classe que se comporta como um singleton, garantindo que a mesma instância do modelo seja reutilizada, evitando carregamentos desnecessários. Discutimos como configurar a função GetCaptioner para carregar o modelo apenas na primeira chamada. Utilizamos o modelo Vite GPT-2 Image Captioning, que é otimizado para converter imagens em texto. Por fim, testamos a funcionalidade com logs para verificar o comportamento do singleton.

### 6. Finalizando Criação de Legendas

Nesta aula, focamos em como gerar legendas para imagens usando um modelo de IA. Começamos implementando a função generateCaption, que utiliza o captioner para criar texto a partir de uma imagem. Abordamos a importância de definir o quantizador para otimizar a performance no navegador. Também discutimos como lidar com a geração de texto repetido e a necessidade de feedback visual para o usuário. Por fim, testamos a aplicação com diferentes imagens e planejamos traduzir as legendas para o português e convertê-las em áudio.

## Bloco C - Traduzindo Legendas

- [ ] Criar Projeto Node
- [ ] Criar servidor HTTP
- [ ] Criar Endpoint
- [ ] Executar modelo de IA
- [ ] Containerizar

## Bloco D - Criando Server Python

### 1. Criando Server Python

Na última parte do nosso projeto, vamos explorar a sintetização de áudio com Python, transformando texto em áudio usando inteligência artificial. Começamos criando um projeto com a ferramenta UV, que é rápida e fácil de usar. Em seguida, configuramos um servidor HTTP com Flask, semelhante ao que fizemos com o Express no Node. Criamos um endpoint simples que retorna "hello" e testamos o servidor. Agora, estamos prontos para avançar e criar novos endpoints.

## 2. Criando Endpoints - Parte 1

Agora que temos nosso servidor em Python rodando, vamos criar endpoints para conectar o front-end. A ideia é que, ao invés de retornar o áudio diretamente, o servidor vai salvar o resultado e fornecer um URL para o aplicativo acessar. Vamos implementar dois endpoints: um para converter texto em áudio, que retornará um URL, e outro para obter o áudio a partir desse URL. Vou mostrar como configurar isso no Flask e testar as rotas. Vamos lá!

## 3. Criando Endpoints - Parte 2

Nesta aula, continuamos a implementação dos nossos endpoints, focando na geração de URLs e na síntese de áudio. Começamos criando a estrutura de pastas, incluindo um modelo para conversão de texto em áudio. Implementamos funções para converter texto em áudio e salvar o arquivo gerado, utilizando a biblioteca `uuid` para garantir que cada arquivo tenha um nome único. Também testamos o endpoint para garantir que tudo funcionasse corretamente, incluindo a recuperação de arquivos de áudio.

## 4. Criando Pipeline

Nesta aula, vamos implementar um modelo que converte texto em áudio usando a biblioteca Transformers. Começamos instalando a biblioteca e, em seguida, criamos um pipeline personalizado para otimizar a conversão, já que o modelo padrão é pesado e lento. Vamos usar o modelo Bark, importando o autoprocessor e o modelo diretamente. Também faremos ajustes para garantir que a voz gerada seja em português brasileiro. Ao final, teremos uma função que conecta tudo, permitindo a conversão eficiente de texto em áudio.

## 5. Executando Modelo

Agora que temos nosso modelo pronto, precisamos salvar o áudio gerado. Já implementamos a chamada do modelo pela API e agora vamos focar na função saveAudio. Usaremos a biblioteca SciPy para salvar o arquivo de áudio. Durante os testes, encontramos um erro de formato, mas conseguimos resolver convertendo a saída do modelo para um formato compatível. No final, o áudio foi salvo com sucesso e agora só falta integrar tudo com o front-end.

## 6. Conectando Frontend

Nesta aula, vamos integrar o front-end com o back-end, focando na implementação de um player de áudio. Começamos adicionando uma tag de áudio no app.jsx, utilizando useState para gerenciar a fonte do áudio. Testamos com um URL específico e, após verificar que o áudio carrega corretamente, discutimos como atualizar a fonte dinamicamente usando useEffect. Também abordamos a necessidade de pausar o áudio atual antes de carregar um novo. Ao final, tudo parece estar funcionando bem!

## 7. Chamando Backend

Nesta aula, vamos criar uma função chamada convertToAudio, que se conecta a um endpoint na porta 5000 para transformar texto em áudio. Alteramos o servidor para responder em JSON e ajustamos a estrutura dos dados. Também implementamos o suporte a cross-origin no Flask para evitar erros. Testamos a funcionalidade com um exemplo simples e, ao final, integramos tudo para gerar áudio a partir de uma imagem. Por fim, discutimos a containerização da aplicação em Python.

## 8. Containerizando App Python

Nesta aula, finalizei a containerização da nossa aplicação em Python, seguindo um processo semelhante ao que fizemos com Node. Iniciamos com o comando docker init, escolhemos a versão 3.13 e ajustamos o comando de inicialização para uv run. Fizemos algumas alterações no Dockerfile, como a instalação do UV de outra imagem e a configuração do Flask para aceitar conexões externas. Após rodar o servidor, testamos a funcionalidade de tradução de áudio. Agora, temos várias possibilidades de melhorias e expansões para o projeto!
