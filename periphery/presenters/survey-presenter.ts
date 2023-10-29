import { Response } from "express";
import { ISurveyOpsListener } from "../../domain/outbound";
import {
    UpdateSurveyResponse,
    GetSurveysResponse,
    GetSurveyResponse,
    BaseResponse,
} from "../../domain/outputs";

export class SurveyPresenter implements ISurveyOpsListener {
    private httpOutput: Response;

    static fromHttpOutput(httpOutput: Response) {
        return new SurveyPresenter().setHttpOutput(httpOutput);
    }

    setHttpOutput(httpOutput: Response): SurveyPresenter {
        this.httpOutput = httpOutput;
        return this;
    }

    async onSurveyUpdated(response: UpdateSurveyResponse): Promise<void> {
        this.httpOutput.json(response);
    }

    async onSurveysFetched(response: GetSurveysResponse): Promise<void> {
        this.httpOutput.json(response);
    }

    async onSurveyFetched(response: GetSurveyResponse): Promise<void> {
        this.httpOutput.json(response);
    }

    async onSurveyDeleted(response: BaseResponse): Promise<void> {
        this.httpOutput.json(response);
    }
}
