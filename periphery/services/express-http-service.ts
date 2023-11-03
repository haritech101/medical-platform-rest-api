import express, { Application, Request, Response } from "express";
import { Server } from "http";
import { ISurveyOps } from "../../domain/inbound";
import { SurveyController } from "../controllers/survey-controller";
import bodyParser from "body-parser";
import { QuestionController } from "../controllers/question-controller";
import cors from "cors";
import { SurveyEntryController } from "../controllers/survey-entry-controller";

export class ExpressHTTPService {
    port: number;
    app: Application;
    httpServer: Server;
    surveyController: SurveyController;
    questionController: QuestionController;
    surveyEntryController: SurveyEntryController;

    setPort(port: number): ExpressHTTPService {
        this.port = port;
        return this;
    }

    setSurveyController(controller: SurveyController): ExpressHTTPService {
        this.surveyController = controller;
        return this;
    }

    setQuestionController(controller: QuestionController): ExpressHTTPService {
        this.questionController = controller;
        return this;
    }

    setSurveyEntryController(
        controller: SurveyEntryController
    ): ExpressHTTPService {
        this.surveyEntryController = controller;
        return this;
    }

    async start() {
        this.app = express();
        this.httpServer = this.app.listen(this.port);

        this.app.use(cors());
        this.app.use(bodyParser.json());

        this.app.get("/hello", async (req: Request, res: Response) => {
            res.json({
                greeting: "Hello, World",
            });
        });

        this.app.use("/surveys", this.surveyController.getRouter());
        this.app.use("/questions", this.questionController.getRouter());
        this.app.use(
            "/survey-responses",
            this.surveyEntryController.getRouter()
        );
    }

    async stop() {
        this.httpServer.close();
    }
}
