import { describe, it, expect } from 'vitest';
import {
  STRUCTURAL_BLOCK_PALETTE,
  createStructuralBlock,
  createModuleBlock,
  addBlockToCanvas,
  moveBlockInCanvas,
  duplicateBlockInCanvas,
  removeBlockFromCanvas,
  updateBlockProperties,
  blockHasUserContent,
} from '../../../src/features/editor/domain/EditorBlock';
import type { ModuleDto, SiteBlockDto } from '../../../src/domain/ports';

describe('[PBI-008][T02] Dominio EditorBlock — Operaciones inmutables del lienzo', () => {
  it('[PBI-008][CA-01] expone la paleta de bloques estructurales base (hero, text, features, footer)', () => {
    const types = STRUCTURAL_BLOCK_PALETTE.map((item) => item.type);
    expect(types).toEqual(['hero', 'text', 'features', 'footer']);
  });

  it('[PBI-008][CA-01] crea bloques estructurales y de módulos instalados y los añade de forma inmutable', () => {
    const initial: readonly SiteBlockDto[] = [];
    const heroBlock = createStructuralBlock('hero', 'block-1');
    const afterFirst = addBlockToCanvas(initial, heroBlock);

    expect(initial).toHaveLength(0);
    expect(afterFirst).toHaveLength(1);
    expect(afterFirst[0].type).toBe('hero');
    expect(afterFirst[0].title).toBeTruthy();

    const cartModule: ModuleDto = {
      id: 'mod-ecommerce-cart',
      name: 'Carrito E-commerce',
      description: 'Cesta de compra',
      category: 'ecommerce',
      status: 'installed',
      version: '1.2.0',
    };
    const modBlock = createModuleBlock(cartModule, 'block-2');
    const afterSecond = addBlockToCanvas(afterFirst, modBlock);

    expect(afterSecond).toHaveLength(2);
    expect(afterSecond[1]).toMatchObject({
      id: 'block-2',
      type: 'module',
      moduleId: 'mod-ecommerce-cart',
      moduleName: 'Carrito E-commerce',
      title: 'Carrito E-commerce',
    });
  });

  it('[PBI-008][CA-01] reordena bloques arriba y abajo respetando los límites del lienzo', () => {
    const b1 = createStructuralBlock('hero', 'b-1');
    const b2 = createStructuralBlock('text', 'b-2');
    const b3 = createStructuralBlock('footer', 'b-3');
    const canvas = [b1, b2, b3];

    // Mover el primero hacia arriba no altera el orden
    expect(moveBlockInCanvas(canvas, 'b-1', 'up').map((b) => b.id)).toEqual([
      'b-1',
      'b-2',
      'b-3',
    ]);

    // Mover b-2 hacia arriba lo coloca primero
    const movedUp = moveBlockInCanvas(canvas, 'b-2', 'up');
    expect(movedUp.map((b) => b.id)).toEqual(['b-2', 'b-1', 'b-3']);

    // Mover b-1 hacia abajo lo coloca al final
    const movedDown = moveBlockInCanvas(movedUp, 'b-1', 'down');
    expect(movedDown.map((b) => b.id)).toEqual(['b-2', 'b-3', 'b-1']);
  });

  it('[PBI-008][CA-01] duplica un bloque insertando la copia justo después del original', () => {
    const b1 = createStructuralBlock('hero', 'b-1');
    const b2 = createStructuralBlock('footer', 'b-2');
    const duplicated = duplicateBlockInCanvas([b1, b2], 'b-1', 'b-1-copy');

    expect(duplicated).toHaveLength(3);
    expect(duplicated[1].id).toBe('b-1-copy');
    expect(duplicated[1].type).toBe('hero');
    expect(duplicated[1].title).toContain('(copia)');
  });

  it('[PBI-008][CA-01][CA-02] actualiza propiedades en tiempo real, detecta contenido de usuario y elimina bloques', () => {
    const b1 = createStructuralBlock('hero', 'b-1');
    const updated = updateBlockProperties([b1], 'b-1', {
      title: 'Artesanía Local',
      subtitle: 'Hecho a mano',
      content: 'Envíos en 24h',
      ctaText: 'Ver catálogo',
    });

    expect(updated[0]).toMatchObject({
      id: 'b-1',
      title: 'Artesanía Local',
      subtitle: 'Hecho a mano',
      content: 'Envíos en 24h',
      ctaText: 'Ver catálogo',
    });
    expect(blockHasUserContent(updated[0])).toBe(true);

    const emptyBlock: SiteBlockDto = {
      id: 'b-empty',
      type: 'separator',
      title: '',
      content: '',
      subtitle: '',
    };
    expect(blockHasUserContent(emptyBlock)).toBe(false);

    const afterRemove = removeBlockFromCanvas(updated, 'b-1');
    expect(afterRemove).toHaveLength(0);
  });
});
