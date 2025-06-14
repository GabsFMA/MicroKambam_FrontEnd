/**
 * Componente Column - Representa uma coluna no Kanban Board
 * 
 * Este componente renderiza uma coluna que contém cards e pode receber
 * novos cards via drag and drop. Inclui funcionalidades para adicionar,
 * editar e excluir a coluna.
 */

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Card as CardType } from '../../types';
import { Card } from '../Card/Card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit3, MoreVertical } from 'lucide-react';
import { createCard } from '../../utils/helpers';

interface ColumnProps {
  /** Dados da coluna */
  column: ColumnType;
  /** Callback para atualizar a coluna */
  onUpdateColumn: (column: ColumnType) => void;
  /** Callback para deletar a coluna */
  onDeleteColumn: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ column, onUpdateColumn, onDeleteColumn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // Configuração do dnd-kit para tornar a coluna um drop zone
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      accepts: ['card'],
    },
  });

  /**
   * Atualiza o título da coluna
   */
  const handleUpdateTitle = () => {
    if (editTitle.trim()) {
      onUpdateColumn({
        ...column,
        title: editTitle.trim(),
      });
      setIsEditing(false);
    }
  };

  /**
   * Cancela a edição do título
   */
  const handleCancelEdit = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  /**
   * Adiciona um novo card à coluna
   */
  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      const newCard = createCard(newCardTitle.trim());
      onUpdateColumn({
        ...column,
        cards: [...column.cards, newCard],
      });
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  /**
   * Cancela a adição de novo card
   */
  const handleCancelAddCard = () => {
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  /**
   * Atualiza um card específico
   */
  const handleUpdateCard = (updatedCard: CardType) => {
    const updatedCards = column.cards.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    );
    onUpdateColumn({
      ...column,
      cards: updatedCards,
    });
  };

  /**
   * Remove um card da coluna
   */
  const handleDeleteCard = (cardId: string) => {
    const updatedCards = column.cards.filter(card => card.id !== cardId);
    onUpdateColumn({
      ...column,
      cards: updatedCards,
    });
  };

  /**
   * Manipula teclas para ações rápidas
   */
  const handleKeyPress = (e: React.KeyboardEvent, action: 'title' | 'card') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (action === 'title') {
        handleUpdateTitle();
      } else {
        handleAddCard();
      }
    } else if (e.key === 'Escape') {
      if (action === 'title') {
        handleCancelEdit();
      } else {
        handleCancelAddCard();
      }
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 w-80 flex-shrink-0">
      {/* Cabeçalho da coluna */}
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, 'title')}
              className="flex-1 px-2 py-1 text-sm font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              className="h-8 px-2"
            >
              ✕
            </Button>
            <Button
              size="sm"
              onClick={handleUpdateTitle}
              className="h-8 px-2"
            >
              ✓
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {column.title}
              </h2>
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                {column.cards.length}
              </span>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 min-w-32">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit3 className="h-3 w-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDeleteColumn(column.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <Trash2 className="h-3 w-3" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Área de drop para cards */}
      <div
        ref={setNodeRef}
        className={`
          min-h-32 transition-colors duration-200
          ${isOver ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg' : ''}
        `}
      >
        {/* Lista de cards */}
        <SortableContext items={column.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </SortableContext>

        {/* Formulário para adicionar novo card */}
        {isAddingCard ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-3">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, 'card')}
              placeholder="Digite o título do card..."
              className="w-full px-2 py-1 text-sm bg-transparent border-none focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={handleAddCard}
                className="h-7 px-3 text-xs"
              >
                Adicionar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelAddCard}
                className="h-7 px-3 text-xs"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          /* Botão para adicionar novo card */
          <Button
            variant="ghost"
            onClick={() => setIsAddingCard(true)}
            className="w-full justify-start text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar um card
          </Button>
        )}
      </div>

      {/* Informações adicionais da coluna */}
      {column.limit && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Limite: {column.cards.length}/{column.limit}
        </div>
      )}
    </div>
  );
};

