/**
 * Edge Runtime Function (Web Standard Request / Response — V8 Isolate).
 *
 * Nota arquitetural:
 * NestJS + Mongoose utilizam sockets TCP nativos do Node.js para falar com o MongoDB Atlas,
 * o que não é suportado dentro do Edge Runtime (V8 Isolate).
 *
 * Por isso, adotamos uma arquitetura híbrida:
 * - Edge Runtime (este arquivo): execução ultrarrápida na borda (baixa latência global) para
 *   healthcheck, cabeçalhos de segurança, metadados geográficos, validação leve de método/chave
 *   e futura camada de cache/rate-limit na borda.
 * - Serverless Function (api/index.ts): executa a aplicação NestJS + Mongoose + MongoDB Atlas.
 */
export const config = {
  runtime: 'edge',
};

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
};

export default function edgeHandler(request: Request): Response {
  const url = new URL(request.url);

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(
      JSON.stringify({
        statusCode: 405,
        error: 'Method Not Allowed',
        message: 'A rota de Edge Gateway aceita apenas requisições GET ou HEAD.',
        path: url.pathname,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 405,
        headers: {
          ...SECURITY_HEADERS,
          Allow: 'GET, HEAD',
        },
      },
    );
  }

  const region = request.headers.get('x-vercel-id') ?? 'local-edge';
  const country = request.headers.get('x-vercel-ip-country') ?? 'BR';

  return new Response(
    JSON.stringify({
      statusCode: 200,
      timestamp: new Date().toISOString(),
      path: url.pathname,
      data: {
        status: 'ok',
        runtime: 'edge',
        service: 'universo-literario-edge-gateway',
        edgeRegion: region,
        country,
      },
    }),
    {
      status: 200,
      headers: SECURITY_HEADERS,
    },
  );
}
