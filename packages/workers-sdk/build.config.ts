import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  outDir: 'dist',
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  // externals: [
  //   'drizzle-kit',
  //   'drizzle-orm',
  //   'zod',
  //   'consola',
  //   '@types/node',
  //   '@cloudflare/workers-types',
  //   'cloudflare:workers',
  // ],
  // dependencies: [
  //   '@cloudflare/workers-types/experimental',
  // ],
})
