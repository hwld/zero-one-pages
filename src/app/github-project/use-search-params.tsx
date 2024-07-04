import { useSearchParams as useNextSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ZodSchema } from "zod";

export const useSearchParams = <Output,>(schema: ZodSchema<Output>) => {
  const searchParams = useNextSearchParams();

  const parsedParams: Output = useMemo(() => {
    const object = Object.fromEntries(searchParams.entries());
    return schema.parse(object);
  }, [schema, searchParams]);

  return parsedParams;
};
