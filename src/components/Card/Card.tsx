/**
 * Componente Card - Representa um item/tarefa individual no Kanban
 * 
 * Este componente renderiza um card que pode ser arrastado e solto,
 * editado e excluído. Inclui funcionalidades de hover e estados visuais.
 */

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '../../types';
import { Button } from '@/components/ui/button';
import { Trash2, Edit3, GripVertical } from 'lucide-react';

interface CardProps {
  /** Dados do card */
  card: CardType;
  /** Callback para atualizar o card */
  onUpdateCard: (card: CardType) => void;
  /** Callback para deletar o card */
  onDeleteCard: (cardId: string) => void;
}

export const Card: React.FC<CardProps> = ({ card, onUpdateCard, onDeleteCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description || '');

  // Configuração do dnd-kit para tornar o card arrastável
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  // Estilos para animação de drag
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  /**
   * Salva as alterações do card
   */
  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdateCard({
        ...card,
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    }
  };

  /**
   * Cancela a edição e restaura os valores originais
   */
  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDescription(card.description || '');
    setIsEditing(false);
  };

  /**
   * Manipula a tecla Enter para salvar
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-lg p-4 mb-3 
        shadow-sm hover:shadow-md 
        transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        ${isEditing ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {/* Handle para arrastar */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteCard(card.id)}
            className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        /* Modo de edição */
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-2 py-1 text-sm font-medium bg-transparent border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Título do card"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-2 py-1 text-xs bg-transparent border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Descrição (opcional)"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-6 px-2 text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-6 px-2 text-xs"
            >
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        /* Modo de visualização */
        <div>
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
            {card.title}
          </h3>
          {card.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {card.description}
            </p>
          )}
          {card.createdAt && (
            <div className="mt-2 text-xs text-gray-400">
              Criado em {new Date(card.createdAt).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

