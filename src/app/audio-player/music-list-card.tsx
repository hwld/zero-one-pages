import { TbMusicPlus } from "react-icons/tb";
import { Card } from "./card";
import { MusicFile } from "./music-file";
import { Music } from "./page";
import { useAudioContext } from "./audio/audio-provider";
import { MusicNavigationDirection } from "./audio-player-card";

type Props = {
  musics: Music[];
  prevMusicId: string | undefined;
  nextMusicId: string | undefined;
  currentMusicId: string | undefined;
  onAddMusics: (musics: Music[]) => void;
  onDeleteMusic: (id: string) => void;
  onMusicChange: (dir: MusicNavigationDirection) => void;
};
export const MusicListCard: React.FC<Props> = ({
  musics,
  prevMusicId,
  nextMusicId,
  currentMusicId,
  onAddMusics,
  onDeleteMusic,
  onMusicChange,
}) => {
  const { state, controls } = useAudioContext();

  const handleDeleteMusic = (id: string) => {
    if (id === currentMusicId) {
      if (prevMusicId) {
        onMusicChange("prev");
      } else if (nextMusicId) {
        onMusicChange("next");
      } else {
        onMusicChange("none");
      }
      controls.changePlaying(false);
    }
    onDeleteMusic(id);
  };

  return (
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
              onAddMusics(musics);
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
              <div className="flex items-center gap-2 px-2 text-neutral-400">
                music files
                <div className="grid size-6 shrink-0 place-items-center rounded-full bg-white/30 text-xs text-neutral-100">
                  {musics.length}
                </div>
              </div>
              <div className="flex grow flex-col gap-4 overflow-auto rounded-lg px-2">
                {musics.map((m) => {
                  const isCurrent = currentMusicId === m.id;
                  return (
                    <MusicFile
                      key={m.id}
                      id={m.id}
                      fileName={m.fileName}
                      onDelete={m.sample ? undefined : handleDeleteMusic}
                      isCurrentMusic={isCurrent}
                      isPlaying={isCurrent && state.playing}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
