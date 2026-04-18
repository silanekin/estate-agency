import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [] as any[],
    currentTransaction: null as any,
    agents: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchTransactions() {
      this.loading = true
      try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/transactions`)
        this.transactions = data as any[]
      } catch (e) {
        this.error = 'İşlemler yüklenemedi'
      } finally {
        this.loading = false
      }
    },

    async fetchTransaction(id: string) {
      this.loading = true
      try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/transactions/${id}`)
        this.currentTransaction = data
      } catch (e) {
        this.error = 'İşlem yüklenemedi'
      } finally {
        this.loading = false
      }
    },

    async createTransaction(body: {
      propertyAddress: string
      totalServiceFee: number
      listingAgentId: string
      sellingAgentId: string
    }) {
      this.loading = true
      try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/transactions`, {
          method: 'POST',
          body,
        })
        this.transactions.push(data)
        return data
      } catch (e) {
        this.error = 'İşlem oluşturulamadı'
      } finally {
        this.loading = false
      }
    },

    async advanceStage(id: string) {
      try {
        const config = useRuntimeConfig()
        const data = await $fetch(
          `${config.public.apiBase}/transactions/${id}/stage`,
          { method: 'PATCH' },
        )
        const index = this.transactions.findIndex((t) => t._id === id)
        if (index !== -1) this.transactions[index] = data
        if (this.currentTransaction?._id === id) this.currentTransaction = data
        return data
      } catch (e) {
        this.error = 'Aşama güncellenemedi'
      }
    },

    async fetchAgents() {
      try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/agents`)
        this.agents = data as any[]
      } catch (e) {
        this.error = 'Ajanlar yüklenemedi'
      }
    },

    async createAgent(body: { name: string; email: string; phone: string }) {
      try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/agents`, {
          method: 'POST',
          body,
        })
        this.agents.push(data)
        return data
      } catch (e) {
        this.error = 'Ajan oluşturulamadı'
      }
    },
  },
})