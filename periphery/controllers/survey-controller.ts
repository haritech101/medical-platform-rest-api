import { Request, Response, Router } from "express";
import {
    IQuestionOps,
    ISurveyEntryOps,
    ISurveyOps,
} from "../../domain/inbound";
import { UpdateSurveyRequest } from "../../domain/inputs";
import { QuestionPresenter } from "../presenters/question-presenter";
import { SurveyPresenter } from "../presenters/survey-presenter";
import { SurveyJSPresenter } from "../presenters/surveyjs-presenter";
import { SurveyEntryPresenter } from "../presenters/survey-entry-presenter";

export class SurveyController {
    private router: Router;
    private surveyOps: ISurveyOps;
    private questionOps: IQuestionOps;
    private surveyEntryOps: ISurveyEntryOps;

    setSurveyOps(ops: ISurveyOps): SurveyController {
        this.surveyOps = ops;
        return this;
    }

    setQuestionOps(ops: IQuestionOps): SurveyController {
        this.questionOps = ops;
        return this;
    }

    setSurveyEntryOps(ops: ISurveyEntryOps): SurveyController {
        this.surveyEntryOps = ops;
        return this;
    }

    constructor() {
        this.router = Router();

        this.router.get("/", this.getSurveys.bind(this));
        this.router.get("/:id", this.getSurvey.bind(this));
        this.router.get("/:id/questions", this.getQuestions.bind(this));
        this.router.post("/", this.updateSurvey.bind(this));
        this.router.put("/:id", this.updateSurvey.bind(this));
        this.router.delete("/:id", this.deleteSurvey.bind(this));
        this.router.get("/:id/surveyjs", this.getHierarchy.bind(this));
        this.router.get("/:id/responses", this.getSurveyEntries.bind(this));
    }

    async getSurveys(req: Request, res: Response) {
        await this.surveyOps.getSurveys(
            {},
            SurveyPresenter.fromHttpOutput(res)
        );
    }

    async getSurvey(req: Request, res: Response) {
        await this.surveyOps.getSurvey(
            {
                id: req.params.id,
            },
            SurveyPresenter.fromHttpOutput(res)
        );
    }

    async getHierarchy(req: Request, res: Response) {
        await this.surveyOps.getSurveyHierarchy(
            { id: req.params.id },
            SurveyJSPresenter.fromHttpOutput(res)
        );
    }

    async getSurveyEntries(req: Request, res: Response) {
        await this.surveyEntryOps.getEntries(
            { surveyId: req.params.id },
            SurveyEntryPresenter.fromHttpOutput(res)
        );
    }

    async updateSurvey(req: Request, res: Response) {
        let requestPayload: UpdateSurveyRequest = req.body;

        if (req.params.id) {
            requestPayload.id = req.params.id;
        }

        await this.surveyOps.updateSurvey(
            requestPayload,
            SurveyPresenter.fromHttpOutput(res)
        );
    }

    async deleteSurvey(req: Request, res: Response) {
        await this.surveyOps.deleteSurvey(
            { id: req.params.id },
            SurveyPresenter.fromHttpOutput(res)
        );
    }

    async getQuestions(req: Request, res: Response) {
        await this.questionOps.getQuestionsBySurvey(
            { surveyId: req.params.id },
            QuestionPresenter.fromHttpOutput(res)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
