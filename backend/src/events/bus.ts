import mitt from "mitt";
import { EventMap } from "./events.types";

export const bus = mitt<EventMap>();
bus.on("vault:changed", async ({ path }: { path: string }) => {
bus.on("tts:speak", ({ text }: { text: string }) => {
bus.on("stt:result", ({ transcript, sessionId }: { transcript: string; sessionId: string }) => {
