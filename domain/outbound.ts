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
    BaseResponse,
    GetQuestionResponse,
    GetQuestionsResponse,
    GetSurveyEntriesResponse,
    GetSurveyEntryResponse,
    GetSurveyResponse,
    GetSurveysResponse,
    UpdateQuestionResponse,
    UpdateSurveyEntryResponse,
    UpdateSurveyResponse,
} from "./outputs";

export interface ISurveyOpsListener {
    onSurveyUpdated(response: UpdateSurveyResponse): Promise<void>;
    onSurveysFetched(response: GetSurveysResponse): Promise<void>;
    onSurveyFetched(response: GetSurveyResponse): Promise<void>;
    onSurveyDeleted(response: BaseResponse): Promise<void>;
    onSurveyHierarchyFetched(response: GetSurveyResponse): Promise<void>;
}

export interface IQuestionOpsListener {
    onQuestionUpdated(response: UpdateQuestionResponse): Promise<void>;
    onQuestionsFetched(response: GetQuestionsResponse): Promise<void>;
    onQuestionFetched(response: GetQuestionResponse): Promise<void>;
    onQuestionDeleted(response: BaseResponse): Promise<void>;
}

export interface ISurveyEntryOpsListener {
    onSurveyEntryUpdated(response: UpdateSurveyEntryResponse): Promise<void>;
    onSurveyEntryFetched(response: GetSurveyEntryResponse): Promise<void>;
    onSurveyEntriesFetched(response: GetSurveyEntriesResponse): Promise<void>;
}

export interface ISurveyStorageService {
    updateSurvey(request: UpdateSurveyRequest): Promise<UpdateSurveyResponse>;
    getSurvey(request: GetSurveyRequest): Promise<GetSurveyResponse>;
    getSurveys(request: GetSurveysRequest): Promise<GetSurveysResponse>;
    deleteSurvey(request: DeleteSurveyRequest): Promise<BaseResponse>;
}

export interface IQuestionStorageService {
    updateQuestion(
        request: UpdateQuestionRequest
    ): Promise<UpdateQuestionResponse>;
    getQuestionsBySurvey(
        request: GetQuestionsRequest
    ): Promise<GetQuestionsResponse>;
    getQuestionById(request: GetQuestionRequest): Promise<GetQuestionResponse>;
    deleteQuestionById(request: DeleteQuestionRequest): Promise<BaseResponse>;
}

export interface ISurveyEntryStorageService {
    updateEntry(
        request: UpdateSurveyEntryRequest
    ): Promise<UpdateSurveyEntryResponse>;
    getEntries(
        request: GetSurveyEntriesRequest
    ): Promise<GetSurveyEntriesResponse>;
    getEntryById(
        request: GetSurveyEntryRequest
    ): Promise<GetSurveyEntryResponse>;
}
