import { Request, Response, Router } from "express";
import { IQuestionOps } from "../../domain/inbound";
import { QuestionPresenter } from "../presenters/question-presenter";
import { UpdateQuestionRequest } from "../../domain/inputs";

export class QuestionController {
    private router: Router;
    private questionOps: IQuestionOps;

    constructor() {
        this.router = Router();
        this.router.post("/", this.updateQuestion.bind(this));
        this.router.put("/:id", this.updateQuestion.bind(this));
        this.router.get("/:id", this.getQuestion.bind(this));
        this.router.delete("/:id", this.deleteQuestion.bind(this));
    }

    getRouter() {
        return this.router;
    }

    setQuestionOps(ops: IQuestionOps): QuestionController {
        this.questionOps = ops;
        return this;
    }

    private async updateQuestion(req: Request, res: Response) {
        let updateRequest = <UpdateQuestionRequest>req.body;

        if (req.params.id) {
            updateRequest.id = req.params.id;
        }

        await this.questionOps.updateQuestion(
            updateRequest,
            QuestionPresenter.fromHttpOutput(res)
        );
    }

    private async getQuestion(req: Request, res: Response) {
        await this.questionOps.getQuestionById(
            { id: req.params.id },
            QuestionPresenter.fromHttpOutput(res)
        );
    }

    private async deleteQuestion(req: Request, res: Response) {
        await this.questionOps.deleteQuestionById(
            { id: req.params.id },
            QuestionPresenter.fromHttpOutput(res)
        );
    }
}
