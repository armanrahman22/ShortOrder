"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vertex {
    constructor(edges, score) {
        this.score = -Infinity;
        this.backtraceVertex = null;
        this.backtraceEdge = null;
        this.edges = edges;
        this.score = score;
    }
}
class Graph {
    constructor(edgeLists) {
        const vertexCount = edgeLists.length;
        // NOTE: using label value of -1 as sentinel for no label.
        const defaultEdge = { score: 0, length: 1, label: -1 };
        this.vertices = edgeLists.map((edges, index) => {
            const score = index === 0 ? 0 : -Infinity;
            return new Vertex([defaultEdge, ...edges], score);
        });
        this.vertices.push(new Vertex([], -Infinity));
        // this.vertices = edgeLists.map((edges, index) => {
        //     const filteredEdges = edges.filter((edge) =>
        //         index + edge.length < vertexCount);
        //     if (index === vertexCount - 1) {
        //         // No default edge from final vertex.
        //         return new Vertex(filteredEdges);
        //     }
        //     else {
        //         // Other vertices get default edge to following vertex.
        //         return new Vertex([defaultEdge, ...filteredEdges]);
        //     }
        // });
    }
    findPath() {
        // Forward propate paths.
        this.vertices.forEach((vertex, index) => {
            vertex.edges.forEach((edge) => {
                const targetIndex = index + edge.length;
                if (targetIndex < this.vertices.length) {
                    const target = this.vertices[targetIndex];
                    const newScore = vertex.score + edge.score;
                    if (target.score < newScore) {
                        target.score = newScore;
                        target.backtraceVertex = vertex;
                        target.backtraceEdge = edge;
                    }
                }
            });
        });
        // Extract path by walking backwards from last vertex.
        const reversePath = [];
        let current = this.vertices[this.vertices.length - 1];
        while (current.backtraceVertex) {
            reversePath.push(current.backtraceEdge);
            current = current.backtraceVertex;
        }
        const forwardPath = reversePath.reverse();
        return forwardPath;
    }
}
function findBestPath(edgeLists) {
    const graph = new Graph(edgeLists);
    return graph.findPath();
}
exports.findBestPath = findBestPath;
//# sourceMappingURL=best_path.js.map