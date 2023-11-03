import { Request, Response, Router } from "express";
import { ISurveyEntryOps } from "../../domain/inbound";
import { SurveyEntryPresenter } from "../presenters/survey-entry-presenter";

export class SurveyEntryController {
    private router: Router;
    private surveyEntryOps: ISurveyEntryOps;

    setSurveyEntryOps(ops: ISurveyEntryOps): SurveyEntryController {
        this.surveyEntryOps = ops;
        return this;
    }

    constructor() {
        this.router = Router();

        this.router.post("/", this.updateSurveyEntry.bind(this));
        this.router.get("/:id", this.getSurveyEntry.bind(this));
    }

    async updateSurveyEntry(req: Request, res: Response) {
        await this.surveyEntryOps.updateEntry(
            req.body,
            SurveyEntryPresenter.fromHttpOutput(res)
        );
    }

    async getSurveyEntry(req: Request, res: Response) {
        await this.surveyEntryOps.getEntryById(
            { id: req.params.id },
            SurveyEntryPresenter.fromHttpOutput(res)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
