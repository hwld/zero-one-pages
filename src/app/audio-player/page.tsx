"use client";
import { useMemo, useState } from "react";
import { TbMusicPlus } from "react-icons/tb";
import { Card } from "./card";
import { MusicFile } from "./music-file";
import { CardAudioPlayer, MusicNavigationDirection } from "./card-audio-player";
import { Music } from "lucide-react";

export type Music = {
  fileName: string;
  url: string;
  id: string;
  sample?: boolean;
};

const Page: React.FC = () => {
  const [musics, setMusics] = useState<Music[]>([
    {
      id: crypto.randomUUID(),
      fileName: "sample1",
      url: "/audio-player/sample1.mp3",
      sample: true,
    },
    {
      id: crypto.randomUUID(),
      fileName: "sample2",
      url: "/audio-player/sample2.mp3",
      sample: true,
    },
  ]);

  const [currentMusicId, setCurrentMusicId] = useState<string | undefined>(
    musics[0].id,
  );
  const currentMusic = useMemo(() => {
    const music = musics.find((m) => m.id === currentMusicId);
    if (!music) {
      return undefined;
    }

    return music;
  }, [currentMusicId, musics]);

  const prevMusic = useMemo((): Music | undefined => {
    const index = musics.findIndex((m) => m.id === currentMusicId);
    return musics[index - 1];
  }, [currentMusicId, musics]);

  const nextMusic = useMemo((): Music | undefined => {
    const index = musics.findIndex((m) => m.id === currentMusicId);
    return musics[index + 1];
  }, [currentMusicId, musics]);

  const handleMusicChange = (dir: MusicNavigationDirection) => {
    switch (dir) {
      case "first": {
        if (!musics[0]) {
          throw new Error("エピソードが存在しない");
        }
        setCurrentMusicId(musics[0].id);
        break;
      }
      case "prev": {
        if (!prevMusic) {
          throw new Error("前のエピソードが存在しない");
        }
        setCurrentMusicId(prevMusic.id);
        break;
      }
      case "next": {
        if (!nextMusic) {
          throw new Error("次のエピソードが存在しない");
        }
        setCurrentMusicId(nextMusic.id);
        break;
      }
      case "last": {
        const last = musics.at(-1);
        if (!last) {
          throw new Error("エピソードが存在しない");
        }
        setCurrentMusicId(last.id);
        break;
      }
      default: {
        throw new Error(dir satisfies never);
      }
    }
  };

  return (
    <div
      className="grid h-[100dvh] w-full place-items-center bg-neutral-900 text-neutral-100"
      style={{ colorScheme: "dark" }}
    >
      <div className="grid grid-cols-[400px_400px] grid-rows-[500px] gap-4">
        {currentMusic ? (
          <CardAudioPlayer
            currentMusic={currentMusic}
            hasPrev={!!prevMusic}
            hasNext={!!nextMusic}
            onMusicChange={handleMusicChange}
          />
        ) : (
          <Card />
        )}
        <div className="flex h-min max-h-full flex-col">
          <Card>
            <div className="flex min-h-0 grow flex-col gap-4">
              <div
                className="grid h-[230px] w-full shrink-0 place-items-center rounded-lg border-2 border-dashed border-neutral-500 bg-white/5"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fileCount = e.dataTransfer.files.length;
                  let musics = [...new Array(fileCount)]
                    .map((_, i) => e.dataTransfer.files[i])
                    .filter((f) => f.type.startsWith("audio/"))
                    .map((f): Music => {
                      return {
                        fileName: f.name,
                        url: URL.createObjectURL(f),
                        id: crypto.randomUUID(),
                      };
                    });
                  setMusics((ms) => [...ms, ...musics]);
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <TbMusicPlus className="size-[40px]" />
                  <div className="text-center text-sm">
                    ここに音声をドラッグ&ドロップしてください
                  </div>
                  <div className="text-center text-xs text-neutral-400">
                    音声はサーバーにアップロードされることはありません。
                    <br />
                    画面を更新するとリセットされます。
                  </div>
                </div>
              </div>

              {musics.length > 0 && (
                <div className="flex grow flex-col gap-2 overflow-hidden">
                  <div className="px-2 text-neutral-400">music files</div>
                  <div className="flex grow flex-col gap-4 overflow-auto rounded-lg px-2">
                    {musics.map((m) => {
                      const handleDelete = (id: string) => {
                        setMusics((ms) => ms.filter((m) => m.id !== id));
                      };

                      return (
                        <MusicFile
                          key={m.id}
                          id={m.id}
                          fileName={m.fileName}
                          onDelete={m.sample ? undefined : handleDelete}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
