import "reflect-metadata";
import { Container } from "inversify";
import { MusicPlayer } from "./services/MusicPlayer";

const container = new Container();
container.bind(MusicPlayer).toSelf();
export { container };
