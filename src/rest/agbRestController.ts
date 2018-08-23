
/**
 * @author Armin Kirchknopf mt151045
 * @description Routenhandling für den AGB Controller
 */
import { AGBController } from "../controller";
import { RestController } from "./restController";
import { RoutesInterface } from "./routesInterface";

export class AGBRestController extends RestController implements RoutesInterface
{

    constructor(app: any)
    {
        super(app, new AGBController());
        this.setRoutes();
    }

    setRoutes(): void
    {
        this.app.route('/agb')
            .get((req,res) => this.controller.findAllAGB(req,res))
            .post((req,res) => this.controller.createAGB(req,res));
    }
    
}