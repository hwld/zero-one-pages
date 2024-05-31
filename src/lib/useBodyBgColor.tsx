import { useEffect } from "react";

// UIページごとにdivにbackground-colorを指定して背景色を設定しているのだが、オーバースクロールによってbodyのbackground-colorが見えるのでそこも設定できるようにする。
export const useBodyBgColor = (bgColorClass: string) => {
  useEffect(() => {
    // tailwindcssを使ってるので、ここ以外で使われていないクラスは適用できないが、bodyのbgColorはだいたいページのbgとして使われてるので問題なさそう？
    document.body.classList.add(bgColorClass);
    return () => {
      document.body.classList.remove(bgColorClass);
    };
  }, [bgColorClass]);
};
