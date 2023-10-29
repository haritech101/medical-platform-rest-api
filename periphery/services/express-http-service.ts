import express, { Application, Request, Response } from "express";
import { Server } from "http";
import { ISurveyOps } from "../../domain/inbound";
import { SurveyController } from "../controllers/survey-controller";
import bodyParser from "body-parser";

export class ExpressHTTPService {
    port: number;
    app: Application;
    httpServer: Server;
    surveyController: SurveyController;

    setPort(port: number): ExpressHTTPService {
        this.port = port;
        return this;
    }

    setSurveyController(controller: SurveyController): ExpressHTTPService {
        this.surveyController = controller;
        return this;
    }

    async start() {
        this.app = express();
        this.httpServer = this.app.listen(this.port);

        this.app.use(bodyParser.json());

        this.app.get("/hello", async (req: Request, res: Response) => {
            res.json({
                greeting: "Hello, World",
            });
        });

        this.app.use("/surveys", this.surveyController.getRouter());
    }

    async stop() {
        this.httpServer.close();
    }
}
