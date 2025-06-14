/**
 * Componente Board - Componente principal do Kanban Board
 * 
 * Este componente gerencia o estado global do board, implementa a lógica
 * de drag and drop entre colunas e cards, e coordena todas as operações
 * do Kanban.
 */

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Board as BoardType, Column as ColumnType } from '../../types';
import { Column } from '../Column/Column';
import { Card } from '../Card/Card';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { createColumn } from '../../utils/helpers';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

interface BoardProps {
  /** Dados do board */
  board: BoardType;
  /** Callback para atualizar o board */
  onUpdateBoard: (board: BoardType) => void;
}

export const Board: React.FC<BoardProps> = ({ board, onUpdateBoard }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // Hook personalizado para drag and drop
  const {
    activeCard,
    activeColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragAndDrop({ board, onUpdateBoard });

  // Configuração dos sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mínimo de 8px de movimento para iniciar o drag
      },
    })
  );

  /**
   * Adiciona uma nova coluna
   */
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = createColumn(newColumnTitle.trim());
      const updatedBoard = {
        ...board,
        columns: [...board.columns, newColumn],
      };
      onUpdateBoard(updatedBoard);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  /**
   * Cancela a adição de nova coluna
   */
  const handleCancelAddColumn = () => {
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  /**
   * Atualiza uma coluna específica
   */
  const handleUpdateColumn = (updatedColumn: ColumnType) => {
    const updatedColumns = board.columns.map(column =>
      column.id === updatedColumn.id ? updatedColumn : column
    );
    onUpdateBoard({
      ...board,
      columns: updatedColumns,
    });
  };

  /**
   * Remove uma coluna
   */
  const handleDeleteColumn = (columnId: string) => {
    const updatedColumns = board.columns.filter(column => column.id !== columnId);
    onUpdateBoard({
      ...board,
      columns: updatedColumns,
    });
  };

  /**
   * Manipula teclas para ações rápidas
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddColumn();
    } else if (e.key === 'Escape') {
      handleCancelAddColumn();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Cabeçalho do Board */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {board.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {board.columns.length} colunas • {board.columns.reduce((acc, col) => acc + col.cards.length, 0)} cards
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>

      {/* Área principal do Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 p-6 h-full">
            {/* Colunas existentes */}
            <SortableContext items={board.columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
              {board.columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  onUpdateColumn={handleUpdateColumn}
                  onDeleteColumn={handleDeleteColumn}
                />
              ))}
            </SortableContext>

            {/* Formulário para adicionar nova coluna */}
            {isAddingColumn ? (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 w-80 flex-shrink-0">
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Digite o nome da coluna..."
                  className="w-full px-3 py-2 text-sm font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddColumn}
                    className="flex-1"
                  >
                    Adicionar Coluna
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelAddColumn}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ) : (
              /* Botão para adicionar nova coluna */
              <Button
                variant="outline"
                onClick={() => setIsAddingColumn(true)}
                className="w-80 h-12 flex-shrink-0 border-dashed border-2 hover:border-solid"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Coluna
              </Button>
            )}
          </div>

          {/* Overlay para mostrar o item sendo arrastado */}
          <DragOverlay>
            {activeCard && (
              <Card
                card={activeCard}
                onUpdateCard={() => {}}
                onDeleteCard={() => {}}
              />
            )}
            {activeColumn && (
              <Column
                column={activeColumn}
                onUpdateColumn={() => {}}
                onDeleteColumn={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

