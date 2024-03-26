"use client";

import { Content } from "../content";
import { ContentContainer } from "../content-container";

const Page = () => {
  return (
    <div>
      <h1 className="mb-10 text-3xl font-bold">Stay</h1>
      <ContentContainer>
        {[...new Array(300)].map((_, i) => {
          return <Content key={i} />;
        })}
      </ContentContainer>
    </div>
  );
};

export default Page;
