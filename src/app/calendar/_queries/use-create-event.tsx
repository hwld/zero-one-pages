import { useMutation } from "@tanstack/react-query";
import { CreateEventInput, createEvent } from "../_mocks/api";

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: (input: CreateEventInput) => {
      return createEvent(input);
    },
  });
};
