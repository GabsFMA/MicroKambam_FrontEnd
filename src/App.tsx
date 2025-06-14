/**
 * Componente principal da aplicação Kanban Board
 * 
 * Este arquivo configura o estado global da aplicação e renderiza
 * o board principal com dados de exemplo.
 */

import React, { useState } from 'react';
import { Board } from './components/Board/Board';
import { Board as BoardType } from './types';
import { createSampleBoard } from './utils/helpers';
import './App.css';

function App() {
  // Estado do board com dados de exemplo
  const [board, setBoard] = useState<BoardType>(() => createSampleBoard());

  /**
   * Atualiza o estado do board
   */
  const handleUpdateBoard = (updatedBoard: BoardType) => {
    setBoard(updatedBoard);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Board 
        board={board} 
        onUpdateBoard={handleUpdateBoard} 
      />
    </div>
  );
}

export default App;
