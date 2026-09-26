/**
 * ==============================================================================
 * CENTRALIZED SCROLL EXPERIENCE CONFIGURATION
 * Single source of truth for 3D Canvas properties, frame sequences,
 * camera parameters, layer hierarchy, and scroll telemetry.
 * ==============================================================================
 */

export const CHAPTERS = [
  {
    id: 1,
    folder: 'ezgif-20453c58589fe7f0-jpg',
    chapterNum: '01',
    title: 'THE COSMIC VOID',
    subtitle: 'ORIGIN // INCEPTION AT ZERO',
    desc: 'Deep space genesis. Before architecture, before silicon, there was raw curiosity and an empty vacuum waiting to be ignited by human intellect.',
    code: 'SEC-01 // VOID-INIT',
    frameCount: 300,
    apogee: '420 KM',
    velocity: '7.66 KM/S',
    signal: '99.8% NOMINAL',
  },
  {
    id: 2,
    folder: 'ezgif-2a0d9360cfda774a-jpg',
    chapterNum: '02',
    title: 'ORBITAL TRAJECTORY',
    subtitle: 'VECTORING INTO ORBIT',
    desc: 'Accelerating beyond gravitational constraints. Establishing computational trajectories, distributed telemetry, and high-frequency orbital links.',
    code: 'SEC-02 // ORBIT-VEC',
    frameCount: 240,
    apogee: '512 KM',
    velocity: '7.81 KM/S',
    signal: '99.4% LOCKED',
  },
  {
    id: 3,
    folder: 'ezgif-278a1d853b4e756b-jpg',
    chapterNum: '03',
    title: 'SPACE SCIENCE & EXPLORATION',
    subtitle: 'ASTRONOMICAL EXPLORATION',
    desc: 'Harnessing deep celestial observation, astrophysics modeling, deep-space spectral sensing, and autonomous interplanetary payloads.',
    code: 'SEC-03 // ASTRO-SPEC',
    frameCount: 240,
    apogee: '680 KM',
    velocity: '7.74 KM/S',
    signal: '99.9% CALIBRATED',
  },
  {
    id: 4,
    folder: 'ezgif-2df4780fdcfd6bba-jpg',
    chapterNum: '04',
    title: 'SUBSYSTEM TELEMETRY & AI',
    subtitle: 'NEURAL TELEMETRY & HARDWARE',
    desc: 'Interfacing embedded silicon with autonomous neural intelligence. Real-time edge compute across critical orbital payloads and LoRa mesh networks.',
    code: 'SEC-04 // NEURAL-SYS',
    frameCount: 240,
    apogee: '720 KM',
    velocity: '7.68 KM/S',
    signal: '100% SYNCHRONIZED',
  },
  {
    id: 5,
    folder: 'ezgif-2648f1735ee2e5c4-jpg',
    chapterNum: '05',
    title: 'COSMOS JEC GUILD',
    subtitle: 'COMMUNITY ARCHITECTURE',
    desc: 'The premier Science & Technology Guild of Jabalpur Engineering College (Est. 1947). Fostering student builders, researchers, and space innovators.',
    code: 'SEC-05 // GUILD-CORE',
    frameCount: 300,
    apogee: 'CAMPUS GROUND STATION',
    velocity: 'STATIONARY',
    signal: 'JEC-CENTRAL ONLINE',
  },
  {
    id: 6,
    folder: 'ezgif-2d9c0abdec6fddc5-jpg',
    chapterNum: '06',
    title: 'TECHBLITZ 2026',
    subtitle: 'FINALE // SYSTEM IGNITION',
    desc: 'The flagship national technological symposium. 6 engineering workshop tracks, 20+ hours of live labs, collegiate hackathons, and certified credentials.',
    code: 'SEC-06 // FINALE-LAUNCH',
    frameCount: 240,
    apogee: 'ORBITAL APEX',
    velocity: 'NOMINAL BURN',
    signal: 'MISSION GO FOR LAUNCH',
  },
];

export const TOTAL_FRAMES = 1560;

export const CHAPTER_RANGES = [
  { chapterIdx: 0, startFrame: 0, count: 300 },      // frames 0 - 299
  { chapterIdx: 1, startFrame: 300, count: 240 },    // frames 300 - 539
  { chapterIdx: 2, startFrame: 540, count: 240 },    // frames 540 - 779
  { chapterIdx: 3, startFrame: 780, count: 240 },    // frames 780 - 1019
  { chapterIdx: 4, startFrame: 1020, count: 300 },   // frames 1020 - 1319
  { chapterIdx: 5, startFrame: 1320, count: 240 },   // frames 1320 - 1559
];

/**
 * Predictable Layer Stacking Hierarchy (z-index definitions)
 */
export const LAYER_HIERARCHY = {
  BACKGROUND: 0,      // fixed inset-0 pointer-events-none z-0 (Three.js / WebGL / 2D Canvas)
  SCROLL_TRACK: 1,    // relative z-1 (Natural vertical document spacer height)
  HUD_OVERLAY: 10,    // fixed inset-0 pointer-events-none z-10 (Story text, badges, telemetry)
  INTERACTIVE: 20,    // relative z-20 pointer-events-auto (Content sections, timeline, buttons)
  NAVBAR: 40,         // fixed top-0 z-40 (Top navigation header)
};

/**
 * Scroll Physics & Animation Timings
 */
export const SCROLL_CONFIG = {
  TRACK_HEIGHT_MOBILE: '1200vh',
  TRACK_HEIGHT_DESKTOP: '1500vh',
  LERP_FACTOR: 0.08,             // Frame interpolation damping factor
  PROXIMITY_PRELOAD_WINDOW: 8,   // Dynamic sliding window around current frame
  KEYFRAME_SAMPLE_INTERVAL: 4,   // Fast preloading cadence
  MAX_DEVICE_PIXEL_RATIO: 2,     // High-DPI clamping for consistent frame rate
};

/**
 * Helper to construct frame file paths
 */
export const getFramePath = (chapterIdx, frameIdx) => {
  const chapter = CHAPTERS[chapterIdx];
  if (!chapter) return '';
  const frameNum = String(frameIdx + 1).padStart(3, '0');
  return `/frames/${chapter.folder}/ezgif-frame-${frameNum}.jpg`;
};

/**
 * Maps a global scroll progress (0.0 to 1.0) to chapter and local frame indices
 */
export const getProgressIndices = (progress) => {
  const clampedProgress = Math.max(0, Math.min(0.999999, progress));
  const exactGlobalFrame = clampedProgress * (TOTAL_FRAMES - 1);

  let chapterIdx = 0;
  let localFrameIdx = 0;

  for (let i = 0; i < CHAPTER_RANGES.length; i++) {
    const range = CHAPTER_RANGES[i];
    const endFrame = range.startFrame + range.count;

    if (exactGlobalFrame < endFrame || i === CHAPTER_RANGES.length - 1) {
      chapterIdx = range.chapterIdx;
      localFrameIdx = Math.min(
        Math.floor(exactGlobalFrame - range.startFrame),
        range.count - 1
      );
      break;
    }
  }

  return {
    chapterIdx,
    localFrameIdx,
    exactGlobalFrame,
    currentFrameNumber: localFrameIdx + 1,
    scrubPercent: Math.round(clampedProgress * 100),
  };
};
