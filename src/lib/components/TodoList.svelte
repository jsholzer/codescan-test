<script lang="ts">
	import type { Todo } from '$lib/types.js';
	import TodoItem from './TodoItem.svelte';
	
	let { todos, editingId = $bindable(null) } : { todos: Todo[]; editingId: number | null; } = $props<{
		todos: Todo[];
		editingId: number | null;
	}>();
	
	// Separate completed and incomplete todos
	let incompleteTodos = todos.filter(todo => !todo.completed);
	let completedTodos = todos.filter(todo => todo.completed);
</script>

<div class="divide-y divide-gray-200">
	<!-- Incomplete Todos -->
	{#if incompleteTodos.length > 0}
		<div class="pb-4">
			<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 px-6">
				To Do ({incompleteTodos.length})
			</h3>
			{#each incompleteTodos as todo (todo.id)}
				<TodoItem {todo} bind:editingId />
			{/each}
		</div>
	{/if}
	
	<!-- Completed Todos -->
	{#if completedTodos.length > 0}
		<div class="pt-4">
			<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 px-6">
				Completed ({completedTodos.length})
			</h3>
			{#each completedTodos as todo (todo.id)}
				<TodoItem {todo} bind:editingId />
			{/each}
		</div>
	{/if}
</div>