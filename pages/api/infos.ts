import { NextApiRequest, NextApiResponse } from "next";
import { getBasicInfo } from "ytdl-core";

export const config = {
  api: {
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

    res.status(200).json({
      id: info.videoDetails.videoId,
      title: info.videoDetails.title,
      thumb: info.videoDetails.thumbnail.thumbnails[4],
      url: info.videoDetails.video_url,
    });
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro." });
  }
}
