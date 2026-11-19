import { GENERATED_ASSETS, PouchShapeId } from '../types/packaging';
import type { Point2D } from '../utils/perspectiveHomography';

export interface PanelOverlayRect {
  /** Bounding box left offset in % of the 3:4 or 1:1 scene image */
  x: number;
  /** Bounding box top offset in % of the 3:4 or 1:1 scene image */
  y: number;
  /** Bounding box width in % of the scene image */
  w: number;
  /** Bounding box height in % of the scene image */
  h: number;
  /** Exact 4-corner perspective quad [TL, TR, BR, BL] in % of image dimensions */
  quad: [Point2D, Point2D, Point2D, Point2D];
  /** Optional top padding % inside usable upper area (smaller when quad already starts below zipper/fin) */
  topPadPct?: number;
  /** Top ratio (0..1 of panel height) where bottom foil/copper band starts */
  bandRatioTop: number;
  /** Height ratio (0..1 of panel height) of bottom foil/copper band */
  bandRatioH: number;
  /** Ink color for bottom band text ('#1E130D' on gold foil, '#FAF5EB' on dark lip) */
  bandTextColor: string;
  /** Vertical center ratio (0..1) reserved for physical degassing valve if present */
  valveClearCenterRatio?: number;
  /** Composite exact coffee bean bed from uploaded Front 250g master over lower pouch area */
  useMasterBeans?: boolean;
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
      quad: [
        { x: 11.2, y: 26.3 },
        { x: 50.0, y: 26.3 },
        { x: 50.0, y: 81.8 },
        { x: 11.2, y: 81.8 },
      ],
      bandRatioTop: 0.903,
      bandRatioH: 0.097,
      bandTextColor: '#1E130D',
    },
    rear: {
      x: 52.3,
      y: 27.2,
      w: 29.2,
      h: 54.1,
      quad: [
        { x: 55.2, y: 28.0 },
        { x: 80.8, y: 27.2 },
        { x: 81.5, y: 81.3 },
        { x: 52.3, y: 78.6 },
      ],
      topPadPct: 18.5,
      bandRatioTop: 0.892,
      bandRatioH: 0.108,
      bandTextColor: '#1E130D',
    },
  },
  'doypack-valve': {
    baseImage: GENERATED_ASSETS.blankV2DoypackNatural,
    variantStyle: 'doypack',
    front: {
      x: 13.4,
      y: 33.8,
      w: 37.8,
      h: 45.2,
      quad: [
        { x: 13.4, y: 33.8 },
        { x: 51.2, y: 33.8 },
        { x: 48.8, y: 79.0 },
        { x: 15.6, y: 79.0 },
      ],
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
      quad: [
        { x: 52.8, y: 34.2 },
        { x: 90.8, y: 34.2 },
        { x: 88.4, y: 79.8 },
        { x: 54.6, y: 79.8 },
      ],
      topPadPct: 21.5,
      bandRatioTop: 0.888,
      bandRatioH: 0.11,
      bandTextColor: '#1E130D',
    },
  },
  'tall-heritage': {
    baseImage: GENERATED_ASSETS.blankV3TallHeritage,
    variantStyle: 'heritage-mandala',
    front: {
      x: 14.4,
      y: 16.5,
      w: 35.8,
      h: 71.7,
      quad: [
        { x: 14.4, y: 16.5 },
        { x: 50.2, y: 16.5 },
        { x: 50.2, y: 88.2 },
        { x: 14.4, y: 88.2 },
      ],
      bandRatioTop: 0.916,
      bandRatioH: 0.084,
      bandTextColor: '#1E130D',
    },
    rear: {
      x: 59.5,
      y: 24.2,
      w: 28.3,
      h: 62.2,
      quad: [
        { x: 59.5, y: 24.2 },
        { x: 86.2, y: 25.5 },
        { x: 87.8, y: 83.8 },
        { x: 61.5, y: 86.4 },
      ],
      topPadPct: 18.5,
      bandRatioTop: 0.902,
      bandRatioH: 0.098,
      bandTextColor: '#1E130D',
    },
  },
  'tall-botanical': {
    baseImage: GENERATED_ASSETS.blankV4TallBotanical,
    variantStyle: 'botanical',
    front: {
      x: 17.0,
      y: 11.6,
      w: 37.4,
      h: 76.2,
      quad: [
        { x: 17.0, y: 11.6 },
        { x: 51.6, y: 15.2 },
        { x: 54.4, y: 86.0 },
        { x: 17.8, y: 87.8 },
      ],
      bandRatioTop: 0.908,
      bandRatioH: 0.092,
      bandTextColor: '#1E130D',
    },
    rear: {
      x: 60.2,
      y: 19.0,
      w: 33.6,
      h: 65.2,
      quad: [
        { x: 60.2, y: 19.0 },
        { x: 91.2, y: 20.2 },
        { x: 93.8, y: 82.0 },
        { x: 61.4, y: 84.2 },
      ],
      topPadPct: 18.5,
      bandRatioTop: 0.905,
      bandRatioH: 0.095,
      bandTextColor: '#1E130D',
    },
  },
  'tall-copper': {
    baseImage: GENERATED_ASSETS.blankV5TallCopper,
    variantStyle: 'copper',
    front: {
      x: 19.2,
      y: 21.8,
      w: 31.0,
      h: 63.6,
      quad: [
        { x: 19.2, y: 21.8 },
        { x: 50.2, y: 21.8 },
        { x: 50.2, y: 85.4 },
        { x: 19.2, y: 85.4 },
      ],
      bandRatioTop: 0.876,
      bandRatioH: 0.124,
      bandTextColor: '#FAF5EB',
      useMasterBeans: true,
    },
    rear: {
      x: 52.0,
      y: 26.8,
      w: 23.0,
      h: 58.8,
      quad: [
        { x: 58.2, y: 28.5 },
        { x: 75.0, y: 26.8 },
        { x: 72.2, y: 85.6 },
        { x: 52.0, y: 81.2 },
      ],
      topPadPct: 18.5,
      bandRatioTop: 0.872,
      bandRatioH: 0.128,
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
      quad: [
        { x: 12.8, y: 26.5 },
        { x: 48.8, y: 26.5 },
        { x: 48.8, y: 86.0 },
        { x: 12.8, y: 86.0 },
      ],
      bandRatioTop: 0.888,
      bandRatioH: 0.112,
      bandTextColor: '#1E130D',
      useMasterBeans: true,
    },
    rear: {
      x: 52.2,
      y: 31.0,
      w: 26.8,
      h: 55.2,
      quad: [
        { x: 58.2, y: 32.4 },
        { x: 79.0, y: 31.0 },
        { x: 77.6, y: 86.2 },
        { x: 52.2, y: 83.4 },
      ],
      topPadPct: 18.0,
      bandRatioTop: 0.865,
      bandRatioH: 0.115,
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
    quad: [
      { x: 24.2, y: 10.2 },
      { x: 75.4, y: 10.2 },
      { x: 75.4, y: 93.2 },
      { x: 24.2, y: 93.2 },
    ],
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
    quad: [
      { x: 24.2, y: 10.2 },
      { x: 75.4, y: 10.2 },
      { x: 75.4, y: 93.2 },
      { x: 24.2, y: 93.2 },
    ],
    topPadPct: 21.5,
    bandRatioTop: 0.896,
    bandRatioH: 0.102,
    bandTextColor: '#1E130D',
  },
};
