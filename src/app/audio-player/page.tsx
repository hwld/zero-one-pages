"use client";
import { useMemo, useState } from "react";
import { AudioPlayerCard, MusicNavigationDirection } from "./audio-player-card";
import { Music } from "lucide-react";
import { AudioProvider } from "./audio/audio-provider";
import { MusicListCard } from "./music-list-card";

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
      fileName: "sample-music-1",
      url: "/audio-player/sample1.mp3",
      sample: true,
    },
    {
      id: crypto.randomUUID(),
      fileName: "sample-music-2",
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

  const handleAddMusics = (musics: Music[]) => {
    setMusics((ms) => [...ms, ...musics]);
  };

  const handleDeleteMusic = (id: string) => {
    setMusics((ms) => ms.filter((m) => m.id !== id));
  };

  return (
    <AudioProvider src={currentMusic?.url}>
      <div
        className="grid h-[100dvh] w-full place-items-center bg-neutral-900 text-neutral-100"
        style={{ colorScheme: "dark" }}
      >
        <div className="grid grid-cols-[400px_400px] grid-rows-[500px] gap-4">
          <AudioPlayerCard
            currentMusic={currentMusic}
            hasPrev={!!prevMusic}
            hasNext={!!nextMusic}
            onMusicChange={handleMusicChange}
          />
          <MusicListCard
            musics={musics}
            currentMusicId={currentMusicId}
            onAddMusics={handleAddMusics}
            onDeleteMusic={handleDeleteMusic}
          />
        </div>
      </div>
    </AudioProvider>
  );
};

export default Page;
