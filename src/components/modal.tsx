import { ThumbProps } from "@/utils/video";
import { DownloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ModalProps {
  onClose: () => void;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  videoThumb: ThumbProps;
}
export function Modal({
  onClose,
  videoId,
  videoTitle,
  videoUrl,
  videoThumb,
}: ModalProps) {
  const router = useRouter();

  async function handleDonwload() {
    router.push(`api/download?url=${encodeURIComponent(videoUrl)}`);
  }

  return (
    <Dialog onOpenChange={onClose} open>
      <DialogContent key={videoId}>
        <DialogHeader className="mt-4 rounded">
          <DialogTitle>{videoTitle}</DialogTitle>

          <DialogDescription className="rounded">
            <a href={videoUrl} target="_blank">
              <Image
                alt={videoTitle}
                src={videoThumb.url}
                height={videoThumb.height}
                width={videoThumb.width}
                className="w-full rounded-lg cursor-pointer"
              />
            </a>
          </DialogDescription>
        </DialogHeader>

        <Button
          type="submit"
          size="default"
          className="space-x-2 w-full disabled:cursor-not-allowed"
          onClick={handleDonwload}
        >
          <DownloadIcon className="w-4 h-4" />
          <p>Baixar</p>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
