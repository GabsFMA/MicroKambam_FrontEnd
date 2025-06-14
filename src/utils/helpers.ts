/**
 * Funções utilitárias para o Kanban Board
 * 
 * Este arquivo contém funções auxiliares para manipulação de dados,
 * geração de IDs únicos e outras operações comuns.
 */

import { Card, Column, Board, Task } from '../types';

/**
 * Gera um ID único usando timestamp e número aleatório
 * @returns string - ID único
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Cria uma nova tarefa com valores padrão
 * @param description - Descrição da tarefa
 * @param completed - Status de conclusão da tarefa
 * @returns Task - Nova tarefa criada
 */
export const createTask = (description: string, completed: boolean = false): Task => {
  return {
    id: generateId(),
    description,
    completed,
  };
};

/**
 * Cria um novo card com valores padrão
 * @param title - Título do card
 * @param description - Descrição opcional do card
 * @param startDate - Data de início opcional do card
 * @param endDate - Data de fim opcional do card
 * @param tasks - Lista de tarefas opcional do card
 * @returns Card - Novo card criado
 */
export const createCard = (title: string, description?: string, startDate?: Date, endDate?: Date, tasks?: Task[]): Card => {
  return {
    id: generateId(),
    title,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    startDate,
    endDate,
    tasks: tasks || [],
  };
};

/**
 * Cria uma nova coluna com valores padrão
 * @param title - Título da coluna
 * @param cards - Array inicial de cards (opcional)
 * @returns Column - Nova coluna criada
 */
export const createColumn = (title: string, cards: Card[] = []): Column => {
  return {
    id: generateId(),
    title,
    cards,
  };
};

/**
 * Cria um novo board com valores padrão
 * @param title - Título do board
 * @param columns - Array inicial de colunas (opcional)
 * @returns Board - Novo board criado
 */
export const createBoard = (title: string, columns: Column[] = []): Board => {
  return {
    id: generateId(),
    title,
    columns,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Encontra uma coluna por ID
 * @param board - Board onde procurar
 * @param columnId - ID da coluna
 * @returns Column | undefined - Coluna encontrada ou undefined
 */
export const findColumnById = (board: Board, columnId: string): Column | undefined => {
  return board.columns.find(column => column.id === columnId);
};

/**
 * Encontra um card por ID em todas as colunas
 * @param board - Board onde procurar
 * @param cardId - ID do card
 * @returns { card: Card, columnId: string } | undefined - Card e coluna onde foi encontrado
 */
export const findCardById = (board: Board, cardId: string): { card: Card; columnId: string } | undefined => {
  for (const column of board.columns) {
    const card = column.cards.find(c => c.id === cardId);
    if (card) {
      return { card, columnId: column.id };
    }
  }
  return undefined;
};

/**
 * Move um card de uma coluna para outra
 * @param board - Board atual
 * @param cardId - ID do card a ser movido
 * @param sourceColumnId - ID da coluna de origem
 * @param targetColumnId - ID da coluna de destino
 * @param targetIndex - Índice de destino na coluna (opcional)
 * @returns Board - Board atualizado
 */
export const moveCard = (
  board: Board,
  cardId: string,
  sourceColumnId: string,
  targetColumnId: string,
  targetIndex?: number
): Board => {
  const newBoard = { ...board };
  const sourceColumn = newBoard.columns.find(col => col.id === sourceColumnId);
  const targetColumn = newBoard.columns.find(col => col.id === targetColumnId);

  if (!sourceColumn || !targetColumn) {
    return board;
  }

  const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
  if (cardIndex === -1) {
    return board;
  }

  // Remove o card da coluna de origem
  const [card] = sourceColumn.cards.splice(cardIndex, 1);
  
  // Atualiza a data de modificação do card
  card.updatedAt = new Date();

  // Adiciona o card na coluna de destino
  if (targetIndex !== undefined) {
    targetColumn.cards.splice(targetIndex, 0, card);
  } else {
    targetColumn.cards.push(card);
  }

  return newBoard;
};

/**
 * Reordena cards dentro de uma coluna
 * @param board - Board atual
 * @param columnId - ID da coluna
 * @param sourceIndex - Índice de origem
 * @param targetIndex - Índice de destino
 * @returns Board - Board atualizado
 */
export const reorderCards = (
  board: Board,
  columnId: string,
  sourceIndex: number,
  targetIndex: number
): Board => {
  const newBoard = { ...board };
  const column = newBoard.columns.find(col => col.id === columnId);

  if (!column || sourceIndex === targetIndex) {
    return board;
  }

  const [card] = column.cards.splice(sourceIndex, 1);
  column.cards.splice(targetIndex, 0, card);

  return newBoard;
};

/**
 * Reordena colunas no board
 * @param board - Board atual
 * @param sourceIndex - Índice de origem
 * @param targetIndex - Índice de destino
 * @returns Board - Board atualizado
 */
export const reorderColumns = (
  board: Board,
  sourceIndex: number,
  targetIndex: number
): Board => {
  const newBoard = { ...board };
  
  if (sourceIndex === targetIndex) {
    return board;
  }

  const [column] = newBoard.columns.splice(sourceIndex, 1);
  newBoard.columns.splice(targetIndex, 0, column);

  return newBoard;
};

/**
 * Dados de exemplo para demonstração
 */
export const createSampleBoard = (): Board => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todoCards = [
    createCard(
      'Implementar autenticação',
      'Adicionar sistema de login e registro',
      today,
      tomorrow,
      [
        createTask('Definir escopo de autenticação'),
        createTask('Configurar Firebase Auth'),
        createTask('Criar tela de login/registro'),
      ]
    ),
    createCard(
      'Criar testes unitários',
      'Escrever testes para os componentes principais',
      today,
      tomorrow,
      [
        createTask('Identificar componentes críticos'),
        createTask('Escrever testes para Card.tsx'),
        createTask('Escrever testes para Column.tsx'),
      ]
    ),
    createCard(
      'Documentar API',
      'Criar documentação completa da API REST',
      today,
      tomorrow,
      [
        createTask('Listar endpoints'),
        createTask('Descrever payloads'),
        createTask('Gerar documentação com Swagger'),
      ]
    ),
  ];

  const inProgressCards = [
    createCard(
      'Desenvolver dashboard',
      'Interface principal do usuário',
      today,
      tomorrow,
      [
        createTask('Desenhar layout'),
        createTask('Implementar componentes de UI'),
        createTask('Integrar com dados de exemplo'),
      ]
    ),
    createCard(
      'Integrar pagamentos',
      'Implementar gateway de pagamento',
      today,
      tomorrow,
      [
        createTask('Escolher provedor de pagamento'),
        createTask('Configurar chaves de API'),
        createTask('Testar fluxo de pagamento'),
      ]
    ),
  ];

  const doneCards = [
    createCard(
      'Setup do projeto',
      'Configuração inicial do ambiente',
      new Date('2025-06-10'),
      new Date('2025-06-10'),
      [
        createTask('Inicializar projeto Vite', true),
        createTask('Instalar dependências', true),
        createTask('Configurar Tailwind CSS', true),
      ]
    ),
    createCard(
      'Design system',
      'Criação dos componentes base',
      new Date('2025-06-05'),
      new Date('2025-06-08'),
      [
        createTask('Definir paleta de cores', true),
        createTask('Criar tipografia', true),
        createTask('Desenvolver componentes básicos', true),
      ]
    ),
  ];

  const columns = [
    createColumn('To Do', todoCards),
    createColumn('In Progress', inProgressCards),
    createColumn('Done', doneCards),
  ];

  return createBoard('Projeto Kanban Board', columns);
};


