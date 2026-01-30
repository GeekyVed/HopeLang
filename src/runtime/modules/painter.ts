export const painter = {
    forward: (distance: number) => {
        console.log(`>> FORWARD ${distance}`);
    },
    turn: (angle: number) => {
        console.log(`>> TURN ${angle}`);
    },
    penUp: () => {
        console.log(`>> PEN_UP`);
    },
    penDown: () => {
        console.log(`>> PEN_DOWN`);
    },
    setColor: (color: string) => {
        console.log(`>> COLOR ${color}`);
    }
};
