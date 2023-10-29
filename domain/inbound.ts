import {
    DeleteQuestionRequest,
    DeleteSurveyRequest,
    GetQuestionRequest,
    GetQuestionsRequest,
    GetSurveyRequest,
    GetSurveysRequest,
    UpdateQuestionRequest,
    UpdateSurveyRequest,
} from "./inputs";
import { IQuestionOpsListener, ISurveyOpsListener } from "./outbound";
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

export interface IQuestionOps {
    updateQuestion(
        request: UpdateQuestionRequest,
        listener: IQuestionOpsListener
    ): Promise<void>;
    getQuestionsBySurvey(
        request: GetQuestionsRequest,
        listener: IQuestionOpsListener
    ): Promise<void>;
    getQuestionById(
        request: GetQuestionRequest,
        listener: IQuestionOpsListener
    ): Promise<void>;
    deleteQuestionById(
        request: DeleteQuestionRequest,
        listener: IQuestionOpsListener
    ): Promise<void>;
}

export interface ISurveyResponseOps {}
