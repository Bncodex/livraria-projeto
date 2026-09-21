import { defineConfig } from 'vitest/config';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function inlineAngularResources() {
  return {
    name: 'inline-angular-component-resources',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (!id.endsWith('.ts') || id.endsWith('.spec.ts') || !id.includes('/src/')) return null;

      let transformed = code.replace(
        /templateUrl\s*:\s*['"](.+?\.html)['"]/g,
        (_, resource: string) => `template: ${JSON.stringify(readFileSync(resolve(dirname(id), resource), 'utf8'))}`,
      );
      transformed = transformed.replace(
        /styleUrl\s*:\s*['"](.+?\.css)['"]/g,
        (_, resource: string) => `styles: [${JSON.stringify(readFileSync(resolve(dirname(id), resource), 'utf8'))}]`,
      );

      return transformed === code ? null : { code: transformed, map: null };
    },
  };
}

export default defineConfig({
  plugins: [inlineAngularResources()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      reportsDirectory: './coverage/livraria-projeto',
    },
  },
});
