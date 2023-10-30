import { IQuestionOps } from "../inbound";
import {
    UpdateQuestionRequest,
    GetQuestionsRequest,
    GetQuestionRequest,
    DeleteQuestionRequest,
} from "../inputs";
import { IQuestionOpsListener, IQuestionStorageService } from "../outbound";

export class QuestionUseCases implements IQuestionOps {
    private questionStorageService: IQuestionStorageService;

    setQuestionStorageService(
        service: IQuestionStorageService
    ): QuestionUseCases {
        this.questionStorageService = service;
        return this;
    }

    async updateQuestion(
        request: UpdateQuestionRequest,
        listener: IQuestionOpsListener
    ): Promise<void> {
        let response = await this.questionStorageService.updateQuestion(
            request
        );
        listener.onQuestionUpdated(response);
    }

    async getQuestionsBySurvey(
        request: GetQuestionsRequest,
        listener: IQuestionOpsListener
    ): Promise<void> {
        let response = await this.questionStorageService.getQuestionsBySurvey(
            request
        );
        listener.onQuestionsFetched(response);
    }

    async getQuestionById(
        request: GetQuestionRequest,
        listener: IQuestionOpsListener
    ): Promise<void> {
        let response = await this.questionStorageService.getQuestionById(
            request
        );
        listener.onQuestionFetched(response);
    }

    async deleteQuestionById(
        request: DeleteQuestionRequest,
        listener: IQuestionOpsListener
    ): Promise<void> {
        let response = await this.questionStorageService.deleteQuestionById(
            request
        );
        listener.onQuestionDeleted(response);
    }
}
