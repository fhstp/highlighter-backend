/**
 * @author Armin Kirchknopf mt151045
 * @description Der AGBController behinhaltet alle Methoden die Daten zur AGB, sei es Eingabe oder Verarbeitung oder Ausgabe behandelt. 
 */
import { Match } from './classes/index'
import { text } from 'body-parser';

export class AGBController {

         constructor() {          
         }

         /**
          * @description prozessiert die übermittelten AGB's.
          */
         public createAGB(req: any, res: any): void {
               let link = req.body.link;
               link = link.trim();
               let vocab_unfiltered = (req.body.text as string).split(' ');
               
               let process_agb: { [id: string]: any } = {};

               
               let searchTerms: string;
               searchTerms =  JSON.parse(req.body.search);
               let foundSearchTerms = Array();     

               process_agb['searchTerms'] = searchTerms;
               for (let i = 0; i < searchTerms.length; i++) {
                 let searchString = searchTerms[i];
                 foundSearchTerms.push(this.findMatch(searchString, vocab_unfiltered));
               }               
               process_agb['found_occurences'] = foundSearchTerms;

               // Markup einfügen
               let markupString = (req.body.text as string).replace(/(?:\r\n|\r|\n)/g, " \n ").split(' ');
               for (let term of foundSearchTerms) {
                 for (let match of term) {
                   // suche und finde den Term in der Vocabliste und setze das markup
                   markupString = this.markMatch(match, markupString);
                 }
               }

               process_agb['markupString'] = markupString;
               process_agb['link'] = link;
               res.status(201).json(process_agb);
             }
         

         /**************    HELPER METHODS  ************************************************/

         /**
          * @param match: string
          * @param text string[]
          * @returns Match[]
          */
         private findMatch(match: string, text: Array<string>): Match[] {
           let reg = new RegExp(match, 'i'); // i = case insensitiv
           let result = Array<Match>();
           for (let term = 0; term < text.length; term++) {
             if (text[term].match(reg) != null) {
               result.push(new Match(match, text[term].match(reg).input, term));
             }
           }
           let trigger = 0;
           for (let single of result){
              if(single.getSearchTerm() === match){
                trigger++;                
              }
           }
           // Wenn kein Match drinnen war! -> damit dennoch eine Information ans Frontend geht.
           if (trigger === 0){
            result.push(new Match(match));
           }
           return result;
         }

         /**
          *
          * @param todo: Match
          * @param text: string[]
          * @returns string[]
          */
         private markMatch(todo: Match, text: string[]): string[] {
           let markup = `<span class='${todo.searchTerm.toLowerCase()}'>${todo.getMatch()}</span>`;
           text[todo.getIndex()] = markup;
           return text;
         }
       }
    