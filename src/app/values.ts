type CropValues = [number, number, number, number, number]

export const cropValues: CropValues[] = [
    [3, 10, 18, 32, 90],
    [3, 12, 22, 36, 99],
    [4, 14, 24, 40, 108],
    [4, 16, 27, 44, 117],
    [5, 18, 30, 48, 126],
    [5, 20, 33, 52, 135],
    [6, 22, 36, 56, 144],
    [6, 24, 39, 60, 153],
    [6, 26, 42, 64, 162],
    [6, 28, 45, 68, 171],
    [8, 30, 48, 72, 180]
]

interface Prices {
    bucket: number[],
    well: number[],
    boots: number[],
    coins: number[],
    bag: number[],
    unlockRed: number,
    unlockGreen: number,
    unlockOrange: number,
    unlockPurple: number,
    red: number,
    green: number,
    orange: number,
    purple: number,
    gear: number
}

export const prices: Prices = {
    bucket: [8, 12, 20, 32, 48, 68, 92, 120, 152, 188], // TODO second not sure
    well: [10, 14, 22, 34, 50, 70, 94, 122, 154, 190], // TODO second not sure
    boots: [12, 16, 24, 36, 52],
    coins: [20, 24, 32, 44, 60, 80, 104, 132, 164, 200],
    bag: [25, 35, 50],
    unlockRed: 10,
    unlockGreen: 80,
    unlockOrange: 240,
    unlockPurple: 500,
    red: 2,
    green: 4,
    orange: 6,
    purple: 10,
    gear: 2000
}