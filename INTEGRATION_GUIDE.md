# 📋 Guia de Integração e Estrutura do Código

Este documento fornece informações detalhadas sobre a estrutura do código, padrões utilizados e como integrar o Kanban Board em outros projetos.

## 🏗️ Arquitetura Detalhada

### Padrões de Design Utilizados

#### 1. Component Composition
Cada componente é responsável por uma única funcionalidade:
- **Board**: Orquestração geral
- **Column**: Gerenciamento de uma coluna específica  
- **Card**: Representação de um item individual

#### 2. Custom Hooks
Lógica complexa é extraída para hooks reutilizáveis:
- **useDragAndDrop**: Encapsula toda a lógica de drag and drop

#### 3. Type Safety
TypeScript é usado extensivamente para garantir type safety:
- Interfaces bem definidas para todos os dados
- Props tipadas para todos os componentes
- Funções utilitárias com tipos explícitos

## 📁 Estrutura de Arquivos Detalhada

### `/src/types/index.ts`
Define todas as interfaces e tipos utilizados no projeto:

```typescript
// Principais interfaces
interface Card {
  id: string;
  title: string;
  description?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
  color?: string;
  limit?: number;
}

interface Board {
  id: string;
  title: string;
  columns: Column[];
  createdAt?: Date;
  updatedAt?: Date;
}
```

### `/src/utils/helpers.ts`
Funções utilitárias para manipulação de dados:

```typescript
// Principais funções
generateId(): string                    // Gera IDs únicos
createCard(title, description): Card    // Cria novo card
createColumn(title, cards): Column      // Cria nova coluna
createBoard(title, columns): Board     // Cria novo board
moveCard(board, cardId, ...): Board    // Move card entre colunas
reorderCards(board, ...): Board        // Reordena cards
reorderColumns(board, ...): Board      // Reordena colunas
```

### `/src/hooks/useDragAndDrop.ts`
Hook personalizado para gerenciar drag and drop:

```typescript
interface UseDragAndDropReturn {
  activeCard: Card | null;
  activeColumn: Column | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}
```

## 🔧 Como Integrar em Outros Projetos

### 1. Instalação das Dependências

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install lucide-react
```

### 2. Configuração do Tailwind CSS

Adicione ao seu `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Configurações personalizadas
    },
  },
  plugins: [],
}
```

### 3. Copiando Componentes

#### Opção A: Cópia Completa
Copie toda a pasta `src/components` para seu projeto.

#### Opção B: Componentes Específicos
Copie apenas os componentes necessários:

```bash
# Estrutura mínima
src/
├── components/
│   ├── Board/Board.tsx
│   ├── Column/Column.tsx
│   └── Card/Card.tsx
├── types/index.ts
├── utils/helpers.ts
└── hooks/useDragAndDrop.ts
```

### 4. Adaptação para Seu Projeto

#### Modificando Tipos
Estenda as interfaces conforme suas necessidades:

```typescript
interface ExtendedCard extends Card {
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags?: string[];
}
```

#### Integrando com API
Modifique as funções utilitárias para trabalhar com sua API:

```typescript
// Exemplo de integração com API
export const saveBoard = async (board: Board): Promise<Board> => {
  const response = await fetch('/api/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(board),
  });
  return response.json();
};
```

#### Customizando Estilos
Modifique as classes Tailwind nos componentes:

```typescript
// Exemplo de customização de cores
const cardClasses = `
  bg-white dark:bg-gray-800 
  border-l-4 border-blue-500  // Borda colorida
  shadow-lg hover:shadow-xl   // Sombra mais pronunciada
  rounded-lg p-4 mb-3
`;
```

## 🎨 Customização Avançada

### Temas Personalizados

#### 1. Variáveis CSS Customizadas
Adicione ao seu CSS:

```css
:root {
  --kanban-primary: #3b82f6;
  --kanban-secondary: #64748b;
  --kanban-success: #10b981;
  --kanban-warning: #f59e0b;
  --kanban-danger: #ef4444;
}
```

#### 2. Classes Tailwind Personalizadas
Estenda o Tailwind config:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        kanban: {
          primary: 'var(--kanban-primary)',
          secondary: 'var(--kanban-secondary)',
          // ... outras cores
        }
      }
    }
  }
}
```

### Funcionalidades Adicionais

#### 1. Persistência de Dados
Adicione localStorage ou integração com banco de dados:

```typescript
// Hook para persistência
const usePersistedBoard = (initialBoard: Board) => {
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem('kanban-board');
    return saved ? JSON.parse(saved) : initialBoard;
  });

  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(board));
  }, [board]);

  return [board, setBoard];
};
```

#### 2. Filtros e Busca
Adicione funcionalidades de filtro:

```typescript
const useFilteredCards = (cards: Card[], filter: string) => {
  return useMemo(() => {
    if (!filter) return cards;
    return cards.filter(card => 
      card.title.toLowerCase().includes(filter.toLowerCase()) ||
      card.description?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [cards, filter]);
};
```

#### 3. Notificações
Integre com bibliotecas de notificação:

```typescript
import { toast } from 'react-hot-toast';

const handleCardMove = (card: Card, fromColumn: string, toColumn: string) => {
  // Lógica de movimento
  toast.success(`Card "${card.title}" movido para ${toColumn}`);
};
```

## 🔍 Debugging e Troubleshooting

### Problemas Comuns

#### 1. Drag and Drop Não Funciona
- Verifique se o `DndContext` está envolvendo os componentes
- Confirme se os `useSortable` e `useDroppable` estão configurados corretamente
- Verifique se os IDs são únicos

#### 2. Estilos Não Aplicados
- Confirme se o Tailwind CSS está configurado corretamente
- Verifique se as classes estão sendo purgadas incorretamente
- Teste com classes inline primeiro

#### 3. TypeScript Errors
- Verifique se todas as interfaces estão importadas
- Confirme se os tipos estão sendo passados corretamente
- Use `any` temporariamente para isolar problemas

### Debug Tools

#### 1. React Developer Tools
Use para inspecionar o estado dos componentes:
```typescript
// Adicione para debug
console.log('Board state:', board);
console.log('Active card:', activeCard);
```

#### 2. dnd-kit Debug
Ative logs do dnd-kit:
```typescript
<DndContext
  onDragStart={(event) => {
    console.log('Drag start:', event);
    handleDragStart(event);
  }}
  // ... outros props
>
```

## 📊 Performance

### Otimizações Implementadas

#### 1. React.memo
Componentes são memoizados quando apropriado:
```typescript
export const Card = React.memo<CardProps>(({ card, onUpdateCard, onDeleteCard }) => {
  // ... implementação
});
```

#### 2. useCallback
Callbacks são memoizados:
```typescript
const handleUpdateCard = useCallback((updatedCard: Card) => {
  // ... implementação
}, [column.cards]);
```

#### 3. useMemo
Computações caras são memoizadas:
```typescript
const sortedCards = useMemo(() => {
  return cards.sort((a, b) => a.title.localeCompare(b.title));
}, [cards]);
```

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 Testes

### Estrutura de Testes Recomendada

```
src/
├── __tests__/
│   ├── components/
│   │   ├── Board.test.tsx
│   │   ├── Column.test.tsx
│   │   └── Card.test.tsx
│   ├── hooks/
│   │   └── useDragAndDrop.test.ts
│   └── utils/
│       └── helpers.test.ts
```

### Exemplos de Testes

#### Teste de Componente
```typescript
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

test('renders card with title', () => {
  const mockCard = {
    id: '1',
    title: 'Test Card',
    description: 'Test Description'
  };
  
  render(<Card card={mockCard} onUpdateCard={jest.fn()} onDeleteCard={jest.fn()} />);
  
  expect(screen.getByText('Test Card')).toBeInTheDocument();
});
```

#### Teste de Hook
```typescript
import { renderHook } from '@testing-library/react';
import { useDragAndDrop } from '../useDragAndDrop';

test('handles drag start correctly', () => {
  const mockBoard = { /* ... */ };
  const mockOnUpdate = jest.fn();
  
  const { result } = renderHook(() => 
    useDragAndDrop({ board: mockBoard, onUpdateBoard: mockOnUpdate })
  );
  
  // ... testes específicos
});
```

## 🚀 Deploy e CI/CD

### GitHub Actions
Exemplo de workflow:

```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
```

### Docker
Dockerfile para containerização:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

Este guia fornece uma base sólida para integrar e customizar o Kanban Board em qualquer projeto React/TypeScript. Para dúvidas específicas, consulte a documentação das bibliotecas utilizadas ou abra uma issue no repositório.

