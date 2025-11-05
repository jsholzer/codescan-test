import db from './database.js';
import type { Todo, CreateTodoData, UpdateTodoData } from './types.js';
import { z } from 'zod';

// Validation schemas
const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional()
});

const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  completed: z.boolean().optional()
});

// Prepared statements for better performance
const statements = {
  getAll: db.prepare('SELECT * FROM todos ORDER BY created_at DESC'),
  getById: db.prepare('SELECT * FROM todos WHERE id = ?'),
  create: db.prepare('INSERT INTO todos (title, description) VALUES (?, ?)'),
  update: db.prepare(`
    UPDATE todos 
    SET title = COALESCE(?, title), 
        description = COALESCE(?, description), 
        completed = COALESCE(?, completed)
    WHERE id = ?
  `),
  delete: db.prepare('DELETE FROM todos WHERE id = ?'),
  toggleComplete: db.prepare('UPDATE todos SET completed = NOT completed WHERE id = ?')
};

// Helper function to convert database row to Todo object
function rowToTodo(row: any): Todo {
  return {
    ...row,
    completed: Boolean(row.completed)
  };
}

export function getAllTodos(): Todo[] {
  const rows = statements.getAll.all();
  return rows.map(rowToTodo);
}

export function getTodoById(id: number): Todo | null {
  const row = statements.getById.get(id);
  return row ? rowToTodo(row) : null;
}

export function createTodo(data: CreateTodoData): Todo {
  const validation = createTodoSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(`Validation failed: ${validation.error.issues.map(i => i.message).join(', ')}`);
  }

  const { title, description = '' } = validation.data;
  const result = statements.create.run(title, description);
  
  const newTodo = getTodoById(result.lastInsertRowid as number);
  if (!newTodo) {
    throw new Error('Failed to create todo');
  }
  
  return newTodo;
}

export function updateTodo(id: number, data: UpdateTodoData): Todo | null {
  const validation = updateTodoSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(`Validation failed: ${validation.error.issues.map(i => i.message).join(', ')}`);
  }

  const { title, description, completed } = validation.data;
  
  // Check if todo exists first
  const existingTodo = getTodoById(id);
  if (!existingTodo) {
    return null;
  }

  statements.update.run(title, description, completed, id);
  return getTodoById(id);
}

export function deleteTodo(id: number): boolean {
  const result = statements.delete.run(id);
  return result.changes > 0;
}

export function toggleTodoComplete(id: number): Todo | null {
  const existingTodo = getTodoById(id);
  if (!existingTodo) {
    return null;
  }

  statements.toggleComplete.run(id);
  return getTodoById(id);
}