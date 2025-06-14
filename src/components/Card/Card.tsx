/**
 * Componente Card - Representa um item/tarefa individual no Kanban
 * 
 * Este componente renderiza um card que pode ser arrastado e solto,
 * editado e excluído. Inclui funcionalidades de hover e estados visuais,
 * além de datas de início/fim e uma lista de tarefas.
 */

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType, Task } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit3, GripVertical, Calendar as CalendarIcon, ListTodo, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { generateId } from '../../utils/helpers';

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
  const [editStartDate, setEditStartDate] = useState<Date | undefined>(card.startDate);
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(card.endDate);
  const [editTasks, setEditTasks] = useState<Task[]>(card.tasks || []);
  const [newTaskDescription, setNewTaskDescription] = useState('');

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
        startDate: editStartDate,
        endDate: editEndDate,
        tasks: editTasks,
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
    setEditStartDate(card.startDate);
    setEditEndDate(card.endDate);
    setEditTasks(card.tasks || []);
    setNewTaskDescription('');
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

  /**
   * Adiciona uma nova tarefa à lista
   */
  const handleAddTask = () => {
    if (newTaskDescription.trim()) {
      const newTask: Task = {
        id: generateId(),
        description: newTaskDescription.trim(),
        completed: false,
      };
      setEditTasks([...editTasks, newTask]);
      setNewTaskDescription('');
    }
  };

  /**
   * Alterna o status de conclusão de uma tarefa
   */
  const handleToggleTask = (taskId: string) => {
    setEditTasks(editTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  /**
   * Remove uma tarefa da lista
   */
  const handleDeleteTask = (taskId: string) => {
    setEditTasks(editTasks.filter(task => task.id !== taskId));
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
      {/* Handle para arrastar e botões de ação */}
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
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full text-sm font-medium"
            placeholder="Título do card"
            autoFocus
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full text-xs resize-none"
            placeholder="Descrição (opcional)"
            rows={2}
          />

          {/* Seleção de Data de Início */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!editStartDate && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {editStartDate ? format(editStartDate, "PPP") : <span>Data de Início</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={editStartDate}
                onSelect={setEditStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Seleção de Data de Fim */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!editEndDate && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {editEndDate ? format(editEndDate, "PPP") : <span>Data de Fim</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={editEndDate}
                onSelect={setEditEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Lista de Tarefas */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-medium">Tarefas</h4>
            </div>
            {editTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${task.completed ? 'line-through text-gray-500' : ''}`}
                  >
                    {task.description}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTask(); } }}
                placeholder="Adicionar nova tarefa..."
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={handleAddTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
              {card.description}
            </p>
          )}

          {(card.startDate || card.endDate) && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {card.startDate && `Início: ${format(card.startDate, 'PPP')}`}
              {card.startDate && card.endDate && ' - '}
              {card.endDate && `Fim: ${format(card.endDate, 'PPP')}`}
            </div>
          )}

          {card.tasks && card.tasks.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <ListTodo className="h-3 w-3" />
                <span>Tarefas ({card.tasks.filter(t => t.completed).length}/{card.tasks.length})</span>
              </div>
              {card.tasks.map(task => (
                <div key={task.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`view-task-${task.id}`}
                    checked={task.completed}
                    disabled
                  />
                  <label
                    htmlFor={`view-task-${task.id}`}
                    className={`text-xs font-medium leading-none ${task.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {task.description}
                  </label>
                </div>
              ))}
            </div>
          )}

          {card.createdAt && (
            <div className="mt-2 text-xs text-gray-400">
              Criado em {format(card.createdAt, 'PPP')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


