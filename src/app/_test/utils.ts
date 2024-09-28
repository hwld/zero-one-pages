/**
 *  @return アニメーションが完了したあとに解決するPromise
 */
// アニメーション中はpointer-events:noneが設定されることが多く、
// userEventはpointer-eventsを検証するため、そこで失敗する可能性がある。
// そのため、この関数を使用してアニメーションの完了を待つ
export const waitForAnimation = () => {
  // アニメーションがマイクロタスクとして実行されることが前提。
  // すべてのマイクロタスクを実行したあとに解決するPromiseを返す
  return new Promise((resolve) => setTimeout(() => resolve(undefined), 0));
};

/**
 * 本番環境で実行されたときにエラーを出す関数。
 * テスト用のContextProviderを公開するときなどに使用する
 */
export const errorIfProduction = () => {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.STORYBOOK === undefined
  ) {
    throw new Error(
      `本番環境で使用することができません。 ${JSON.stringify(process.env.STORYBOOK)}`,
    );
  }
};
