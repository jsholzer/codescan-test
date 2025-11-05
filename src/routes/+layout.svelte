<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Todo List App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-4xl mx-auto px-4 py-6">
			<h1 class="text-3xl font-bold text-gray-900">My Todo List</h1>
			<p class="text-gray-600 mt-2">Stay organized and get things done</p>
		</div>
	</header>
	
	<main class="max-w-4xl mx-auto px-4 py-8">
		{@render children()}
	</main>
	
	<footer class="text-center text-gray-500 text-sm py-8">
		Built with SvelteKit, Tailwind CSS, and SQLite
	</footer>
</div>
