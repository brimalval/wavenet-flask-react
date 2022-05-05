import { Note } from "./Key"



type Song = {
	notes: {
		name: Note;
		duration: 4 | 2 | 1 | 0.5 | 0.25;
	}[];
	path: string;
	scale: string[];
	duration: number;
	title: string;
}

export default Song;