/**
 * @author Armin Kirchknopf mt151045
 * @description Routenhandling für den TreeController
 */
import { TreeController } from '../controller';
import { RestController } from './restController';
import { RoutesInterface } from './routesInterface';

export class TreeRestController extends RestController
  implements RoutesInterface {
  constructor(app: any) {
    super(app, new TreeController());
    this.setRoutes();
  }

  setRoutes(): void {

    this.app
      .route('/tree')
      .get((req, res) => this.controller.findAllTrees(req, res))
      .post((req, res) => this.controller.insertTree(req, res));

    this.app
      .route('/tree/:treeId')
      .get((req, res) => this.controller.findTreeByID(req, res))
  }
}
