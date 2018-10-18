export interface Edge {
    score: number;
    length: number;
    label: number;
}
export declare function findBestPath(edgeLists: Edge[][]): Edge[];
