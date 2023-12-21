import Film from "@/lib/film";

interface SoldoutFilm {
  name: string;
  start: string;
  venue: string;
}

export function getSoldoutByFilm(film: Film) {
  return !!soldoutFilms.find(
    (soldout) =>
      soldout.name == film.name &&
      Date.parse(soldout.start) == film.time.start.getTime(),
  );
}

const keys = ["name", "start", "venue"] satisfies (keyof SoldoutFilm)[];
const soldoutFilms = [
  ["五月雪", "2023/11/09 18:00", "MUVIE"],
  ["獻給火山戀人的安魂曲", "2023/11/09 19:10", "信義威秀 11"],
  ["車頂上的玄天上帝", "2023/11/09 21:00", "MUVIE"],
  ["日安，我的母親", "2023/11/09 21:10", "信義威秀 11"],
  ["可憐的東西", "2023/11/10 11:30", "MUVIE"],
  ["國王說好個絕世奇機", "2023/11/10 16:40", "信義威秀 9"],
  ["（非）一般欲望", "2023/11/10 18:10", "MUVIE"],
  ["富都青年", "2023/11/10 19:00", "信義威秀 11"],
  ["三寶奇謀闖天關", "2023/11/10 21:30", "信義威秀 9"],
  ["本日公休", "2023/11/10 21:30", "信義威秀 7"],
  ["北極百貨的秋乃小姐", "2023/11/11 10:10", "信義威秀 11"],
  ["莎莉", "2023/11/11 11:50", "MUVIE"],
  ["老狐狸", "2023/11/11 14:30", "MUVIE"],
  ["罪後辯護＋司法講堂", "2023/11/11 15:30", "信義威秀 9"],
  ["野火蔓延時", "2023/11/11 17:10", "信義威秀 8"],
  ["世界末日又怎樣", "2023/11/11 20:50", "信義威秀 9"],
  ["青春並不溫柔", "2023/11/11 21:20", "信義威秀 7"],
  ["來日方苦", "2023/11/12 10:10", "信義威秀 7"],
  ["惡之地", "2023/11/12 10:20", "信義威秀 11"],
  ["罪美人", "2023/11/12 10:40", "MUVIE"],
  ["苦日方來", "2023/11/12 12:40", "信義威秀 7"],
  ["失控的照護＋司法講堂", "2023/11/12 13:10", "信義威秀 11"],
  ["小曉", "2023/11/12 14:00", "MUVIE"],
  ["富都青年+司法講堂", "2023/11/12 16:10", "信義威秀 11"],
  ["相見相忘", "2023/11/12 19:20", "信義威秀 8"],
  ["國王說好個絕世奇機", "2023/11/13 19:30", "信義威秀 11"],
  ["親愛的陌生人", "2023/11/13 21:50", "MUVIE"],
  ["青魚", "2023/11/14 12:00", "MUVIE"],
  ["李滄東：反諷的藝術", "2023/11/14 12:10", "信義威秀 7"],
  ["花腐", "2023/11/14 18:30", "信義威秀 11"],
  ["片場親密風暴＋司法講堂", "2023/11/14 18:30", "信義威秀 9"],
  ["診所", "2023/11/14 19:10", "信義威秀 8"],
  ["再見機器人", "2023/11/14 19:20", "MUVIE"],
  ["罪美人", "2023/11/14 21:50", "信義威秀 9"],
  ["五月雪", "2023/11/15 13:00", "信義威秀 7"],
  ["去唱卡拉OK吧！", "2023/11/15 18:50", "MUVIE"],
  ["進化症候群", "2023/11/15 18:50", "信義威秀 11"],
  ["失樂園", "2023/11/15 19:00", "信義威秀 7"],
  ["親愛的陌生人", "2023/11/15 21:30", "MUVIE"],
  ["親愛電影日記", "2023/11/15 21:50", "信義威秀 11"],
  ["不夠善良的我們：第1-2集", "2023/11/16 18:30", "信義威秀 11"],
  ["不夠善良的我們：第1-2集", "2023/11/16 18:30", "信義威秀 9"],
  ["燃冬", "2023/11/16 19:10", "MUVIE"],
  ["再見機器人", "2023/11/16 21:40", "信義威秀 7"],
  ["親愛的陌生人", "2023/11/17 13:10", "MUVIE"],
  ["不夠善良的我們：第1-2集", "2023/11/17 16:40", "信義威秀 8"],
  ["青魚", "2023/11/17 18:00", "MUVIE"],
  ["兩萬種蜜蜂", "2023/11/17 18:50", "信義威秀 11"],
  ["小曉", "2023/11/17 19:00", "信義威秀 7"],
  ["金馬獎入圍劇情短片B", "2023/11/17 19:20", "信義威秀 8"],
  ["崇陽俱樂部", "2023/11/18 10:30", "信義威秀 9"],
  ["老狐狸", "2023/11/18 10:40", "信義威秀 7"],
  ["衝三小劇場", "2023/11/18 13:00", "MUVIE"],
  ["八戒", "2023/11/18 14:40", "MUVIE"],
  ["北極百貨的秋乃小姐", "2023/11/18 15:20", "信義威秀 11"],
  ["人造天堂", "2023/11/18 15:20", "信義威秀 7"],
  ["親愛電影日記", "2023/11/18 17:20", "信義威秀 9"],
  ["漂流人生", "2023/11/18 19:30", "信義威秀 9"],
  ["黑鳥．黑莓．送貨員", "2023/11/19 11:00", "信義威秀 7"],
  ["可憐的東西", "2023/11/19 11:10", "MUVIE"],
  ["首", "2023/11/19 14:10", "MUVIE"],
  ["短片B：天上人間", "2023/11/19 14:10", "信義威秀 8"],
  ["火星叛客", "2023/11/19 14:50", "信義威秀 9"],
  ["日安，我的母親", "2023/11/19 16:40", "信義威秀 8"],
  ["愛是一把槍", "2023/11/19 16:50", "MUVIE"],
  ["我們來跳舞", "2023/11/19 18:20", "信義威秀 11"],
  ["填詞撚", "2023/11/19 19:00", "信義威秀 8"],
  ["惡之地", "2023/11/20 16:00", "MUVIE"],
  ["火上鍋", "2023/11/20 19:00", "MUVIE"],
  ["愛是一把槍", "2023/11/20 19:10", "信義威秀 7"],
  ["花腐", "2023/11/20 21:10", "信義威秀 8"],
  ["但願人長久", "2023/11/20 21:20", "信義威秀 11"],
  ["短片B：天上人間", "2023/11/21 16:00", "信義威秀 8"],
  ["惡之地", "2023/11/21 18:20", "MUVIE"],
  ["石門", "2023/11/21 18:30", "信義威秀 11"],
  ["世界末日又怎樣", "2023/11/21 18:30", "信義威秀 8"],
  ["來世還作人", "2023/11/21 19:30", "信義威秀 7"],
  ["可憐的東西", "2023/11/21 21:20", "MUVIE"],
  ["白日之下", "2023/11/22 18:40", "MUVIE"],
  ["火上鍋", "2023/11/22 19:00", "信義威秀 7"],
  ["年少日記", "2023/11/22 21:20", "MUVIE"],
  ["短片B：天上人間", "2023/11/22 21:30", "台北信義威秀影城15廳"],
  ["首", "2023/11/23 13:50", "MUVIE"],
  ["詩", "2023/11/23 18:30", "信義威秀 11"],
  ["愛情城事", "2023/11/23 19:00", "MUVIE"],
  ["愛情城事", "2023/11/23 19:00", "信義威秀 8"],
  ["燃冬", "2023/11/23 21:30", "信義威秀 9"],
  ["青魚", "2023/11/23 21:40", "信義威秀 11"],
  ["獻給火山戀人的安魂曲", "2023/11/24 11:10", "MUVIE"],
  ["可憐的東西", "2023/11/24 13:10", "MUVIE"],
  ["親愛的陌生人", "2023/11/24 16:10", "MUVIE"],
  ["診所", "2023/11/24 16:50", "信義威秀 7"],
  ["衝三小劇場", "2023/11/24 17:00", "信義威秀 11"],
  ["我的完美日常", "2023/11/24 18:30", "MUVIE"],
  ["年少日記", "2023/11/24 18:40", "信義威秀 11"],
  ["菠蘿，鳳梨", "2023/11/24 19:00", "信義威秀 9"],
  ["填詞撚", "2023/11/24 21:10", "信義威秀 11"],
  ["金馬獎入圍紀錄短片A", "2023/11/24 21:20", "信義威秀 7"],
  ["青魚", "2023/11/25 10:30", "信義威秀 9"],
  ["青春噢買尬", "2023/11/25 12:50", "信義威秀 9"],
  ["我的完美日常", "2023/11/25 12:50", "信義威秀 7"],
  ["國王說好個絕世奇機", "2023/11/25 14:00", "信義威秀 8"],
  ["衝三小劇場", "2023/11/25 15:10", "信義威秀 11"],
  ["李滄東：反諷的藝術", "2023/11/25 15:20", "信義威秀 7"],
  ["野火蔓延時", "2023/11/25 16:50", "信義威秀 11"],
  ["黑鳥．黑莓．送貨員", "2023/11/25 17:30", "信義威秀 9"],
  ["所有謊言的起源", "2023/11/25 17:30", "信義威秀 7"],
  ["小鎮有間電影院", "2023/11/25 19:50", "信義威秀 9"],
  ["茜茜與我", "2023/11/26 10:10", "信義威秀 11"],
  ["獻給火山戀人的安魂曲", "2023/11/26 10:30", "信義威秀 8"],
  ["去唱卡拉OK吧！", "2023/11/26 10:30", "信義威秀 7"],
  ["開展在即", "2023/11/26 12:50", "信義威秀 11"],
  ["最想念的季節", "2023/11/26 12:50", "信義威秀 7"],
  ["邊境無間", "2023/11/26 13:00", "信義威秀 9"],
  ["光之女", "2023/11/26 16:40", "信義威秀 8"],
  ["愛情城事", "2023/11/26 17:10", "信義威秀 7"],
  ["寶萊塢之我們相愛吧", "2023/11/26 18:30", "信義威秀 9"],
  ["X物語", "2023/11/26 19:10", "信義威秀 8"],
  ["惡之地", "2023/11/26 19:50", "信義威秀 7"],
  ["莊園魅影", "2023/11/26 21:50", "信義威秀 9"],
].map(
  (infos) =>
    Object.fromEntries(
      infos.map((info, i) => [keys[i], info]),
    ) as unknown as SoldoutFilm,
);