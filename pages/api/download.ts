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

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${info.videoDetails.title}.mp3"`
    );

    const videoReadableStream = ytdl(url, {
      filter: "audioonly",
      quality: "lowestaudio",
    });

    let contentLength = 0;

    // Calcular o tamanho total do arquivo
    videoReadableStream.on("response", (res) => {
      contentLength = parseInt(res.headers["content-length"] || "0");
    });

    // Transmitir o vídeo para a resposta
    await promisify(pipeline)(videoReadableStream, res);

    // Definir cabeçalho para o tamanho total do arquivo
    res.setHeader("Total-Bytes", contentLength.toString());

    res.status(200);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Ocorreu um erro." });
  }
}
