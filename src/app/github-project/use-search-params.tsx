import { useSearchParams as useNextSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ZodSchema } from "zod";

export const useSearchParams = <Output,>(schema: ZodSchema<Output>) => {
  const searchParams = useNextSearchParams();

  const parsedParams: Output = useMemo(() => {
    const object = Object.fromEntries(searchParams.entries());
    const result = schema.safeParse(object);
    if (!result.success) {
      throw new SearchParamsError();
    }
    return result.data;
  }, [schema, searchParams]);

  return parsedParams;
};

export class SearchParamsError extends Error {
  static {
    this.prototype.name = "SearchParamsError";
  }
}
