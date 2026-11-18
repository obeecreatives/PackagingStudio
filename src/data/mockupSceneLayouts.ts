import { GENERATED_ASSETS, PouchShapeId } from '../types/packaging';

export interface PanelOverlayRect {
  /** Left offset in % of the 3:4 or 1:1 scene image */
  x: number;
  /** Top offset in % of the 3:4 or 1:1 scene image */
  y: number;
  /** Width in % of the scene image */
  w: number;
  /** Height in % of the scene image */
  h: number;
  /** CSS 3D Y-rotation in degrees for foreshortened faces */
  rotateYDeg?: number;
  /** Vertical shear angle in degrees to match camera perspective horizon */
  skewYDeg?: number;
  /** Top ratio (0..1 of box height) where bottom foil/copper band starts */
  bandRatioTop: number;
  /** Height ratio (0..1 of box height) of bottom foil/copper band */
  bandRatioH: number;
  /** Ink color for bottom band text ('#1E130D' on gold foil, '#FAF5EB' on dark lip) */
  bandTextColor: string;
  /** Vertical center ratio (0..1) reserved for physical degassing valve if present */
  valveClearCenterRatio?: number;
}

export interface NaturalMockupLayoutSpec {
  baseImage: string;
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal';
  front: PanelOverlayRect;
  rear: PanelOverlayRect;
}

export const NATURAL_MOCKUP_LAYOUTS: Record<PouchShapeId, NaturalMockupLayoutSpec> = {
  'box-gusset': {
    baseImage: GENERATED_ASSETS.blankV1BoxGusset,
    variantStyle: 'classic',
    front: {
      x: 11.2,
      y: 26.3,
      w: 38.8,
      h: 55.5,
      bandRatioTop: 0.903,
      bandRatioH: 0.097,
      bandTextColor: '#1E130D',
    },
    rear: {
      x: 52.8,
      y: 26.6,
      w: 28.2,
      h: 54.4,
      rotateYDeg: -16,
      skewYDeg: 3.8,
      bandRatioTop: 0.896,
      bandRatioH: 0.104,
      bandTextColor: '#1E130D',
    },
  },
  'doypack-valve': {
    baseImage: GENERATED_ASSETS.blankV2DoypackNatural,
    variantStyle: 'doypack',
    front: {
      x: 13.5,
      y: 33.8,
      w: 37.8,
      h: 45.2,
      bandRatioTop: 0.892,
      bandRatioH: 0.106,
      bandTextColor: '#1E130D',
      valveClearCenterRatio: 0.292,
    },
    rear: {
      x: 52.8,
      y: 34.2,
      w: 38.0,
      h: 45.6,
      rotateYDeg: 0,
      skewYDeg: 0,
      bandRatioTop: 0.888,
      bandRatioH: 0.11,
      bandTextColor: '#1E130D',
    },
  },
  'tall-heritage': {
    baseImage: GENERATED_ASSETS.blankV3TallHeritage,
    variantStyle: 'heritage-mandala',
    front: {
      x: 14.2,
      y: 16.5,
      w: 36.0,
      h: 71.7,
      bandRatioTop: 0.924,
      bandRatioH: 0.076,
      bandTextColor: '#1E130D',
    },
    rear: {
      x: 60.2,
      y: 19.8,
      w: 27.6,
      h: 65.2,
      rotateYDeg: -18,
      skewYDeg: -4.0,
      bandRatioTop: 0.906,
      bandRatioH: 0.094,
      bandTextColor: '#1E130D',
    },
  },
  'tall-botanical': {
    baseImage: GENERATED_ASSETS.blankV4TallBotanical,
    variantStyle: 'botanical',
    front: {
      x: 17.5,
      y: 11.6,
      w: 35.8,
      h: 75.4,
      rotateYDeg: 8,
      skewYDeg: 1.8,
      bandRatioTop: 0.91,
      bandRatioH: 0.09,
      bandTextColor: '#1E130D',
    },
    rear: {
      x: 62.0,
      y: 13.8,
      w: 30.8,
      h: 68.8,
      rotateYDeg: 14,
      skewYDeg: -2.8,
      bandRatioTop: 0.906,
      bandRatioH: 0.094,
      bandTextColor: '#1E130D',
    },
  },
  'tall-copper': {
    baseImage: GENERATED_ASSETS.blankV5TallCopper,
    variantStyle: 'copper',
    front: {
      x: 19.5,
      y: 21.3,
      w: 30.8,
      h: 64.2,
      bandRatioTop: 0.88,
      bandRatioH: 0.12,
      bandTextColor: '#FAF5EB',
    },
    rear: {
      x: 52.5,
      y: 22.2,
      w: 21.4,
      h: 62.6,
      rotateYDeg: 20,
      skewYDeg: 4.8,
      bandRatioTop: 0.868,
      bandRatioH: 0.132,
      bandTextColor: '#FAF5EB',
    },
  },
  'tall-minimal': {
    baseImage: GENERATED_ASSETS.blankV6TallMinimal,
    variantStyle: 'minimal',
    front: {
      x: 12.8,
      y: 26.5,
      w: 36.0,
      h: 59.5,
      bandRatioTop: 0.888,
      bandRatioH: 0.112,
      bandTextColor: '#1E130D',
    },
    rear: {
      x: 52.8,
      y: 25.0,
      w: 24.8,
      h: 59.2,
      rotateYDeg: 18,
      skewYDeg: 3.4,
      bandRatioTop: 0.868,
      bandRatioH: 0.132,
      bandTextColor: '#1E130D',
    },
  },
};

export const STUDIO_DOYPACK_LAYOUT: {
  frontImage: string;
  rearImage: string;
  front: PanelOverlayRect;
  rear: PanelOverlayRect;
} = {
  frontImage: GENERATED_ASSETS.blankStudioDoypackFront,
  rearImage: GENERATED_ASSETS.blankStudioDoypackRear,
  front: {
    x: 24.2,
    y: 10.2,
    w: 51.2,
    h: 83.0,
    bandRatioTop: 0.896,
    bandRatioH: 0.102,
    bandTextColor: '#1E130D',
    valveClearCenterRatio: 0.28,
  },
  rear: {
    x: 24.2,
    y: 10.2,
    w: 51.2,
    h: 83.0,
    bandRatioTop: 0.896,
    bandRatioH: 0.102,
    bandTextColor: '#1E130D',
  },
};
