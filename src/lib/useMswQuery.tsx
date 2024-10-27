import {
  DefaultError,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useMswState } from "../app/_providers/msw-provider";

export function useMswQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  option: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  client?: QueryClient,
): DefinedUseQueryResult<TData, TError>;

export function useMswQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  option: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  client?: QueryClient,
): UseQueryResult<TData, TError>;

export function useMswQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  option: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  client?: QueryClient,
): UseQueryResult<TData, TError>;

// mswが起動していなければqueryを無効にする
export function useMswQuery(option: UseQueryOptions, client?: QueryClient) {
  const { isMockserverUp } = useMswState();

  return useQuery(
    { ...option, enabled: option.enabled && isMockserverUp },
    client,
  );
}
