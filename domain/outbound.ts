import {
    DeleteSurveyRequest,
    GetSurveyRequest,
    GetSurveysRequest,
    UpdateSurveyRequest,
} from "./inputs";
import {
    BaseResponse,
    GetSurveyResponse,
    GetSurveysResponse,
    UpdateSurveyResponse,
} from "./outputs";

export interface ISurveyOpsListener {
    onSurveyUpdated(response: UpdateSurveyResponse): Promise<void>;
    onSurveysFetched(response: GetSurveysResponse): Promise<void>;
    onSurveyFetched(response: GetSurveyResponse): Promise<void>;
    onSurveyDeleted(response: BaseResponse): Promise<void>;
}

export interface ISurveyStorageService {
    updateSurvey(request: UpdateSurveyRequest): Promise<UpdateSurveyResponse>;
    getSurvey(request: GetSurveyRequest): Promise<GetSurveyResponse>;
    getSurveys(request: GetSurveysRequest): Promise<GetSurveysResponse>;
    deleteSurvey(request: DeleteSurveyRequest): Promise<BaseResponse>;
}
