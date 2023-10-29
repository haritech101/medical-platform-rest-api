export type Survey = {
    id: string;
    name: string;
    description: string;
};

export type Question = {
    surveyId: string;
    name: string;
    title: string;
    type: string;
};
