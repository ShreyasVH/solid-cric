import { defineConfig, loadEnv } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig(({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return {
    plugins: [solid()],
    server: {
      host: process.env.VITE_HOST,
      port: process.env.VITE_PORT
    }
  }
})

