
export class RestController
{
    protected app: any;
    protected controller: any;

    constructor(app: any, controller: any)
    {
        this.app = app;
        this.controller = controller;
    }
}