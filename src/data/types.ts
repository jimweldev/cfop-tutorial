export type AlgSet = "oll" | "pll" | "f2l";

export type Alg = {
  alg: string;
  // SpeedCubeDB YouTube video showing this alg's finger tricks (missing only for F2L 7 and 8)
  videoId?: string;
  // speedcubedb community votes
  votes?: number;
};

export type AlgCase = {
  // "27" for OLL 27, "T" for T Perm
  id: string;
  name: string;
  group: string;
  // moves that create this case from a solved cube (yellow on top)
  setup: string;
  // last-layer sticker colors from speedcubedb: s = top face (9), f/r/b/l = side faces,
  // first 3 chars are the row touching the top layer. Letters: y w r o g b, l = gray (ignored)
  stickers: { s: string; f: string; r: string; b: string; l: string };
  // only algs that have a video (F2L 7/8: one alg without); algs[0] is the standard alg when it has one
  algs: Alg[];
};

// Intuitive F2L grouping, by the corner's top sticker vs the edge's top sticker
export type F2LCategory = "white-top" | "same" | "different";

export type F2LCase = AlgCase & { category: F2LCategory };
