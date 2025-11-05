import { getAllTodos, createTodo, updateTodo, deleteTodo, toggleTodoComplete } from '$lib/todos.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const todos = getAllTodos();
    return {
      todos
    };
  } catch (error) {
    console.error('Error loading todos:', error);
    return {
      todos: []
    };
  }
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title') as string;
    const description = data.get('description') as string;

    if (!title?.trim()) {
      return fail(400, { error: 'Title is required' });
    }

    try {
      const todo = createTodo({
        title: title.trim(),
        description: description?.trim() || ''
      });
      
      return {
        success: true,
        todo
      };
    } catch (error) {
      console.error('Error creating todo:', error);
      return fail(500, { 
        error: error instanceof Error ? error.message : 'Failed to create todo' 
      });
    }
  },

  update: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id') as string);
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const completed = data.get('completed') === 'true';

    if (!id || isNaN(id)) {
      return fail(400, { error: 'Invalid todo ID' });
    }

    try {
      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (data.has('completed')) updateData.completed = completed;

      const updatedTodo = updateTodo(id, updateData);
      
      if (!updatedTodo) {
        return fail(404, { error: 'Todo not found' });
      }

      return {
        success: true,
        todo: updatedTodo
      };
    } catch (error) {
      console.error('Error updating todo:', error);
      return fail(500, { 
        error: error instanceof Error ? error.message : 'Failed to update todo' 
      });
    }
  },

  toggle: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id') as string);

    if (!id || isNaN(id)) {
      return fail(400, { error: 'Invalid todo ID' });
    }

    try {
      const updatedTodo = toggleTodoComplete(id);
      
      if (!updatedTodo) {
        return fail(404, { error: 'Todo not found' });
      }

      return {
        success: true,
        todo: updatedTodo
      };
    } catch (error) {
      console.error('Error toggling todo:', error);
      return fail(500, { 
        error: error instanceof Error ? error.message : 'Failed to toggle todo' 
      });
    }
  },

  delete: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id') as string);

    if (!id || isNaN(id)) {
      return fail(400, { error: 'Invalid todo ID' });
    }

    try {
      const deleted = deleteTodo(id);
      
      if (!deleted) {
        return fail(404, { error: 'Todo not found' });
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting todo:', error);
      return fail(500, { 
        error: error instanceof Error ? error.message : 'Failed to delete todo' 
      });
    }
  }
};