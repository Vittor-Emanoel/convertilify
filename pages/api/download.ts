import { NextApiRequest, NextApiResponse } from "next";
import { pipeline } from "stream";
import { promisify } from "util";
import ytdl, { getBasicInfo } from "ytdl-core";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = req.query.url as string;

    if (!url) {
      throw new Error("URL não fornecida.");
    }

    const info = await getBasicInfo(url);

    if (!info) {
      throw new Error("Informações do vídeo não encontradas.");
    }

    const escapedTitle = escapeContentDispositionValue(info.videoDetails.title);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${escapedTitle}.mp3"`
    );
    res.setHeader(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    );

    const videoReadableStream = ytdl(url, {
      filter: "audioonly",
      quality: "lowestaudio",
    });

    // Calcular o tamanho total do arquivo
    videoReadableStream.on("response", (res) => {
      contentLength = parseInt(res.headers["content-length"] || "0");
    });

    let contentLength = 0;

    // Transmitir o vídeo para a resposta
    await promisify(pipeline)(videoReadableStream, res);

    res.setHeader("Total-Bytes", `${contentLength}`);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Ocorreu um erro." });
  }
}

function escapeContentDispositionValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9\-_. ]/g, "");
}
