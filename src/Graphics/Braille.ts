/**
 * [ 0 1 
 *   2 3
 *   4 5
 *   6 7 ]
 */
export default function getBrailleCharacter(points: boolean[]) {
    return String.fromCharCode(0x2800
        + (points[0] ? 0x1 : 0) + (points[1] ? 0x8 : 0)
        + (points[2] ? 0x2 : 0) + (points[3] ? 0x10 : 0)
        + (points[4] ? 0x4 : 0) + (points[5] ? 0x20 : 0)
        + (points[6] ? 0x40 : 0) + (points[7] ? 0x80 : 0)
    );
}
