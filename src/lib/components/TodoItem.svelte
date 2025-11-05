<script lang="ts">
	import type { Todo } from '$lib/types.js';
	import { enhance } from '$app/forms';
	
	let { 
		todo, 
		editingId = $bindable(null)
	} = $props<{
		todo: Todo;
		editingId: number | null;
	}>();
	
	let isToggling = $state(false);
	let isDeleting = $state(false);
	let isUpdating = $state(false);
	let editTitle = $state(todo.title);
	let editDescription = $state(todo.description);
	
	$effect(() => {
		editTitle = todo.title;
		editDescription = todo.description;
	});
	
	function startEdit() {
		editingId = todo.id;
		editTitle = todo.title;
		editDescription = todo.description;
	}
	
	function cancelEdit() {
		editingId = null;
		editTitle = todo.title;
		editDescription = todo.description;
	}
	
	const isEditing = $derived(editingId === todo.id);
	const formattedDate = $derived(new Date(todo.created_at).toLocaleDateString());
</script>

<div class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
	{#if isEditing}
		<!-- Edit Mode -->
		<form 
			method="POST" 
			action="?/update"
			use:enhance={() => {
				isUpdating = true;
				
				return async ({ update }) => {
					await update();
					editingId = null;
					isUpdating = false;
				};
			}}
			class="space-y-3"
		>
			<input type="hidden" name="id" value={todo.id} />
			
			<div>
				<input
					name="title"
					type="text"
					bind:value={editTitle}
					required
					disabled={isUpdating}
					class="w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
				/>
			</div>
			
			<div>
				<textarea
					name="description"
					bind:value={editDescription}
					disabled={isUpdating}
					placeholder="Description..."
					rows="2"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 resize-none"
				></textarea>
			</div>
			
			<div class="flex gap-2">
				<button
					type="submit"
					disabled={isUpdating || !editTitle.trim()}
					class="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isUpdating}
						<svg class="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Saving...
					{:else}
						Save
					{/if}
				</button>
				<button
					type="button"
					onclick={cancelEdit}
					disabled={isUpdating}
					class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Cancel
				</button>
			</div>
		</form>
	{:else}
		<!-- View Mode -->
		<div class="flex items-start gap-4">
			<!-- Toggle Checkbox -->
			<form 
				method="POST" 
				action="?/toggle"
				use:enhance={() => {
					isToggling = true;
					
					return async ({ update }) => {
						await update();
						isToggling = false;
					};
				}}
				class="pt-1"
			>
				<input type="hidden" name="id" value={todo.id} />
				<button
					type="submit"
					disabled={isToggling}
					class="flex items-center justify-center w-5 h-5 border-2 rounded transition-colors duration-150 {todo.completed 
						? 'bg-green-500 border-green-500 text-white' 
						: 'border-gray-300 hover:border-green-400'} disabled:opacity-50"
				>
					{#if todo.completed}
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
					{/if}
				</button>
			</form>
			
			<!-- Todo Content -->
			<div class="flex-1 min-w-0">
				<h3 class="text-lg font-medium {todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}">
					{todo.title}
				</h3>
				{#if todo.description}
					<p class="mt-1 text-gray-600 {todo.completed ? 'line-through' : ''}">
						{todo.description}
					</p>
				{/if}
				<p class="mt-2 text-xs text-gray-400">
					Created {formattedDate}
				</p>
			</div>
			
			<!-- Action Buttons -->
			<div class="flex gap-1">
				<button
					onclick={startEdit}
					disabled={isToggling || isDeleting}
					class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
					title="Edit todo"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
					</svg>
				</button>
				
				<form 
					method="POST" 
					action="?/delete"
					use:enhance={() => {
						if (!confirm('Are you sure you want to delete this todo?')) {
							return () => {};
						}
						
						isDeleting = true;
						
						return async ({ update }) => {
							await update();
							isDeleting = false;
						};
					}}
				>
					<input type="hidden" name="id" value={todo.id} />
					<button
						type="submit"
						disabled={isToggling || isDeleting}
						class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
						title="Delete todo"
					>
						{#if isDeleting}
							<svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						{:else}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
							</svg>
						{/if}
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>