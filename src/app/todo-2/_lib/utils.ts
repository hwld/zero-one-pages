import { format as tempoFormat } from "@formkit/tempo";

export const format = (date: Date) => {
  return tempoFormat(date, "YYYY/MM/DD hh:mm:ss", "ja");
};

export const paginate = <T>(
  items: T[],
  { page, limit }: { page: number; limit: number },
): T[] => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return items.slice(startIndex, endIndex);
};
