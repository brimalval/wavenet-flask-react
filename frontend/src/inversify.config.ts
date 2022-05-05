import "reflect-metadata";
import { Container } from "inversify";
import { MPJSMusicPlayer } from "./services/MPJSMusicPlayer";

const TYPES = {
	IMusicPlayer: Symbol.for("IMusicPlayer"),
}

const container = new Container();
container.bind(TYPES.IMusicPlayer).to(MPJSMusicPlayer);
export { container, TYPES };
