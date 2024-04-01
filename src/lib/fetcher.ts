type Resource = Parameters<typeof fetch>[0];
type Options = Omit<RequestInit, "method" | "body"> & { body?: {} };

type Args = [Resource, Options?];

class Fetcher {
  private async fetch(
    method: string,
    resource: Resource,
    options?: Options,
  ): Promise<Response> {
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
    return this.fetch("POST", ...args);
  }

  public patch(...args: Args): Promise<Response> {
    return this.fetch("PATCH", ...args);
  }
}

export const fetcher = new Fetcher();
