/** Named neighbourhoods from the brief, plus the rest of HK’s 18 districts. */
export const DISTRICTS = [
  { id: 'central', zhHant: '中環', zhHans: '中环', en: 'Central' },
  { id: 'sheung_wan', zhHant: '上環', zhHans: '上环', en: 'Sheung Wan' },
  { id: 'wan_chai', zhHant: '灣仔', zhHans: '湾仔', en: 'Wan Chai' },
  { id: 'causeway_bay', zhHant: '銅鑼灣', zhHans: '铜锣湾', en: 'Causeway Bay' },
  { id: 'tai_hang', zhHant: '大坑', zhHans: '大坑', en: 'Tai Hang' },
  { id: 'eastern', zhHant: '東區', zhHans: '东区', en: 'Eastern' },
  { id: 'southern', zhHant: '南區', zhHans: '南区', en: 'Southern' },
  { id: 'tst', zhHant: '尖沙咀', zhHans: '尖沙咀', en: 'Tsim Sha Tsui' },
  { id: 'mong_kok', zhHant: '旺角', zhHans: '旺角', en: 'Mong Kok' },
  { id: 'sham_shui_po', zhHant: '深水埗', zhHans: '深水埗', en: 'Sham Shui Po' },
  { id: 'kowloon_city', zhHant: '九龍城', zhHans: '九龙城', en: 'Kowloon City' },
  { id: 'wong_tai_sin', zhHant: '黃大仙', zhHans: '黄大仙', en: 'Wong Tai Sin' },
  { id: 'kwun_tong', zhHant: '觀塘', zhHans: '观塘', en: 'Kwun Tong' },
  { id: 'kwai_tsing', zhHant: '葵青', zhHans: '葵青', en: 'Kwai Tsing' },
  { id: 'tsuen_wan', zhHant: '荃灣', zhHans: '荃湾', en: 'Tsuen Wan' },
  { id: 'tuen_mun', zhHant: '屯門', zhHans: '屯门', en: 'Tuen Mun' },
  { id: 'yuen_long', zhHant: '元朗', zhHans: '元朗', en: 'Yuen Long' },
  { id: 'north', zhHant: '北區', zhHans: '北区', en: 'North' },
  { id: 'tai_po', zhHant: '大埔', zhHans: '大埔', en: 'Tai Po' },
  { id: 'sha_tin', zhHant: '沙田', zhHans: '沙田', en: 'Sha Tin' },
  { id: 'sai_kung', zhHant: '西貢', zhHans: '西贡', en: 'Sai Kung' },
  { id: 'islands', zhHant: '離島', zhHans: '离岛', en: 'Islands' },
] as const;

export type DistrictId = (typeof DISTRICTS)[number]['id'];

export const NEARBY_OF: Record<string, string[]> = {
  central: ['central', 'sheung_wan', 'wan_chai', 'admiralty'],
  sheung_wan: ['sheung_wan', 'central', 'sai_ying_pun'],
  wan_chai: ['wan_chai', 'causeway_bay', 'central', 'tai_hang'],
  causeway_bay: ['causeway_bay', 'wan_chai', 'tai_hang', 'eastern'],
  tai_hang: ['tai_hang', 'causeway_bay', 'wan_chai'],
  tst: ['tst', 'mong_kok', 'yau_ma_tei'],
  mong_kok: ['mong_kok', 'tst', 'sham_shui_po'],
  sham_shui_po: ['sham_shui_po', 'mong_kok', 'kowloon_city'],
};

export function districtLabel(
  id: string,
  lang: 'zh-Hant' | 'en' | 'zh-Hans',
): string {
  const row = DISTRICTS.find((d) => d.id === id);
  if (!row) return id;
  if (lang === 'en') return row.en;
  if (lang === 'zh-Hans') return row.zhHans;
  return row.zhHant;
}
