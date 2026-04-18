<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Islemler</h2>
      <button
        @click="showForm = !showForm"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Yeni Islem
      </button>
    </div>

    <div v-if="showForm" class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Yeni Islem Olustur</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mulk Adresi</label>
          <input
            v-model="form.propertyAddress"
            type="text"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Ataturk Cad. No:5"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Toplam Komisyon (TL)</label>
          <input
            v-model="form.totalServiceFee"
            type="number"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="100000"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Listeleyen Ajan</label>
          <select v-model="form.listingAgentId" class="w-full border rounded-lg px-3 py-2">
            <option value="">Sec...</option>
            <option v-for="agent in store.agents" :key="agent._id" :value="agent._id">
              {{ agent.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Satan Ajan</label>
          <select v-model="form.sellingAgentId" class="w-full border rounded-lg px-3 py-2">
            <option value="">Sec...</option>
            <option v-for="agent in store.agents" :key="agent._id" :value="agent._id">
              {{ agent.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button
          @click="createTransaction"
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

    <div v-if="store.loading" class="text-center py-12 text-gray-500">Yukleniyor...</div>

    <div v-else class="grid gap-4">
      <div
        v-for="transaction in store.transactions"
        :key="transaction._id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-800">{{ transaction.propertyAddress }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ transaction.totalServiceFee.toLocaleString('tr-TR') }} TL
            </p>
          </div>
          <div class="flex items-center gap-4">
            <span :class="stageClass(transaction.stage)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ stageLabel(transaction.stage) }}
            </span>
            <button
              v-if="transaction.stage !== 'completed'"
              @click="advanceStage(transaction._id)"
              class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
            >
              Ilerlet
            </button>
            <NuxtLink
              :to="`/transactions/${transaction._id}`"
              class="text-blue-600 text-sm hover:underline"
            >
              Detay
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="store.transactions.length === 0" class="text-center py-12 text-gray-400">
        Henuz islem yok. Yeni bir islem olusturun.
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useTransactionStore()
const showForm = ref(false)

const form = ref({
  propertyAddress: '',
  totalServiceFee: 0,
  listingAgentId: '',
  sellingAgentId: '',
})

onMounted(async () => {
  await store.fetchTransactions()
  await store.fetchAgents()
})

async function createTransaction() {
  await store.createTransaction({
    ...form.value,
    totalServiceFee: Number(form.value.totalServiceFee),
  })
  showForm.value = false
  form.value = { propertyAddress: '', totalServiceFee: 0, listingAgentId: '', sellingAgentId: '' }
}

async function advanceStage(id) {
  await store.advanceStage(id)
}

function stageLabel(stage) {
  const labels = {
    agreement: 'Anlasma',
    earnest_money: 'Kapora',
    title_deed: 'Tapu',
    completed: 'Tamamlandi',
  }
  return labels[stage] || stage
}

function stageClass(stage) {
  const classes = {
    agreement: 'bg-yellow-100 text-yellow-800',
    earnest_money: 'bg-blue-100 text-blue-800',
    title_deed: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
  }
  return classes[stage] || 'bg-gray-100 text-gray-800'
}
</script>