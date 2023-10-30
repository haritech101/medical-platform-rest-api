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
    id?: string;
    surveyId: string;
    name: string;
    type: string;
    title: string;
};

export type GetQuestionsRequest = {
    surveyId: string;
};

export type GetQuestionRequest = {
    id: string;
};

export type DeleteQuestionRequest = {
    id: string;
};
