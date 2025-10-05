import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Explicitly exclude the protobuf files from optimization
  optimizeDeps: {
    exclude: [
      'src/services/grpc/user_services/user_api_pb.js', 
      'src/services/grpc/ai_services/ai_api_pb.js'
    ]
  },
  
  // Define globals for the browser environment
  define: {
    global: 'window'
  }
})
