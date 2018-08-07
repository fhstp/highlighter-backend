/**
 * @author Armin Kirchknopf mt151045
 * @description Der TreeController behinhaltet alle Methoden die Daten zum Tree, sei es Eingabe oder Verarbeitung oder Ausgabe behandelt. 
 */
import { Connection } from '../database';
import { Node } from './classes/index';

export class TreeController {
  private _database: Connection;

  constructor() {
    this._database = Connection.getInstance();
  }
  /**
   * 
   * @description retourniert alle Einträge aus der DB 
   */
  public findAllTrees(req: any, res: any): void {
    this._database.tree
      .findAll()
      .then(tree => {
        res.status(200).json(tree);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
  /**
   * @description retourniert für D3 am Frontend die Baumstruktur
   */
  public findTreeByID(req: any, res: any): void {
    this._database.tree
      .findById(req.params.treeId)
      .then(tree => {
        let depth = 1;
        if (
          req.query.depth !== 0 ||
          req.query.depth !== null ||
          req.query.depth !== undefined
        ) {
          depth = req.query.depth;
        }        
        res.status(200).json(this.createTreeData(req.query.startTerm, tree.text, depth));
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
  /**
   * 
   * @description erlaubt es einen Eintrag in den Tree-Table zu inserten
   */
  public insertTree(req: any, res: any): void {
    this._database.tree
      .create({
        link: req.body.link,
        text: req.body.text
      })
      .then(tree => {
        res.status(201).json(tree);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
  /**
   * 
   * @param startTerm  Root-Begriff von dem Baum startet
   * @param agb String aus der DB mit den AGB's
   * @param depth wieviele Ebenen der Baum haben soll
   * @description cleant und erzeugt die Baumdaten
   */
  private createTreeData(startTerm: string, agb: string, depth: number): any {
    let tm = require('text-miner');

    let corpus = new tm.Corpus([]);
    corpus.addDoc(agb);

    let vocab_unfiltered: Array<string> = new tm.Terms(corpus).vocabulary;
    // Falls am Anfang oder Ende des Doks Whitespaces sind -> weg
    corpus.trim();
    // Alle unnötigen Whitespaces weg.
    corpus.clean();
    // Alle unnötigen \n weg
    corpus.removeNewlines();
    // alle nicht Unicode Zeichen weg
    corpus.removeInvalidCharacters();
    //alle Interpunctuation weg
    corpus.removeInterpunctuation();
    // Splice in einzelne Arrayteile
    let agb_withoutStopwords = new corpus.removeWords(tm.STOPWORDS.DE);
    let agb_Arr = new tm.Terms(agb_withoutStopwords).vocabulary;

    // Counting start und return tree
    //console.log(agb_Arr);
    this.countWords(startTerm, agb_Arr, depth);
    return this.countWords(startTerm, agb_Arr, depth);
  }
  /**

   * @param startTerm  Root-Begriff von dem Baum startet
   * @param agb Gesäuberte Liste von Worten <Array>
   * @param depth wieviele Ebenen der Baum haben soll
   * @description cleant und erzeugt die Baumdaten
   */
  private countWords( startTerm: string, agb: Array<string>, depth: number ): any {
    let reg = new RegExp(startTerm);
    let results: Array<Node> = new Array<Node>();
    let parentNode: number = 0;

    results.push(new Node(0, startTerm));
    for (let i = 0; i <= depth; i++) {
      let j = i;
      results = this.pushNode(reg, results, agb, j);
    }
    return results;
  }
  /**
   * 
   * @param reg RegEx mit Suchbegriff
   * @param results Rückgabe Array von Nodes mit dem Stand des Baums
   * @param agb Gesäuberte Liste von Worten <Array>
   * @param parentNode Wie tief der Baum gerade ist
   */
  private pushNode( reg: RegExp,  results: Array<Node>, agb: Array<string>, parentNode: number ): Array<Node> {
    if (parentNode === 0) {
      for (let i = 0; i < agb.length; i++) {
        if (agb[i].match(reg) !== null) {
          if (agb[i + 1] !== null || agb[i + 1] !== undefined)
            results.push(new Node(i, agb[i + 1], parentNode));
        }
      }
    } else {
      // Gehe jeden Node durch der die Parent id davor hat und suche die Folgewörter raus.
      for (let nodes of results) {
        if (nodes.parent !== parentNode) {
          let reg = new RegExp(nodes.term);
          for (let i = 0; i < agb.length; i++) {
            if (agb[i].match(reg) !== null) {
              if (agb[i + 1] !== null || agb[i + 1] !== undefined) {
                results.push(new Node(i, agb[i + 1], parentNode));
              }
            }
          }
        }
      }
    }
    return results;
  }
}
