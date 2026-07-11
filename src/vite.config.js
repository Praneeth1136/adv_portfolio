import { resolve } from 'path';

export default {
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        thanks: resolve(__dirname, 'thanks.html'),
        notfound: resolve(__dirname, '404.html')
      }
    }
  },
  envDir: "../",
};
