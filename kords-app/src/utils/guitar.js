import { Soundfont } from "smplr";

export function getGuitar() {
    const guitarInstance = Soundfont(new AudioContext(), {
        instrument: "electric_guitar_clean",
        kit: "FluidR3_GM",
    });
    return guitarInstance;
}
export async function loadGuitar(setReady, guitar) {
    try {
        await guitar.load;
    } catch (error) {
        setReady(error);
        console.log(error)
    } finally {
        setReady(true);
    }
}

export function playGuitarNote(note, guitar) {
    guitar.start({ note: note, velocity: 100, duration: 1 });
}

export default { getGuitar, loadGuitar, playGuitarNote };