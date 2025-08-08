import { defineStore } from 'pinia'

type TagMap = Record<number, string[]>

const LS_KEY = 'client-tags-v1'

export const useClientTagsStore = defineStore('clientTags', {
  state: () => ({
    tagsById: {} as TagMap,
    loaded: false
  }),
  actions: {
    load() {
      if (this.loaded) return
      try {
        const raw = localStorage.getItem(LS_KEY)
        this.tagsById = raw ? JSON.parse(raw) : {}
      } catch {
        this.tagsById = {}
      }
      this.loaded = true
    },
    save() {
      localStorage.setItem(LS_KEY, JSON.stringify(this.tagsById))
    },
    getTags(id: number | undefined) {
      if (!id) return []
      this.load()
      return this.tagsById[id] ?? []
    },
    setTags(id: number, tags: string[]) {
      this.load()
      this.tagsById[id] = tags.filter(t => t.trim() !== '')
      this.save()
    },
    removeAll(id: number) {
      this.load()
      delete this.tagsById[id]
      this.save()
    }
  }
})
