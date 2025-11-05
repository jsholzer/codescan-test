<script lang="ts">
	import type { PageData } from './$types';
	import TodoForm from '$lib/components/TodoForm.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import { enhance } from '$app/forms';
	
	let { data } = $props();
	let isCreating = $state(false);
	let editingId = $state<number | null>(null);
</script>

<div class="space-y-8">
	<!-- Add New Todo Form -->
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<h2 class="text-xl font-semibold text-gray-800 mb-4">Add New Todo</h2>
		<TodoForm bind:isSubmitting={isCreating} />
	</div>

	<!-- Todo List -->
	<div class="bg-white rounded-lg shadow-sm border border-gray-200">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-semibold text-gray-800">
				Your Todos ({data.todos.length})
			</h2>
		</div>
		
		{#if data.todos.length === 0}
			<div class="p-12 text-center">
				<div class="text-gray-400 mb-4">
					<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
					</svg>
				</div>
				<p class="text-gray-500 text-lg">No todos yet</p>
				<p class="text-gray-400 text-sm mt-1">Add your first todo above to get started!</p>
			</div>
		{:else}
			<TodoList todos={data.todos} bind:editingId />
		{/if}
	</div>
</div>
