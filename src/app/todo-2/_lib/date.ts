import { format as tempoFormat } from "@formkit/tempo";

export const format = (date: Date) => {
  return tempoFormat(date, "YYYY/MM/DD hh:mm:ss", "ja");
};
