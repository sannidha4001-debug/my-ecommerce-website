/**
 * Media rules shared by the seller form and (later) the Supabase upload route.
 *
 * Keeping the limits in one place means the browser validation and the server
 * validation cannot drift apart. Phase 3 imports the same constants in the
 * server action that signs the upload URL.
 */

export const MEDIA_LIMITS = {
  /** Maximum screenshots per listing. */
  maxImages: 8,
  /** 8 MB per screenshot. */
  maxImageBytes: 8 * 1024 * 1024,
  /** 50 MB for the optional preview video. */
  maxVideoBytes: 50 * 1024 * 1024,
  /** Keep videos short: 2 minutes. */
  maxVideoSeconds: 120,
  imageTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  videoTypes: ["video/mp4", "video/webm", "video/quicktime"] as const,
} as const;

export type MediaItem = {
  /** Stable id used as a React key and for cover reordering. */
  id: string;
  file: File;
  /** Browser object URL used for the local preview. */
  url: string;
  /** 0–100. Simulated while storage is not connected yet. */
  progress: number;
  /** Video length in seconds, read from metadata when available. */
  duration?: number;
};

export function createMediaId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${mb % 1 === 0 ? mb.toFixed(0) : mb.toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Read a video's duration without uploading it.
 * Resolves 0 when the browser cannot read the metadata (some MOV files), so a
 * preview is still shown instead of blocking the seller.
 */
export function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let settled = false;

    const finish = (value: number) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(value);
    };

    const timer = window.setTimeout(() => finish(0), 4000);

    video.preload = "metadata";
    video.onloadedmetadata = () =>
      finish(Number.isFinite(video.duration) ? video.duration : 0);
    video.onerror = () => finish(0);
    video.src = url;
  });
}
