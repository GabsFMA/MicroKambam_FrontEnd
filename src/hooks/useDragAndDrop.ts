/**
 * Hook personalizado para gerenciar a lógica de drag and drop do Kanban
 * 
 * Este hook encapsula toda a lógica complexa de drag and drop,
 * incluindo validações, animações e atualizações de estado.
 */

import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { Board, Card, Column } from '../types';
import { moveCard, reorderCards, reorderColumns, findCardById, findColumnById } from '../utils/helpers';

interface UseDragAndDropProps {
  board: Board;
  onUpdateBoard: (board: Board) => void;
}

interface UseDragAndDropReturn {
  activeCard: Card | null;
  activeColumn: Column | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

export const useDragAndDrop = ({ 
  board, 
  onUpdateBoard 
}: UseDragAndDropProps): UseDragAndDropReturn => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  /**
   * Manipula o início do drag
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'card') {
      setActiveCard(activeData.card);
    } else if (activeData?.type === 'column') {
      setActiveColumn(activeData.column);
    }
  }, []);

  /**
   * Manipula o movimento durante o drag
   * Fornece feedback visual em tempo real
   */
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Drag de card sobre coluna diferente
    if (activeData?.type === 'card' && overData?.type === 'column') {
      const activeCard = activeData.card;
      const overColumnId = over.id as string;
      
      // Encontrar a coluna atual do card
      const cardLocation = findCardById(board, activeCard.id);
      
      if (cardLocation && cardLocation.columnId !== overColumnId) {
        // Mover o card temporariamente para feedback visual
        const updatedBoard = moveCard(
          board,
          activeCard.id,
          cardLocation.columnId,
          overColumnId
        );
        onUpdateBoard(updatedBoard);
      }
    }
  }, [board, onUpdateBoard]);

  /**
   * Manipula o fim do drag
   * Aplica as mudanças finais no estado
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    // Limpar estados ativos
    setActiveCard(null);
    setActiveColumn(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // === DRAG DE CARD ===
    if (activeData?.type === 'card') {
      const activeCard = activeData.card;
      const cardLocation = findCardById(board, activeCard.id);
      
      if (!cardLocation) return;

      const activeColumn = findColumnById(board, cardLocation.columnId);
      if (!activeColumn) return;

      // Drop sobre uma coluna
      if (overData?.type === 'column') {
        const overColumnId = over.id as string;
        const overColumn = findColumnById(board, overColumnId);
        
        if (!overColumn) return;

        // Mover para coluna diferente
        if (activeColumn.id !== overColumn.id) {
          const updatedBoard = moveCard(
            board,
            activeCard.id,
            activeColumn.id,
            overColumn.id
          );
          onUpdateBoard(updatedBoard);
        }
      }
      // Drop sobre outro card
      else if (overData?.type === 'card') {
        const overCard = overData.card;
        const overCardLocation = findCardById(board, overCard.id);
        
        if (!overCardLocation) return;

        const overColumn = findColumnById(board, overCardLocation.columnId);
        if (!overColumn) return;

        // Reordenar na mesma coluna
        if (activeColumn.id === overColumn.id) {
          const activeIndex = activeColumn.cards.findIndex(card => card.id === activeCard.id);
          const overIndex = overColumn.cards.findIndex(card => card.id === overCard.id);
          
          if (activeIndex !== overIndex) {
            const updatedBoard = reorderCards(board, activeColumn.id, activeIndex, overIndex);
            onUpdateBoard(updatedBoard);
          }
        }
        // Mover para coluna diferente na posição específica
        else {
          const overIndex = overColumn.cards.findIndex(card => card.id === overCard.id);
          const updatedBoard = moveCard(
            board,
            activeCard.id,
            activeColumn.id,
            overColumn.id,
            overIndex
          );
          onUpdateBoard(updatedBoard);
        }
      }
    }
    // === DRAG DE COLUNA ===
    else if (activeData?.type === 'column' && overData?.type === 'column') {
      const activeColumnId = active.id as string;
      const overColumnId = over.id as string;
      
      const activeIndex = board.columns.findIndex(col => col.id === activeColumnId);
      const overIndex = board.columns.findIndex(col => col.id === overColumnId);
      
      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        const updatedBoard = reorderColumns(board, activeIndex, overIndex);
        onUpdateBoard(updatedBoard);
      }
    }
  }, [board, onUpdateBoard]);

  return {
    activeCard,
    activeColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

