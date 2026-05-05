import mitt from "mitt";
import { EventMap } from "./events.types";

export const bus = mitt<EventMap>();
