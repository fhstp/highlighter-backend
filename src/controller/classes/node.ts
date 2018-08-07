/**
 * @author Armin Kirchknopf mt151045
 * @description Repräsentiert einen Node im Treemodel
 */
export class Node {  
    constructor(
        public id: number,
        public term: string,
        public parent?: number
    ) {
    }
}