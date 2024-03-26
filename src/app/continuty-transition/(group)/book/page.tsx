"use client";

const Page = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Book</h1>
      <div className="mt-10 flex flex-wrap gap-4">
        {[...new Array(300)].map((_, i) => {
          return (
            <div
              key={i}
              className="h-[150px] w-[300px] rounded-lg bg-white/5"
            />
          );
        })}
      </div>
    </div>
  );
};

export default Page;
