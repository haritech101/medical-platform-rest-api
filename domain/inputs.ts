import {
    FieldValidator,
    MultiTextItem,
    NumericValidator,
    QuestionChoice,
    RateValue,
    RegexValidator,
    TextValidator,
} from "./entities";

export type UpdateSurveyRequest = {
    id?: string;
    name: string;
    title: string;
    description: string;
    allowCompleteSurveyAutomatic?: boolean;
    allowResizeComment?: boolean;
    autoGrowComment?: boolean;
    backgroundOpacity?: number;
    checkErrorsMode?: string;
    clearInvisibleValues?: boolean | string;
    completedBeforeHtml?: string;
    completeText?: string;
    data?: any;
    editText?: string;
    firstPageIsStarted?: boolean;
    focusFirstQuestionAutomatic?: boolean;
    focusOnFirstError?: boolean;
    autogonext?: boolean;
    keepIncorrectValues?: boolean;
    logo?: string;
    logoFit?: string;
    navigateToUrl?: string;
    pageNextText?: string;
    pagePrevText?: string;
    previewText?: string;
    progressBarType?: string;
    questionsOnPageMode?: string;
    requiredText?: string;
    showCompletedPage?: boolean;
    showPreviewBeforeComplete?: string;
    showProgressBar?: string;
    showTOC?: boolean;
    startSurveyText?: string;
    widthMode?: string;
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
    type:
        | "boolean"
        | "checkbox"
        | "comment"
        | "dropdown"
        | "tagbox"
        | "file"
        | "html"
        | "image"
        | "imagepicker"
        | "matrix"
        | "matrixdropdown"
        | "matrixdynamic"
        | "radiogroup"
        | "rating"
        | "ranking"
        | "signaturepad"
        | "text";
    title: string;
    order: number;
    description?: string;
    defaultValue?: any;
    errors?: Array<any>;
    htmlId?: string;
    isRequired?: boolean;
    readOnly?: boolean;
    requiredErrorText?: string;
    showCommentArea?: boolean;
    showOtherItem?: boolean;
    state?: "default" | "expanded" | "collapsed";
    validators?: Array<
        FieldValidator | TextValidator | NumericValidator | RegexValidator
    >;
    value?: any;
    autocomplete?: string;
    dataList?: Array<string>;
    inputType?: string;
    max?: string;
    maxErrorText?: string;
    maxLength?: number;
    min?: string;
    minErrorText?: string;
    placeholder?: string;
    step?: string;
    choices?: Array<QuestionChoice>;
    choicesOrder?: "none" | "asc" | "desc" | "random";
    isAllSelected?: boolean;
    itemComponent?: string;
    maxSelectedChoices?: number;
    minSelectedChoices?: number;
    noneText?: string;
    otherText?: string;
    selectAllText?: string;
    showNoneItem?: boolean;
    showSelectAllItem?: boolean;
    selectToRankEnabled?: boolean;
    showClearButton?: boolean;
    choicesMax?: number;
    choicesMin?: number;
    choicesStep?: number;
    acceptCarriageReturn?: boolean;
    allowResize?: boolean;
    autoGrow?: boolean;
    rateMax?: number;
    rateMin?: number;
    rateStep?: number;
    rateType?: "labels" | "stars" | "smileys";
    rateValues?: Array<RateValue>;
    contentMode?: "auto" | "image" | "video" | "youtube";
    imageFit?: string;
    imageHeight?: number;
    imageWidth?: number;
    multiSelect?: boolean;
    showLabel?: boolean;
    booleanValue?: any;
    labelFalse?: string;
    labelTrue?: string;
    valueFalse?: any;
    valueTrue?: any;
    altText?: string;
    imageLink?: string;
    html?: string;
    useDisplayValuesInDynamicTexts?: boolean;
    allowClear?: true;
    backgroundColor?: string;
    backgroundImage?: string;
    dataFormat?: "png" | "jpeg" | "svg";
    penColor?: string;
    signatureHeight?: number;
    signatureWidth?: number;
    showPlaceHolder?: boolean;
    items?: Array<MultiTextItem>;
    itemSize?: number;
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

export type UpdateSurveyEntryRequest = {
    id?: string;
    surveyId: string;
} & any;

export type GetSurveyEntriesRequest = {
    surveyId: string;
};

export type GetSurveyEntryRequest = {
    id: string;
};
