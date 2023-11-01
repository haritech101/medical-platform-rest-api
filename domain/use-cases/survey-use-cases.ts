import { ISurveyOps } from "../inbound";
import {
    UpdateSurveyRequest,
    GetSurveyRequest,
    DeleteSurveyRequest,
    GetSurveysRequest,
} from "../inputs";
import {
    IQuestionStorageService,
    ISurveyOpsListener,
    ISurveyStorageService,
} from "../outbound";
import { GetSurveyResponse, OutputGenerator } from "../outputs";

export class SurveyUseCases implements ISurveyOps {
    private surveyStorageService: ISurveyStorageService;
    private questionStorageService: IQuestionStorageService;

    public setSurveyStorageService(
        service: ISurveyStorageService
    ): SurveyUseCases {
        this.surveyStorageService = service;
        return this;
    }

    public setQuestionStorageService(
        service: IQuestionStorageService
    ): SurveyUseCases {
        this.questionStorageService = service;
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

    public async getSurveyHierarchy(
        request: GetSurveyRequest,
        listener: ISurveyOpsListener
    ): Promise<void> {
        try {
            let { id } = request;
            let surveyResponse = await this.surveyStorageService.getSurvey({
                id,
            });
            if (!surveyResponse.isSuccess) {
                listener.onSurveyHierarchyFetched(surveyResponse);
                return;
            }
            let survey = surveyResponse.data;

            let questionsResponse =
                await this.questionStorageService.getQuestionsBySurvey({
                    surveyId: id,
                });
            if (!questionsResponse.isSuccess) {
                let { code, message, isSuccess } = questionsResponse;
                listener.onSurveyHierarchyFetched({
                    isSuccess,
                    code,
                    message,
                    data: null,
                });
                return;
            }

            survey.questions = questionsResponse.data;
            listener.onSurveyHierarchyFetched(
                <GetSurveyResponse>OutputGenerator.generateSuccess(survey)
            );
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            listener.onSurveyHierarchyFetched(
                <GetSurveyResponse>OutputGenerator.generateError(message)
            );
        }
    }

    public async deleteSurvey(
        request: DeleteSurveyRequest,
        listener: ISurveyOpsListener
    ): Promise<void> {
        let opResponse = await this.surveyStorageService.deleteSurvey(request);
        listener.onSurveyDeleted(opResponse);
    }
}
