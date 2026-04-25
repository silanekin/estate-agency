<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800">🏠 Estate Agency</h1>
        <div class="flex gap-4">
          <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">Dashboard</NuxtLink>
          <NuxtLink to="/agents" class="text-gray-600 hover:text-gray-900">Agents</NuxtLink>
        </div>
      </div>
    </nav>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <NuxtPage />
    </main>
  </div>
</template>