import { cn } from "@/lib/utils";

export function YouTubeEmbed({
  videoId,
  title,
  start,
  className,
}: {
  videoId: string;
  title: string;
  // seconds into the video to start from
  start?: number;
  className?: string;
}) {
  return (
    <iframe
      key={`${videoId}-${start ?? 0}`}
      className={cn("aspect-video w-full rounded-4xl", className)}
      src={`https://www.youtube-nocookie.com/embed/${videoId}${start ? `?start=${start}` : ""}`}
      title={title}
      referrerPolicy="strict-origin-when-cross-origin"
      allow="encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
}
