/* eslint-disable no-restricted-globals */

type Resource = Parameters<typeof fetch>[0];
type FetchOptions = Omit<RequestInit, "method" | "body"> & { body?: {} };

type Args = [Resource, FetchOptions?];

class Fetcher {
  private isFirstFetch = true;

  private async fetch(
    method: string,
    resource: Resource,
    options?: FetchOptions,
  ): Promise<Response> {
    if ("serviceWorker" in navigator) {
      if (this.isFirstFetch) {
        this.isFirstFetch = false;
        const { setupMsw } = await import("../lib/msw");
        await setupMsw();
      }

      // MSWを使っているのだが、長時間立ち上げっぱなしにしていると404が出てしまうので、
      // fetchの前にactivateし直す
      //(参考:https://github.com/mswjs/msw/issues/2115)
      navigator.serviceWorker.controller?.postMessage("MOCK_ACTIVATE");
    }

    const body = options?.body && JSON.stringify(options.body);

    const res = await fetch(resource, {
      method,
      ...options,
      body,
    });

    if (!res.ok) {
      throw new Error(`${res.statusText} (${res.status})`);
    }

    return res;
  }

  public get(...args: Args): Promise<Response> {
    return this.fetch("GET", ...args);
  }

  public post(...args: Args): Promise<Response> {
    return this.fetch("POST", ...args);
  }
  public delete(...args: Args): Promise<Response> {
    return this.fetch("DELETE", ...args);
  }

  public put(...args: Args): Promise<Response> {
    return this.fetch("PUT", ...args);
  }

  public patch(...args: Args): Promise<Response> {
    return this.fetch("PATCH", ...args);
  }
}

export const fetcher = new Fetcher();
