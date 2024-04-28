import { Modal } from "@/components/modal";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Video } from "@/utils/video";
import { zodResolver } from "@hookform/resolvers/zod";
import { MagicWandIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  url: z.string().url({ message: "A url do video e obrigatoria!" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

export default function Home() {
  const [video, setVideo] = useState<Video | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
  });

  function handleOpenModal() {
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  async function handleDownload(data: FormSchemaData) {
    try {
      const { url } = data;

      const result = await axios.post(
        `api/download?url=${encodeURIComponent(url)}`
      );

      handleOpenModal();
      setVideo(result.data);
    } catch (error) {
      toast.error("Error ao baixar o audio");
    } finally {
    }
  }

  return (
    <main className="w-full h-screen flex items-center justify-center">
      {video && openModal && (
        <Modal
          onClose={handleCloseModal}
          videoId={video.id}
          videoTitle={video.title}
          videoUrl={video.url}
          videoThumb={video.thumb}
        />
      )}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-4xl">Convertilify</CardTitle>
          <CardDescription>
            Baixe os audios dos seus videos do youtube de forma rapida e
            gratuita.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-2" onSubmit={handleSubmit(handleDownload)}>
            <div>
              <Input
                type="text"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className={cn("outline-none", errors.url && " border-red-500")}
                {...register("url")}
              />
              <small className="text-red-500">{errors.url?.message}</small>
            </div>

            <Button
              type="submit"
              size="default"
              className="space-x-2 w-full disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner className="w-5 h-5 fill-zinc-900 " />}

              {!isSubmitting && (
                <>
                  <MagicWandIcon className="w-5 h-5" />
                  <p>Converter...</p>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
