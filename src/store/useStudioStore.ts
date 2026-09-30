import { create } from 'zustand'
import sampleSource from '../assets/sample.aal.yaml?raw'
import type { LayoutDirection } from '../core/types/graph'

type Theme = 'dark' | 'light'

type StudioState = {
  theme: Theme
  layoutDirection: LayoutDirection
  source: string
  toggleTheme: () => void
  setLayoutDirection: (direction: LayoutDirection) => void
  setSource: (source: string) => void
}

const storedTheme = localStorage.getItem('graphen-theme')
const initialTheme: Theme = storedTheme === 'light' ? 'light' : 'dark'
document.documentElement.dataset.theme = initialTheme
const storedDirection = localStorage.getItem('graphen-layout-direction')
const initialDirection: LayoutDirection = storedDirection === 'RL' || storedDirection === 'TB' || storedDirection === 'BT'
  ? storedDirection : 'LR'

export const useStudioStore = create<StudioState>((set) => ({
  theme: initialTheme,
  layoutDirection: initialDirection,
  source: localStorage.getItem('graphen-source') ?? sampleSource,
  setSource: (source) => {
    localStorage.setItem('graphen-source', source)
    set({ source })
  },
  setLayoutDirection: (direction) => {
    localStorage.setItem('graphen-layout-direction', direction)
    set({ layoutDirection: direction })
  },
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('graphen-theme', theme)
      document.documentElement.dataset.theme = theme
      return { theme }
    }),
}))
