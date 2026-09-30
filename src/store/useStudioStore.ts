import { create } from 'zustand'

type Theme = 'dark' | 'light'

type StudioState = {
  theme: Theme
  toggleTheme: () => void
}

const storedTheme = localStorage.getItem('graphen-theme')
const initialTheme: Theme = storedTheme === 'light' ? 'light' : 'dark'
document.documentElement.dataset.theme = initialTheme

export const useStudioStore = create<StudioState>((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('graphen-theme', theme)
      document.documentElement.dataset.theme = theme
      return { theme }
    }),
}))
