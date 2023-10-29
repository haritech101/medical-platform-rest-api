export type UpdateSurveyRequest = {
    id?: string;
    name: string;
    description: string;
};

export type GetSurveyRequest = {
    id: string;
};

export type GetSurveysRequest = {
    offset?: number;
    limit?: number;
};

export type DeleteSurveyRequest = {
    id: string;
};

export type UpdateQuestionRequest = {
    surveyId: string;
    name: string;
    type: string;
    title: string;
};

export type GetQuestionsRequest = {
    surveyId: string;
};

export type GetQuestionRequest = {
    surveyId: string;
    name: string;
};

export type DeleteQuestionRequest = {
    surveyId: string;
    name: string;
};
