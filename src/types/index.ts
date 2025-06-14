/**
 * Tipos TypeScript para o Kanban Board
 * 
 * Este arquivo define as interfaces e tipos utilizados em todo o projeto
 * para garantir type safety e melhor experiência de desenvolvimento.
 */

/**
 * Representa um card/tarefa individual no Kanban
 */
export interface Card {
  /** Identificador único do card */
  id: string;
  /** Título do card */
  title: string;
  /** Descrição opcional do card */
  description?: string;
  /** Cor opcional para categorização visual */
  color?: string;
  /** Data de criação */
  createdAt?: Date;
  /** Data de atualização */
  updatedAt?: Date;
}

/**
 * Representa uma coluna no Kanban Board
 */
export interface Column {
  /** Identificador único da coluna */
  id: string;
  /** Título da coluna (ex: "To Do", "In Progress", "Done") */
  title: string;
  /** Array de cards contidos nesta coluna */
  cards: Card[];
  /** Cor opcional da coluna */
  color?: string;
  /** Limite máximo de cards (opcional) */
  limit?: number;
}

/**
 * Representa o board completo do Kanban
 */
export interface Board {
  /** Identificador único do board */
  id: string;
  /** Título do board */
  title: string;
  /** Array de colunas do board */
  columns: Column[];
  /** Data de criação */
  createdAt?: Date;
  /** Data de atualização */
  updatedAt?: Date;
}

/**
 * Tipos para eventos de drag and drop
 */
export interface DragStartEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: 'card' | 'column';
        card?: Card;
        column?: Column;
      };
    };
  };
}

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: 'card' | 'column';
        card?: Card;
        column?: Column;
      };
    };
  };
  over?: {
    id: string;
    data: {
      current?: {
        type: 'card' | 'column';
        accepts?: string[];
      };
    };
  } | null;
}

/**
 * Props para componentes
 */
export interface BoardProps {
  board: Board;
  onUpdateBoard: (board: Board) => void;
}

export interface ColumnProps {
  column: Column;
  onUpdateColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
}

export interface CardProps {
  card: Card;
  onUpdateCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
}

