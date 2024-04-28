export interface ThumbProps {
  url: string;
  width: number;
  height: number;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumb: ThumbProps;
}
