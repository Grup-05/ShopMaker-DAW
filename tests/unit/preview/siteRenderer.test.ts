import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  sanitizeHtml,
  sanitizeUrl,
} from '../../../src/features/preview/domain/htmlSanitizer';
import { renderSiteDocument } from '../../../src/features/preview/domain/siteRenderer';
import type { SiteDto, ModuleDto } from '../../../src/domain/ports';

const baseSite: SiteDto = {
  id: 'site-1',
  name: 'Mi Tienda Segura',
  subdomain: 'mi-tienda.shopmaker.local',
  status: 'draft',
  category: 'ecommerce',
  createdAt: '2026-11-26T10:00:00.000Z',
  updatedAt: '2026-11-26T10:00:00.000Z',
};

describe('[PBI-009][T02] htmlSanitizer y SiteRenderer', () => {
  describe('[RF-01][CA-01] sanitización anti-XSS', () => {
    it('escapa caracteres HTML peligrosos en texto plano', () => {
      const escaped = escapeHtml(`<script>alert("xss")</script> & 'test'`);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;');
    });

    it('elimina etiquetas peligrosas, atributos on* y URLs javascript:', () => {
      const dirty = `
        <p onclick="alert(1)">Texto válido</p>
        <script>fetch('https://evil.test')</script>
        <img src="https://example.com/foto.jpg" onerror="alert(2)" alt="Foto" />
        <a href="javascript:alert(3)">Enlace malicioso</a>
        <iframe src="https://evil.test"></iframe>
      `;

      const clean = sanitizeHtml(dirty);

      expect(clean).toContain('Texto válido');
      expect(clean).not.toMatch(/<script/i);
      expect(clean).not.toMatch(/<iframe/i);
      expect(clean).not.toMatch(/on\w+\s*=/i);
      expect(clean).not.toMatch(/javascript:/i);
    });

    it('rechaza URLs con esquemas inseguros y permite https/http/rutas relativas', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
      expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('');
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
      expect(sanitizeUrl('https://shopmaker.local/logo.png')).toBe(
        'https://shopmaker.local/logo.png'
      );
      expect(sanitizeUrl('/assets/banner.jpg')).toBe('/assets/banner.jpg');
    });
  });

  describe('[RF-02][CA-02] renderizado HTML/CSS mobile-first', () => {
    it('genera un documento HTML5 completo con CSP, viewport y breakpoints mobile-first', () => {
      const html = renderSiteDocument({ site: baseSite });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<meta name="viewport"');
      expect(html).toContain('Content-Security-Policy');
      expect(html).toContain("default-src 'none'");
      expect(html).toContain('@media (min-width: 768px)');
      expect(html).toContain('@media (min-width: 1280px)');
      expect(html).toContain('Mi Tienda Segura');
      expect(html).toContain('mi-tienda.shopmaker.local');
    });

    it('renderiza bloques de contenido y módulos activos sanitizando payloads XSS', () => {
      const modules: ModuleDto[] = [
        {
          id: 'mod-1',
          name: 'Carrito <script>alert(1)</script>',
          description: 'Gestión de cesta',
          category: 'ecommerce',
          status: 'installed',
          version: '1.0.0',
        },
      ];

      const html = renderSiteDocument({
        site: { ...baseSite, name: 'Tienda <img src=x onerror=alert(1)>' },
        blocks: [
          {
            id: 'b-1',
            type: 'heading',
            content: 'Bienvenidos',
          },
          {
            id: 'b-2',
            type: 'text',
            content: '<p onclick="evil()">Catálogo artesanal</p><script>evil()</script>',
          },
          {
            id: 'b-3',
            type: 'image',
            imageUrl: 'https://example.com/producto.jpg',
            imageAlt: 'Producto destacado',
          },
          {
            id: 'b-4',
            type: 'separator',
          },
        ],
        activeModules: modules,
      });

      expect(html).toContain('Bienvenidos');
      expect(html).toContain('Catálogo artesanal');
      expect(html).toContain('https://example.com/producto.jpg');
      expect(html).toContain('Producto destacado');
      expect(html).toContain('<hr');
      expect(html).toContain('Carrito');
      expect(html).not.toContain('<script>');
      expect(html).not.toMatch(/onerror\s*=/i);
      expect(html).not.toMatch(/onclick\s*=/i);
    });
  });
});
