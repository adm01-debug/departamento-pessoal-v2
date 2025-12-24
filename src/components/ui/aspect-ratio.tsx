/**
 * @fileoverview Componente AspectRatio para manter proporção de elementos
 * @module components/ui/aspect-ratio
 */
import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

/**
 * Componente que mantém proporção de aspecto consistente
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src="..." alt="..." className="object-cover" />
 * </AspectRatio>
 */
const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
