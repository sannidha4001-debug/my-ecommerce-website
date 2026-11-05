"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ImagePlus,
  Info,
  Loader2,
  Star,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  createMediaId,
  formatFileSize,
  MEDIA_LIMITS,
  readVideoDuration,
  type MediaItem,
} from "@/lib/media";
import { cn } from "@/lib/utils";

export type MediaValue = {
  images: MediaItem[];
  video: MediaItem | null;
};

/**
 * Drag-and-drop uploader for listing screenshots + one short preview video.
 *
 * Phase 1/2 behaviour:
 *  - validates type, size, count and video length in the browser;
 *  - shows instant local previews through object URLs;
 *  - simulates the short "preparing" progress so the UI is finished.
 *
 * Phase 3 swaps the simulated progress for a signed Supabase Storage upload;
 * the component API (`onChange`) stays exactly the same.
 */
export function MediaUploader({
  onChange,
}: {
  onChange?: (value: MediaValue) => void;
}) {
  const { dict } = useI18n();
  const t = dict.sellPage;

  const [images, setImages] = useState<MediaItem[]>([]);
  const [video, setVideo] = useState<MediaItem | null>(null);
  const [draggingImages, setDraggingImages] = useState(false);
  const [draggingVideo, setDraggingVideo] = useState(false);
  const [readingVideo, setReadingVideo] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const objectUrls = useRef<string[]>([]);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ images, video });
  }, [images, video]);

  // Revoke every blob URL when the form unmounts, so memory is released.
  useEffect(() => {
    const urls = objectUrls.current;
    const pendingTimers = timers.current;
    return () => {
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function trackUrl(url: string) {
    objectUrls.current.push(url);
  }

  function releaseUrl(url: string) {
    URL.revokeObjectURL(url);
    objectUrls.current = objectUrls.current.filter((entry) => entry !== url);
  }

  function addImages(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const remaining = MEDIA_LIMITS.maxImages - images.length;

    if (remaining <= 0) {
      toast.error(t.tooManyImages);
      return;
    }

    const accepted: File[] = [];
    for (const file of files) {
      if (!(MEDIA_LIMITS.imageTypes as readonly string[]).includes(file.type)) {
        toast.error(t.wrongImageType, { description: file.name });
        continue;
      }
      if (file.size > MEDIA_LIMITS.maxImageBytes) {
        toast.error(t.imageTooLarge, { description: file.name });
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length > remaining) {
      toast.error(t.tooManyImages);
    }

    const nextItems: MediaItem[] = accepted.slice(0, remaining).map((file) => {
      const url = URL.createObjectURL(file);
      trackUrl(url);
      return {
        id: createMediaId(),
        file,
        url,
        progress: 0,
      };
    });

    if (nextItems.length === 0) return;

    setImages((current) =>
      [...current, ...nextItems].slice(0, MEDIA_LIMITS.maxImages),
    );

    // Simulated progress. Each item flips to "ready" shortly after mounting.
    nextItems.forEach((item, index) => {
      const timer = window.setTimeout(
        () => {
          setImages((current) =>
            current.map((entry) =>
              entry.id === item.id ? { ...entry, progress: 100 } : entry,
            ),
          );
        },
        400 + index * 120,
      );
      timers.current.push(timer);
    });
  }

  async function addVideo(file: File) {
    if (video) {
      toast.error(t.oneVideoOnly);
      return;
    }
    if (!(MEDIA_LIMITS.videoTypes as readonly string[]).includes(file.type)) {
      toast.error(t.wrongVideoType, { description: file.name });
      return;
    }
    if (file.size > MEDIA_LIMITS.maxVideoBytes) {
      toast.error(t.videoTooLarge, { description: file.name });
      return;
    }

    setReadingVideo(true);
    const duration = await readVideoDuration(file);
    setReadingVideo(false);

    if (duration > MEDIA_LIMITS.maxVideoSeconds) {
      toast.error(t.videoTooLong, { description: file.name });
      return;
    }

    const url = URL.createObjectURL(file);
    trackUrl(url);
    const item: MediaItem = {
      id: createMediaId(),
      file,
      url,
      progress: 0,
      duration,
    };

    setVideo(item);
    const timer = window.setTimeout(() => {
      setVideo((current) =>
        current && current.id === item.id ? { ...current, progress: 100 } : current,
      );
    }, 600);
    timers.current.push(timer);
  }

  function removeImage(id: string) {
    const target = images.find((item) => item.id === id);
    if (target) releaseUrl(target.url);
    setImages((current) => current.filter((item) => item.id !== id));
  }

  function removeVideo() {
    if (video) releaseUrl(video.url);
    setVideo(null);
  }

  function makeCover(id: string) {
    setImages((current) => {
      const target = current.find((item) => item.id === id);
      if (!target) return current;
      return [target, ...current.filter((item) => item.id !== id)];
    });
  }

  return (
    <div className="space-y-5">
      {/* ---------------- Screenshots ---------------- */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">{t.imagesLabel}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{t.imagesHint}</p>
          </div>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground">
            {images.length}/{MEDIA_LIMITS.maxImages}
          </span>
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label={t.dropImages}
          onClick={() => imageInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              imageInputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setDraggingImages(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDraggingImages(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDraggingImages(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDraggingImages(false);
            addImages(event.dataTransfer.files);
          }}
          className={cn(
            "mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center outline-none transition-all duration-300",
            draggingImages
              ? "border-primary/70 bg-primary/10 shadow-glow"
              : "border-border bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.04]",
          )}
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
            <ImagePlus className="h-5 w-5 text-violet-300" aria-hidden />
          </span>
          <p className="mt-3 text-xs font-medium text-foreground/85">
            {draggingImages ? t.dropActive : t.dropImages}
          </p>
          <span className="mt-2 rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-muted-foreground">
            {t.browse}
          </span>
          <input
            ref={imageInputRef}
            type="file"
            accept={MEDIA_LIMITS.imageTypes.join(",")}
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files) addImages(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        <AnimatePresence initial={false}>
          {images.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {images.map((item, index) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-black/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.file.name}
                    className="aspect-[4/3] w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-black/55 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-200 backdrop-blur">
                      <Star className="h-2.5 w-2.5 fill-current" aria-hidden />
                      {t.cover}
                    </span>
                  )}

                  {item.progress < 100 && (
                    <span className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
                      <span className="flex flex-col items-center gap-1.5">
                        <Loader2 className="h-5 w-5 animate-spin text-violet-200" aria-hidden />
                        <span className="text-[9px] font-medium text-white/80">
                          {t.preparing}
                        </span>
                      </span>
                    </span>
                  )}

                  <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-1">
                    {index === 0 ? (
                      <span className="inline-flex items-center gap-0.5 rounded bg-black/55 px-1.5 py-0.5 text-[8px] text-white/80 backdrop-blur">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" aria-hidden />
                        {t.ready}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makeCover(item.id)}
                        className="rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-medium text-white/90 backdrop-blur transition hover:bg-black/80"
                      >
                        {t.setCover}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      aria-label={`${t.remove} ${item.file.name}`}
                      className="grid h-6 w-6 place-items-center rounded-md bg-black/60 text-white/80 backdrop-blur transition hover:bg-rose-500/80 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                    </button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- Video ---------------- */}
      <div>
        <p className="text-sm font-semibold text-foreground">{t.videoLabel}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{t.videoHint}</p>

        {video ? (
          <div className="relative mt-3 overflow-hidden rounded-2xl border border-border bg-black">
            <video
              src={video.url}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full object-contain"
            />
            <div className="flex items-center gap-3 border-t border-border/60 bg-card/60 px-3 py-2">
              <Video className="h-4 w-4 shrink-0 text-violet-300" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium">{video.file.name}</p>
                <p className="text-[9px] text-muted-foreground">
                  {formatFileSize(video.file.size)}
                  {video.duration
                    ? ` · ${Math.floor(video.duration / 60)}:${String(
                        Math.round(video.duration % 60),
                      ).padStart(2, "0")}`
                    : ""}
                  {video.progress < 100 ? ` · ${t.preparing}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={removeVideo}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] text-muted-foreground transition hover:border-rose-400/40 hover:text-rose-300"
              >
                <Trash2 className="h-3 w-3" aria-hidden />
                {t.remove}
              </button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            aria-label={t.dropVideo}
            onClick={() => videoInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                videoInputRef.current?.click();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setDraggingVideo(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDraggingVideo(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDraggingVideo(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDraggingVideo(false);
              const file = event.dataTransfer.files[0];
              if (file) void addVideo(file);
            }}
            className={cn(
              "mt-3 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4 py-5 outline-none transition-all duration-300",
              draggingVideo
                ? "border-primary/70 bg-primary/10 shadow-glow"
                : "border-border bg-white/[0.02] hover:border-primary/40 hover:bg-white/[0.04]",
            )}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
              {readingVideo ? (
                <Loader2 className="h-4 w-4 animate-spin text-violet-300" aria-hidden />
              ) : (
                <UploadCloud className="h-4 w-4 text-violet-300" aria-hidden />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground/85">
                {draggingVideo ? t.dropActive : t.dropVideo}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{t.videoHint}</p>
            </div>
            <span className="hidden shrink-0 rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-muted-foreground sm:inline-block">
              {t.browse}
            </span>
            <input
              ref={videoInputRef}
              type="file"
              accept={MEDIA_LIMITS.videoTypes.join(",")}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void addVideo(file);
                event.target.value = "";
              }}
            />
          </div>
        )}
      </div>

      <p className="flex items-start gap-1.5 rounded-xl border border-sky-400/15 bg-sky-400/[0.05] px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-sky-300" aria-hidden />
        {t.localPreviewNote}
      </p>
    </div>
  );
}
