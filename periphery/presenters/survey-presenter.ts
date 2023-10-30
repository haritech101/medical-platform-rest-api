import { Response } from "express";
import { ISurveyOpsListener } from "../../domain/outbound";
import {
    UpdateSurveyResponse,
    GetSurveysResponse,
    GetSurveyResponse,
    BaseResponse,
} from "../../domain/outputs";
import { BasePresenter } from "./base-presenter";

export class SurveyPresenter
    extends BasePresenter
    implements ISurveyOpsListener
{
    static fromHttpOutput(httpOutput: Response): SurveyPresenter {
        let presenter = new SurveyPresenter();
        presenter.setHttpOutput(httpOutput);
        return presenter;
    }

    async onSurveyUpdated(response: UpdateSurveyResponse): Promise<void> {
        this.respondAsUsual(response);
    }

    async onSurveysFetched(response: GetSurveysResponse): Promise<void> {
        this.respondAsUsual(response);
    }

    async onSurveyFetched(response: GetSurveyResponse): Promise<void> {
        this.respondAsUsual(response);
    }

    async onSurveyDeleted(response: BaseResponse): Promise<void> {
        this.respondAsUsual(response);
    }
}
