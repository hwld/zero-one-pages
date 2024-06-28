import { TaskStatus } from "./store";

export const initialStatuses: TaskStatus[] = [
  {
    id: "1",
    color: "green",
    name: "Todo",
    description: "This item hasn't been started",
  },
  {
    id: "2",
    color: "orange",
    name: "In Progress",
    description: "This is actively being worked on",
  },
  {
    id: "3",
    color: "red",
    name: "On Hold",
    description: "This item is on hold",
  },
  {
    id: "4",
    color: "purple",
    name: "Done",
    description: "This has been completed",
  },
  {
    id: "5",
    color: "gray",
    name: "Archive",
    description: "This item has been archived",
  },
];
