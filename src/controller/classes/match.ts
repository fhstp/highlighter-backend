/**
 * @author Armin Kirchknopf mt151045
 * @description Repräsentiert einen Treffer in der RegEx Suche.
 */
export class Match {
  
    constructor(
        public searchTerm: string,
        public match?: string,
        public index?: number
    ) {
    }

    public getSearchTerm(){
        return this.searchTerm;
    }
    public getMatch(){
        return this.match;
    }
    public getIndex(){
        return this.index;
    }

}