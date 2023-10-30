import { Response } from "express";
import { IQuestionOpsListener } from "../../domain/outbound";
import {
    UpdateQuestionResponse,
    GetQuestionsResponse,
    GetQuestionResponse,
    BaseResponse,
} from "../../domain/outputs";
import { BasePresenter } from "./base-presenter";

export class QuestionPresenter
    extends BasePresenter
    implements IQuestionOpsListener
{
    static fromHttpOutput(httpOutput: Response) {
        let presenter = new QuestionPresenter();
        presenter.setHttpOutput(httpOutput);
        return presenter;
    }

    async onQuestionUpdated(response: UpdateQuestionResponse): Promise<void> {
        this.respondAsUsual(response);
    }

    async onQuestionsFetched(response: GetQuestionsResponse): Promise<void> {
        this.respondAsUsual(response);
    }

    async onQuestionFetched(response: GetQuestionResponse): Promise<void> {
        this.respondAsUsual(response);
    }

    async onQuestionDeleted(response: BaseResponse): Promise<void> {
        this.respondAsUsual(response);
    }
}
