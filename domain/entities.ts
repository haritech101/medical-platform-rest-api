export type Survey = {
    id: string;
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
    questions?: Array<Question>;
};

export type QuestionChoice = {
    value: any;
    text: string;
    imageLink?: string;
    customProperty?: any;
};

export type RateValue = {
    value: any;
    text: string;
    customProperty: any;
};

export type MultiTextItem = {
    name: any;
    title: string;
};

export type FieldValidator = {
    type: "numeric" | "text" | "email" | "expression" | "answercount" | "regex";
};

export type NumericValidator = FieldValidator & {
    minValue?: number;
    maxValue?: number;
};

export type TextValidator = FieldValidator & {
    allowDigits?: boolean;
    minLength?: number;
    maxLength?: number;
};

export type RegexValidator = FieldValidator & {
    regex?: string;
};

export type Question = {
    id: string;
    surveyId: string;
    name: string;
    title: string;
    order: number;
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
    validators?: Array<any>;
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
