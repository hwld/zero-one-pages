/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // これを指定することで、`/todo-2.html`ではなく`/todo-2/index.html`のようなファイルが生成され、
  // firebase hostingで`/todo-2`にアクセスすると`/todo-2/index.html`が返ってくるようになる。
  // が、メタデータは`/todo-2/index.txt`に存在するのだが、next.jsは`/todo-2.txt`を読むため、404エラーになる。
  // (https://github.com/vercel/next.js/issues/59986#issuecomment-1902073854)
  // そこで、このオプションは使用せず、firebase hostingのcleanUrlsを使用して、ファイルをアップロードするときにhtml拡張子を削除し、
  // `/todo-2`にアクセスしたときに`/todo-2`を返すようにする
  // trailingSlash: true,

  // https://github.com/mswjs/msw/issues/1801#issuecomment-1793911389
  webpack: (config, context) => {
    if (context?.isServer) {
      // next server build => ignore msw/browser
      if (Array.isArray(config.resolve.alias)) {
        // in Next the type is always object, so this branch isn't necessary. But to keep TS happy, avoid @ts-ignore and prevent possible future breaking changes it's good to have it
        config.resolve.alias.push({ name: "msw/browser", alias: false });
      } else {
        config.resolve.alias["msw/browser"] = false;
      }
    } else {
      // browser => ignore msw/node
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: "msw/node", alias: false });
      } else {
        config.resolve.alias["msw/node"] = false;
      }
    }
    return config;
  },
};

module.exports = nextConfig;
