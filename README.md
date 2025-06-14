# 🚀 Kanban Board - Drag & Drop Task Manager

Um Kanban Board moderno e interativo construído com React, TypeScript, Tailwind CSS e dnd-kit. Este projeto oferece uma experiência completa de gerenciamento de tarefas com funcionalidade de arrastar e soltar, interface responsiva e código bem estruturado.

![Kanban Board Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Kanban+Board+Preview)

## ✨ Funcionalidades

### 🎯 Principais
- **Drag & Drop Intuitivo**: Arraste cards entre colunas e reordene facilmente
- **Gerenciamento de Colunas**: Adicione, edite e remova colunas dinamicamente
- **Gerenciamento de Cards**: Crie, edite e exclua cards com título e descrição
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Modo Escuro**: Suporte completo para tema escuro/claro
- **Animações Suaves**: Transições e feedback visual durante interações

### 🛠️ Técnicas
- **TypeScript**: Type safety completo em todo o projeto
- **React Hooks**: Gerenciamento de estado moderno e eficiente
- **dnd-kit**: Biblioteca robusta para drag and drop
- **Tailwind CSS**: Estilização utilitária e responsiva
- **shadcn/ui**: Componentes UI modernos e acessíveis

## 🏗️ Arquitetura do Projeto

```
kanban-board/
├── public/
│   └── index.html                 # Página HTML principal
├── src/
│   ├── components/               # Componentes React
│   │   ├── Board/
│   │   │   └── Board.tsx        # Componente principal do board
│   │   ├── Column/
│   │   │   └── Column.tsx       # Componente de coluna
│   │   ├── Card/
│   │   │   └── Card.tsx         # Componente de card
│   │   └── ui/                  # Componentes UI (shadcn/ui)
│   ├── hooks/
│   │   └── useDragAndDrop.ts    # Hook personalizado para D&D
│   ├── types/
│   │   └── index.ts             # Definições TypeScript
│   ├── utils/
│   │   └── helpers.ts           # Funções utilitárias
│   ├── App.tsx                  # Componente raiz
│   ├── App.css                  # Estilos globais
│   ├── index.tsx                # Ponto de entrada
│   └── index.css                # Estilos base
├── package.json                 # Dependências e scripts
├── tsconfig.json               # Configuração TypeScript
├── tailwind.config.js          # Configuração Tailwind
├── vite.config.js              # Configuração Vite
└── README.md                   # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd kanban-board
```

2. **Instale as dependências**
```bash
# Com npm
npm install

# Com pnpm (recomendado)
pnpm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
# Com npm
npm run dev

# Com pnpm
pnpm run dev
```

4. **Acesse a aplicação**
Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev          # Inicia servidor de desenvolvimento
pnpm run dev --host   # Inicia servidor acessível na rede

# Build
pnpm run build        # Gera build de produção
pnpm run preview      # Preview do build de produção

# Qualidade de código
pnpm run lint         # Executa ESLint
pnpm run type-check   # Verifica tipos TypeScript
```

## 🎮 Como Usar

### Operações Básicas

#### 📝 Gerenciar Cards
- **Criar**: Clique em "Adicionar um card" em qualquer coluna
- **Editar**: Clique no ícone de edição (✏️) no card
- **Excluir**: Clique no ícone de lixeira (🗑️) no card
- **Mover**: Arraste o card para outra coluna ou posição

#### 📊 Gerenciar Colunas
- **Criar**: Clique em "Adicionar Coluna" à direita do board
- **Editar**: Clique no menu (⋮) no cabeçalho da coluna
- **Excluir**: Use o menu da coluna > "Excluir"
- **Reordenar**: Arraste o cabeçalho da coluna

### Atalhos de Teclado
- **Enter**: Confirma edição/criação
- **Escape**: Cancela edição/criação
- **Tab**: Navega entre elementos

## 🧩 Componentes Principais

### Board.tsx
Componente raiz que gerencia o estado global do Kanban e coordena todas as operações.

**Principais responsabilidades:**
- Gerenciamento do estado do board
- Coordenação do drag and drop
- Adição/remoção de colunas

### Column.tsx
Representa uma coluna individual no board.

**Principais responsabilidades:**
- Renderização de cards
- Zona de drop para cards
- Gerenciamento de cards da coluna

### Card.tsx
Representa um item/tarefa individual.

**Principais responsabilidades:**
- Exibição de informações do card
- Edição inline
- Funcionalidade de drag

### useDragAndDrop.ts
Hook personalizado que encapsula toda a lógica de drag and drop.

**Principais responsabilidades:**
- Gerenciamento de eventos de drag
- Validação de drops
- Atualizações de estado

## 🔧 Tecnologias Utilizadas

### Core
- **React 18**: Biblioteca principal para UI
- **TypeScript**: Superset do JavaScript com tipagem estática
- **Vite**: Build tool moderna e rápida

### UI & Styling
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI modernos
- **Lucide React**: Ícones SVG

### Drag & Drop
- **@dnd-kit/core**: Core da biblioteca de drag and drop
- **@dnd-kit/sortable**: Funcionalidades de ordenação
- **@dnd-kit/utilities**: Utilitários para transformações

### Development
- **ESLint**: Linting de código
- **PostCSS**: Processamento de CSS
- **Autoprefixer**: Prefixos CSS automáticos

## 🎨 Personalização

### Temas
O projeto suporta modo escuro/claro através das classes do Tailwind:
```css
/* Modo claro (padrão) */
.bg-white .text-gray-900

/* Modo escuro */
.dark .bg-gray-800 .dark:text-gray-100
```

### Cores
Personalize as cores editando o arquivo `src/App.css`:
```css
:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  /* ... outras variáveis */
}
```

### Componentes
Todos os componentes são modulares e podem ser facilmente customizados:
- Modifique estilos em cada componente
- Adicione novas props conforme necessário
- Estenda funcionalidades através dos hooks

## 🔄 Fluxo de Dados

```mermaid
graph TD
    A[App.tsx] --> B[Board.tsx]
    B --> C[Column.tsx]
    C --> D[Card.tsx]
    B --> E[useDragAndDrop.ts]
    E --> F[utils/helpers.ts]
    F --> G[types/index.ts]
```

1. **App.tsx**: Mantém o estado global do board
2. **Board.tsx**: Coordena operações e renderiza colunas
3. **Column.tsx**: Gerencia cards individuais
4. **Card.tsx**: Componente leaf para exibição
5. **useDragAndDrop.ts**: Lógica de drag and drop
6. **helpers.ts**: Funções utilitárias para manipulação de dados

## 🧪 Testes

### Testes Manuais Realizados
- ✅ Criação e edição de cards
- ✅ Criação e edição de colunas  
- ✅ Drag and drop de cards entre colunas
- ✅ Reordenação de cards na mesma coluna
- ✅ Reordenação de colunas
- ✅ Responsividade em diferentes tamanhos de tela
- ✅ Funcionalidade de teclado (Enter/Escape)

### Executar Testes
```bash
# Testes unitários (quando implementados)
pnpm run test

# Testes E2E (quando implementados)  
pnpm run test:e2e
```

## 🚀 Deploy

### Build de Produção
```bash
pnpm run build
```

### Deploy Estático
O projeto pode ser deployado em qualquer serviço de hosting estático:
- **Vercel**: `vercel --prod`
- **Netlify**: Arraste a pasta `dist` para o Netlify
- **GitHub Pages**: Configure GitHub Actions

### Variáveis de Ambiente
Crie um arquivo `.env` para configurações específicas:
```env
VITE_APP_TITLE=Meu Kanban Board
VITE_API_URL=https://api.exemplo.com
```

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para type safety
- Siga as convenções do ESLint
- Adicione comentários JSDoc para funções públicas
- Mantenha componentes pequenos e focados
- Use hooks personalizados para lógica complexa

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



