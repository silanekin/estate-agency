<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/" class="text-blue-600 hover:underline text-sm">
        &larr; Dashboard
      </NuxtLink>
    </div>

    <div v-if="store.loading" class="text-center py-12 text-gray-500">
      Loading...
    </div>

    <div v-else-if="store.currentTransaction">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ store.currentTransaction.propertyAddress }}
          </h2>
          <span
            :class="stageClass(store.currentTransaction.stage)"
            class="px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ stageLabel(store.currentTransaction.stage) }}
          </span>
        </div>

        <p class="text-gray-600 mb-4">
          Total Commission:
          <span class="font-semibold">
            {{ store.currentTransaction.totalServiceFee.toLocaleString('en-US') }} TL
          </span>
        </p>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500">Listing Agent</p>
            <p class="font-semibold">{{ store.currentTransaction.listingAgentId?.name }}</p>
            <p class="text-sm text-gray-500">{{ store.currentTransaction.listingAgentId?.email }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500">Selling Agent</p>
            <p class="font-semibold">{{ store.currentTransaction.sellingAgentId?.name }}</p>
            <p class="text-sm text-gray-500">{{ store.currentTransaction.sellingAgentId?.email }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button
            v-if="store.currentTransaction.stage !== 'completed'"
            @click="advanceStage"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Advance to Next Stage
          </button>
          <span v-else class="text-green-600 font-medium">
            Transaction completed
          </span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Stage Progress</h3>
        <div class="flex items-center justify-between">
          <div
            v-for="(stage, index) in stages"
            :key="stage.key"
            class="flex items-center"
          >
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  isStageCompleted(stage.key)
                    ? 'bg-green-500 text-white'
                    : isCurrentStage(stage.key)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500',
                ]"
              >
                {{ index + 1 }}
              </div>
              <p class="text-xs mt-1 text-gray-600">{{ stage.label }}</p>
            </div>
            <div
              v-if="index < stages.length - 1"
              :class="[
                'h-1 w-16 mx-2 mb-4',
                isStageCompleted(stages[index + 1].key) || isCurrentStage(stages[index + 1].key)
                  ? 'bg-green-400'
                  : 'bg-gray-200',
              ]"
            />
          </div>
        </div>
      </div>

      <div
        v-if="store.currentTransaction.commission"
        class="bg-white rounded-lg shadow p-6"
      >
        <h3 class="text-lg font-semibold mb-4">Commission Breakdown</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <p class="text-sm text-gray-500 mb-1">Agency</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ store.currentTransaction.commission.agencyShare.toLocaleString('en-US') }} TL
            </p>
            <p class="text-xs text-gray-400 mt-1">50%</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <p class="text-sm text-gray-500 mb-1">Listing Agent</p>
            <p class="text-2xl font-bold text-green-600">
              {{ store.currentTransaction.commission.listingAgentShare.toLocaleString('en-US') }} TL
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ store.currentTransaction.commission.isSameAgent ? '50%' : '25%' }}
            </p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 text-center">
            <p class="text-sm text-gray-500 mb-1">Selling Agent</p>
            <p class="text-2xl font-bold text-purple-600">
              {{ store.currentTransaction.commission.sellingAgentShare.toLocaleString('en-US') }} TL
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ store.currentTransaction.commission.isSameAgent ? '0% (same agent)' : '25%' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const store = useTransactionStore()

const stages = [
  { key: 'agreement', label: 'Agreement' },
  { key: 'earnest_money', label: 'Earnest Money' },
  { key: 'title_deed', label: 'Title Deed' },
  { key: 'completed', label: 'Completed' },
]

onMounted(async () => {
  await store.fetchTransaction(route.params.id)
})

async function advanceStage() {
  await store.advanceStage(route.params.id)
}

function stageLabel(stage) {
  const labels = {
    agreement: 'Agreement',
    earnest_money: 'Earnest Money',
    title_deed: 'Title Deed',
    completed: 'Completed',
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

const stageOrder = ['agreement', 'earnest_money', 'title_deed', 'completed']

function isStageCompleted(stageKey) {
  const currentIndex = stageOrder.indexOf(store.currentTransaction?.stage)
  const stageIndex = stageOrder.indexOf(stageKey)
  return stageIndex < currentIndex
}

function isCurrentStage(stageKey) {
  return store.currentTransaction?.stage === stageKey
}
</script>