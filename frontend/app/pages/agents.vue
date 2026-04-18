<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Ajanlar</h2>
      <button
        @click="showForm = !showForm"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Yeni Ajan
      </button>
    </div>

    <div v-if="showForm" class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Yeni Ajan Olustur</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Ali Yilmaz"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="ali@firma.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input
            v-model="form.phone"
            type="text"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="05301234567"
          />
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button
          @click="createAgent"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Olustur
        </button>
        <button
          @click="showForm = false"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Iptal
        </button>
      </div>
    </div>

    <div class="grid gap-4">
      <div
        v-for="agent in store.agents"
        :key="agent._id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-800">{{ agent.name }}</h3>
            <p class="text-sm text-gray-500">{{ agent.email }}</p>
            <p class="text-sm text-gray-500">{{ agent.phone }}</p>
          </div>
        </div>
      </div>

      <div v-if="store.agents.length === 0" class="text-center py-12 text-gray-400">
        Henuz ajan yok. Yeni bir ajan olusturun.
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