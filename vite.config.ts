// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

//not initial error , but error when hit undo
// export default {
//   build: {
//     minify: false,
//   },
// };

export default {
  build: {
    rollupOptions: {
      output: {
        format: 'umd', // or 'iife'
        name: 'MyApp', // Required for UMD/IIFE; give your app a global name
      },
    },
  },
};