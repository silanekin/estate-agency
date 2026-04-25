<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Agents</h2>
      <button
        @click="showForm = !showForm"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + New Agent
      </button>
    </div>

    <div v-if="showForm" class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Create New Agent</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="john@agency.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            v-model="form.phone"
            type="text"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="+1234567890"
          />
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button
          @click="createAgent"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Create
        </button>
        <button
          @click="showForm = false"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="grid gap-4">
      <div
        v-for="agent in store.agents"
        :key="agent._id"
        class="bg-white rounded-lg shadow p-6"
      >
        <h3 class="font-semibold text-gray-800">{{ agent.name }}</h3>
        <p class="text-sm text-gray-500">{{ agent.email }}</p>
        <p class="text-sm text-gray-500">{{ agent.phone }}</p>
      </div>

      <div v-if="store.agents.length === 0" class="text-center py-12 text-gray-400">
        No agents yet. Create a new one.
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useTransactionStore()
const showForm = ref(false)
const form = ref({ name: '', email: '', phone: '' })

onMounted(async () => {
  await store.fetchAgents()
})

async function createAgent() {
  await store.createAgent(form.value)
  showForm.value = false
  form.value = { name: '', email: '', phone: '' }
}
</script>