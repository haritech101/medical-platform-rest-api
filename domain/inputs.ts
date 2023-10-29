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
