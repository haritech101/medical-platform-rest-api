import { Response, response } from "express";
import { ISurveyEntryOpsListener } from "../../domain/outbound";
import {
    UpdateSurveyEntryResponse,
    GetSurveyEntryResponse,
    GetSurveyEntriesResponse,
} from "../../domain/outputs";
import { BasePresenter } from "./base-presenter";

export class SurveyEntryPresenter
    extends BasePresenter
    implements ISurveyEntryOpsListener
{
    static fromHttpOutput(httpOutput: Response): SurveyEntryPresenter {
        let presenter = new SurveyEntryPresenter();
        presenter.setHttpOutput(httpOutput);
        return presenter;
    }

    async onSurveyEntryUpdated(
        response: UpdateSurveyEntryResponse
    ): Promise<void> {
        this.respondAsUsual(response);
    }

    async onSurveyEntryFetched(
        response: GetSurveyEntryResponse
    ): Promise<void> {
        this.respondAsUsual(response);
    }

    async onSurveyEntriesFetched(
        response: GetSurveyEntriesResponse
    ): Promise<void> {
        this.respondAsUsual(response);
    }
}
