import edgeHandler, { config } from './gateway';

describe('Edge Runtime Gateway (api/edge/gateway.ts)', () => {
  it('deve declarar runtime edge', () => {
    expect(config.runtime).toBe('edge');
  });

  it('deve responder 200 OK com headers de segurança em requisições GET', async () => {
    const request = new Request('https://api.universoliterario.com/api/edge/gateway', {
      method: 'GET',
      headers: { 'x-vercel-ip-country': 'BR' },
    });

    const response = edgeHandler(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(body.data.runtime).toBe('edge');
    expect(body.data.country).toBe('BR');
  });

  it('deve responder 405 Method Not Allowed para requisições POST', async () => {
    const request = new Request('https://api.universoliterario.com/api/edge/gateway', {
      method: 'POST',
    });

    const response = edgeHandler(request);
    expect(response.status).toBe(405);
  });
});
