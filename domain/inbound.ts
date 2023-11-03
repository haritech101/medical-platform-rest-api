import {
    DeleteQuestionRequest,
    DeleteSurveyRequest,
    GetQuestionRequest,
    GetQuestionsRequest,
    GetSurveyEntriesRequest,
    GetSurveyEntryRequest,
    GetSurveyRequest,
    GetSurveysRequest,
    UpdateQuestionRequest,
    UpdateSurveyEntryRequest,
    UpdateSurveyRequest,
} from "./inputs";
import {
    IQuestionOpsListener,
    ISurveyEntryOpsListener,
    ISurveyOpsListener,
} from "./outbound";
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

    getSurveyHierarchy(
        request: GetSurveyRequest,
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

export interface ISurveyEntryOps {
    updateEntry(
        request: UpdateSurveyEntryRequest,
        listener: ISurveyEntryOpsListener
    ): Promise<void>;
    getEntries(
        request: GetSurveyEntriesRequest,
        listener: ISurveyEntryOpsListener
    ): Promise<void>;
    getEntryById(
        request: GetSurveyEntryRequest,
        listener: ISurveyEntryOpsListener
    ): Promise<void>;
}

export interface ISurveyResponseOps {}
