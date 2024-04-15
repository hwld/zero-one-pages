import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type UseAudioParams = { initialVolume?: number };
export const useAudio = ({
  initialVolume: _initialVolume = 1,
}: UseAudioParams) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [initialVolume] = useState(_initialVolume);
  const [volume, setVolume] = useState(initialVolume);
  const [isSeeking, setIsSeeking] = useState(false);

  const changePlaying = useCallback((playing: boolean) => {
    if (!audioRef.current) {
      return;
    }

    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setPlaying(playing);
  }, []);

  const changeCurrentTime = useCallback(
    (currentTime: number) => {
      if (!audioRef.current) {
        return;
      }

      let valid = currentTime;
      if (currentTime < 0) {
        valid = 0;
      }
      if (currentTime > duration) {
        valid = duration;
      }

      audioRef.current.currentTime = valid;
      setCurrentTime(valid);
    },
    [duration],
  );

  const seek = useCallback(
    (currentTime: number) => {
      if (!audioRef.current) {
        return;
      }

      setIsSeeking(true);

      audioRef.current.pause();
      changeCurrentTime(currentTime);
    },
    [changeCurrentTime],
  );

  const seekEnd = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    setIsSeeking(false);

    window.setTimeout(() => {
      if (audioRef.current?.paused) {
        audioRef.current.play();
      }
    }, 0);
  }, []);

  const changeDuration = useCallback((duration: number) => {
    if (!audioRef.current) {
      return;
    }
    setDuration(duration);
  }, []);

  const changeVolume = useCallback((volume: number) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
    setVolume(volume);
  }, []);

  const onPlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const onPause = useCallback(() => {
    if (!isSeeking) {
      changePlaying(false);
    }
  }, [changePlaying, isSeeking]);

  const prevTime = useRef(0);
  const onTimeUpdate = useCallback((e: SyntheticEvent<HTMLAudioElement>) => {
    const currentTime = e.currentTarget.currentTime;
    if (Math.floor(prevTime.current) === Math.floor(currentTime)) {
      return;
    }

    setCurrentTime(currentTime);
    prevTime.current = currentTime;
  }, []);

  const onDurationChange = useCallback(
    (e: SyntheticEvent<HTMLAudioElement>) => {
      changeDuration(e.currentTarget.duration);
    },
    [changeDuration],
  );

  const onEnded = useCallback(() => {
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.volume = initialVolume;
  }, [initialVolume]);

  const state = useMemo(() => {
    return { playing, currentTime, duration, volume, isSeeking };
  }, [currentTime, duration, isSeeking, playing, volume]);

  const controls = useMemo(() => {
    return {
      changeCurrentTime,
      changeDuration,
      seek,
      seekEnd,
      changePlaying,
      changeVolume,
    };
  }, [
    changeCurrentTime,
    changeDuration,
    changePlaying,
    changeVolume,
    seek,
    seekEnd,
  ]);

  const handlers = useMemo(() => {
    return {
      onPlay,
      onPause,
      onTimeUpdate,
      onDurationChange,
      onEnded,
    };
  }, [onDurationChange, onEnded, onPause, onPlay, onTimeUpdate]);

  return { audioRef, state, controls, handlers };
};
