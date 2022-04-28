import { Note } from "./Key"

type Song = {
	notes: Note[];
	path: string;
	scale: string[];
}

export default Song;