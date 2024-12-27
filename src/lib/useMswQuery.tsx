import {
  QueryClient,

  // eslint-disable-next-line no-restricted-imports
  useQuery as __useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

// mswが起動していなければqueryを無効にする
export function useQuery(option: UseQueryOptions, client?: QueryClient) {
  return __useQuery({ ...option, enabled: option.enabled }, client);
}
