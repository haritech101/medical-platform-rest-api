import { ISurveyOps } from "../inbound";
import {
    UpdateSurveyRequest,
    GetSurveyRequest,
    DeleteSurveyRequest,
    GetSurveysRequest,
} from "../inputs";
import { ISurveyOpsListener, ISurveyStorageService } from "../outbound";

export class SurveyUseCases implements ISurveyOps {
    private surveyStorageService: ISurveyStorageService;

    public setSurveyStorageService(
        service: ISurveyStorageService
    ): SurveyUseCases {
        this.surveyStorageService = service;
        return this;
    }

    public async updateSurvey(
        request: UpdateSurveyRequest,
        listener: ISurveyOpsListener
    ): Promise<void> {
        let surveyResponse = await this.surveyStorageService.updateSurvey(
            request
        );
        await listener.onSurveyUpdated(surveyResponse);
    }

    public async getSurvey(
        request: GetSurveyRequest,
        listener: ISurveyOpsListener
    ): Promise<void> {
        let surveyResponse = await this.surveyStorageService.getSurvey(request);
        await listener.onSurveyFetched(surveyResponse);
    }

    public async getSurveys(
        request: GetSurveysRequest,
        listener: ISurveyOpsListener
    ): Promise<void> {
        let surveysResponse = await this.surveyStorageService.getSurveys(
            request
        );
        await listener.onSurveysFetched(surveysResponse);
    }

    public async deleteSurvey(
        request: DeleteSurveyRequest,
        listener: ISurveyOpsListener
    ): Promise<void> {
        let opResponse = await this.surveyStorageService.deleteSurvey(request);
        listener.onSurveyDeleted(opResponse);
    }
}
