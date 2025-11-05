<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { isSubmitting = $bindable(false) } = $props();
	let title = $state('');
	let description = $state('');
</script>

<form 
	method="POST" 
	action="?/create"
	use:enhance={({ formData, cancel }) => {
		if (!title.trim()) {
			cancel();
			return;
		}
		
		isSubmitting = true;
		
		return async ({ update }) => {
			await update();
			title = '';
			description = '';
			isSubmitting = false;
		};
	}}
	class="space-y-4"
>
	<div>
		<label for="title" class="block text-sm font-medium text-gray-700 mb-1">
			Title *
		</label>
		<input
			id="title"
			name="title"
			type="text"
			bind:value={title}
			required
			disabled={isSubmitting}
			placeholder="What needs to be done?"
			class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
		/>
	</div>
	
	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
			Description
		</label>
		<textarea
			id="description"
			name="description"
			bind:value={description}
			disabled={isSubmitting}
			placeholder="Add more details... (optional)"
			rows="3"
			class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
		></textarea>
	</div>
	
	<div class="flex gap-3">
		<button
			type="submit"
			disabled={isSubmitting || !title.trim()}
			class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{#if isSubmitting}
				<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Creating...
			{:else}
				<svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				Add Todo
			{/if}
		</button>
		
		{#if title.trim() || description.trim()}
			<button
				type="button"
				onclick={() => { title = ''; description = ''; }}
				disabled={isSubmitting}
				class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Clear
			</button>
		{/if}
	</div>
</form>