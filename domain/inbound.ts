import {
    DeleteSurveyRequest,
    GetSurveyRequest,
    GetSurveysRequest,
    UpdateSurveyRequest,
} from "./inputs";
import { ISurveyOpsListener } from "./outbound";
import {
    BaseResponse,
    GetSurveyResponse,
    GetSurveysResponse,
    UpdateSurveyResponse,
} from "./outputs";

export interface ISurveyOps {
    updateSurvey(
        request: UpdateSurveyRequest,
        listener: ISurveyOpsListener
    ): Promise<void>;

    getSurvey(
        request: GetSurveyRequest,
        listener: ISurveyOpsListener
    ): Promise<void>;

    getSurveys(
        request: GetSurveysRequest,
        listener: ISurveyOpsListener
    ): Promise<void>;

    deleteSurvey(
        request: DeleteSurveyRequest,
        listener: ISurveyOpsListener
    ): Promise<void>;
}

export interface IQuestionOps {}

export interface ISurveyResponseOps {}
