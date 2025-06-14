/**
 * Tipos TypeScript para o Kanban Board.
 */

/**
 * Representa uma tarefa dentro de um card.
 */
export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

/**
 * Representa um card no Kanban Board.
 */
export interface Card {
  id: string;
  title: string;
  description?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
  startDate?: Date; // Nova propriedade: data de início
  endDate?: Date;   // Nova propriedade: data de fim
  tasks?: Task[];   // Nova propriedade: lista de tarefas
}

/**
 * Representa uma coluna no Kanban Board.
 */
export interface Column {
  id: string;
  title: string;
  cards: Card[];
  color?: string;
  limit?: number;
}

/**
 * Representa o board completo do Kanban.
 */
export interface Board {
  id: string;
  title: string;
  columns: Column[];
  createdAt?: Date;
  updatedAt?: Date;
}


