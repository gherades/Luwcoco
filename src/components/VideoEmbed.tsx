function toEmbedUrl(url: string) {
  const youtuBe = url.match(/youtu\.be\/([\w-]+)/);
  if (youtuBe) return `https://www.youtube.com/embed/${youtuBe[1]}`;
  const watch = url.match(/[?&]v=([\w-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return null;
}

function CutMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <path d="M4 4l7.5 7.5M11.5 4 4 11.5" strokeDasharray="2.2 2.4" />
    </svg>
  );
}

export function VideoEmbed({ videoUrl, title }: { videoUrl: string; title: string }) {
  const embedUrl = toEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <div
      className="relative rounded-3xl p-3 sm:p-4"
      style={{
        backgroundColor: "#c3d3dc",
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(47,74,95,0.28) 0 6px, transparent 6px 15px), repeating-linear-gradient(90deg, rgba(47,74,95,0.28) 0 6px, transparent 6px 15px)",
      }}
    >
      <CutMark className="absolute left-2 top-2 text-thread-dark/70" />
      <CutMark className="absolute right-2 top-2 -scale-x-100 text-thread-dark/70" />
      <CutMark className="absolute bottom-2 left-2 -scale-y-100 text-thread-dark/70" />
      <CutMark className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100 text-thread-dark/70" />

      <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-dashed border-cream bg-ink">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
