import "reflect-metadata";
import { Container } from "inversify";
import { MPJSMusicPlayer } from "./services/MPJSMusicPlayer";
import { ToneJSMusicPlayer } from "./services/ToneJSMusicPlayer";

const TYPES = {
	IMusicPlayer: Symbol.for("IMusicPlayer"),
}

const container = new Container();
container.bind(TYPES.IMusicPlayer).to(ToneJSMusicPlayer).inSingletonScope();
export { container, TYPES };
