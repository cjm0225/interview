import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const timeStamp = new Date().getTime();
function _resolve(dir) {
  return path.resolve(__dirname, dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  optimizeDeps: {
    include: ['@antv/x6-vue-shape']
  },
  // 注册图标库
  icons: {
    elementPlus: {
      component: ElementPlusIconsVue
    }
  },
  server: {
    // host: '0.0.0.0',
    force: true,
    hmr: true
  },
  build: {
    target: 'modules',   //浏览器兼容性  "esnext"|"modules"
    outDir: 'dist', //指定输出路径
    assetsDir: 'assets', // 指定生成静态资源的存放路径
    minify: 'terser', // 混淆器，terser构建后文件体积更小\
    terserOptions: {
      compress: { // 打包时清除 console 和 debug 相关代码
        drop_console: true,
        drop_debugger: true,
      },
    },
    //资源文件
    rollupOptions: {
      // output: {
      //   manualChunks(id) {
      //     if (id.includes('node_modules')) {
      //       return 'vendor'
      //     }
      //   }
      // }
      output: {
        entryFileNames: `assets/[hash].${timeStamp}.js`,
        chunkFileNames: `assets/[hash].${timeStamp}.js`,
        assetFileNames: `assets/[hash].${timeStamp}.[ext]`,
        manualChunks(id) {
          // 最小化拆分包
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': _resolve('src'),
      '@assets': _resolve('src/assets'),
      '@axios': _resolve('src/axios'),
    },
  },
})
