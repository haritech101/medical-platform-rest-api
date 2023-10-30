export type Survey = {
    id: string;
    name: string;
    description: string;
};

export type Question = {
    id: string;
    surveyId: string;
    name: string;
    title: string;
    type: string;
};
