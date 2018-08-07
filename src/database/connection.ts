/**
 * @author Armin Kirchknopf mt151045
 * @description Hier wird die DB erstellt und alle Datenbankzugriffe, Tabellrnrelationen, Tabellen und Dummy Data gehandelt.
 */
import * as Sequelize from 'sequelize';

export class Connection
{
    private static _instance: Connection;
    private _sequelize: any;
    private _agb: any;
    private _tree: any;

    private constructor()
    {
        
        this._sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: 'localhost',
            dialect: 'mysql',
            logging: false
        });

        this.initDatabaseTables();
        this.initDatabaseRelations();

        // Wenn man DB neu beschreiben oder ändern will
        // this._sequelize.sync({force: true}).then(() => {

        // });

        this._sequelize.sync();
    }

    public static getInstance(): Connection
    {
        if(Connection._instance === null || Connection._instance === undefined)
        {
            Connection._instance = new Connection();
        }

        return Connection._instance;
    }

    private initDatabaseRelations(): void
    {
    }

    private initDatabaseTables():void
    {
        this._agb = this._sequelize.define('agb', {
            text: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        }),
            this._tree = this._sequelize.define('tree', {
                link: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                text: {
                    type: Sequelize.TEXT,
                    allowNull: false
                }
        })
    }

    get agb(): any{
        return this._agb;
    }
    get tree(): any{
        return this._tree;
    }
    get sequelize(): any 
    {
        return this._sequelize;
    }
}
