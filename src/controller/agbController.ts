/**
 * @author Armin Kirchknopf mt151045
 * @description Der AGBController behinhaltet alle Methoden die Daten zur AGB, sei es Eingabe oder Verarbeitung oder Ausgabe behandelt. 
 */
import { Connection } from '../database';
import { Match } from './classes/index'
import { text } from 'body-parser';

export class AGBController {
         private _database: Connection;
         private tm = require('text-miner');

         constructor() {
           this._database = Connection.getInstance();
         }
         /**
          * 
          @description retourniert alle gefunden AGB's
          */
         public findAllAGB(req: any, res: any): void {
           this._database.agb
             .findAll()
             .then(agb => {
               res.status(200).json(agb);
             })
             .catch(err => {
               res.status(400).json(err);
             });
         }
         /**
          * @description insertet die übermittelte AGB und prozessiert sie und gibt mehrere prozessierte Datenstrukturen zurück ans Frontend
          */
         public createAGB(req: any, res: any): void {
           this._database.agb
             .create({ text: req.body.text })
             .then(agb => {
               //console.log(req.body.text);
               let corpus = new this.tm.Corpus([]);
               corpus.addDoc(agb.dataValues.text);

               let vocab_unfiltered: Array<string> = new this.tm.Terms(corpus).vocabulary;
               // Falls am Anfang oder Ende des Doks Whitespaces sind -> weg
               corpus.trim();
               // Alle unnötigen Whitespaces weg.
               corpus.clean();
               // Alle unnötigen \n weg -> eventuell drinnen lassen ? Wegen leichtere Anzeige danach am Frontend?
               corpus.removeNewlines();
               // alle nicht Unicode Zeichen weg
               corpus.removeInvalidCharacters();
               //alle Interpunctuation weg
               corpus.removeInterpunctuation();
               //console.log(vocab_unfiltered)
               let withStopWords10MostFrequentTerms = new this.tm.Terms(corpus).findFreqTerms(10);
               let withStopWords20MostFrequentTerms = new this.tm.Terms(corpus).findFreqTerms(20);
               let withStopWords30MostFrequentTerms = new this.tm.Terms(corpus).findFreqTerms(30);
               let vocabulary_filtered = new this.tm.Terms(corpus).vocabulary;
               //let process_agb = Array();
               let process_agb: { [id: string]: any } = {};

               process_agb['corpus'] = corpus;

               //Und das Ganze ohne Stopwörter
               let corpusWithoutStopwords = corpus.removeWords(this.tm.STOPWORDS.DE);
               let vocabWithoutStopwords = new this.tm.Terms(corpusWithoutStopwords).vocabulary;

               // Alle Wörter in Array mit und ohne Sonderzeichen, Filtering usw.
               process_agb['vocab_unfiltered'] = vocab_unfiltered;
               process_agb['vocabulary_filtered'] = vocabulary_filtered;
               process_agb['vocabulary_Without_Stopwords'] = vocabWithoutStopwords;

               // Nach Häufigkeiten 10, 20, und 30 häufigst vorkommenden Wörtern mit Stopwörtern
               process_agb['10_and_more_freq_terms_with_Stopwords'] = withStopWords10MostFrequentTerms;
               process_agb['20_and_more_freq_terms_with_Stopwords'] = withStopWords20MostFrequentTerms;
               process_agb['30_and_more_freq_terms_with_Stopwords'] = withStopWords30MostFrequentTerms;

               // Nach Häufigkeiten 10, 20, und 30 häufigst vorkommenden Wörtern ohne Stopwörtern

               let withoutStopWords10MostFrequentTerms = new this.tm.Terms(corpusWithoutStopwords).findFreqTerms(10);
               let withoutStopWords20MostFrequentTerms = new this.tm.Terms(corpusWithoutStopwords).findFreqTerms(20);
               let withoutStopWords30MostFrequentTerms = new this.tm.Terms(corpusWithoutStopwords).findFreqTerms(30);

               process_agb['10_and_more_freq_terms_without_Stopwords'] = withoutStopWords10MostFrequentTerms;
               process_agb['20_and_more_freq_terms_without_Stopwords'] = withoutStopWords20MostFrequentTerms;
               process_agb['30_and_more_freq_terms_without_Stopwords'] = withoutStopWords30MostFrequentTerms;

               // Sucht mal nach den Terms in den AGB's
               // Splitten den übergebenen Suchstring auf
                console.log(req.body.search);
               let searchTerms = Array<string>();
               searchTerms = req.body.search;
               let foundSearchTerms = Array();

               for (let i = 0; i < searchTerms.length; i++) {
                 let searchString = searchTerms[i];
                 foundSearchTerms.push(this.findMatch(searchString, vocab_unfiltered));
               }               
               process_agb['found_occurences'] = foundSearchTerms;

               // Markup einfügen
               let markupString: Array<string> = new this.tm.Terms(corpus).vocabulary;

               for (let term of foundSearchTerms) {
                 for (let match of term) {
                   // suche und finde den Term in der Vocabliste und setze das markup -> noch einfach Bold tags dran
                   markupString = this.markMatch(match, markupString);
                 }
               }

               process_agb['markupString'] = markupString;

               console.log(process_agb);
               res.status(201).json(process_agb);
             })
             .catch(err => {
               res.status(400).json(err);
             });
         }

         /**************    HELPER METHODS  ************************************************/

         /**
          * @param match: string
          * @param text string[]
          * @returns Match[]
          */
         private findMatch(match: string, text: Array<string>): Match[] {
           let reg = new RegExp(match);
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
    