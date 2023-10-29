import { Question, Survey } from "./entities";

export type BaseResponse = {
    isSuccess: boolean;
    code: number;
    message: string;
};

export type BaseResponseWithData = BaseResponse & {
    data?: any;
};

export type UpdateSurveyResponse = BaseResponse & {
    data: Survey;
};

export type GetSurveyResponse = BaseResponse & {
    data: Survey;
};

export type GetSurveysResponse = BaseResponse & {
    data: Array<Survey>;
};

export type UpdateQuestionResponse = BaseResponse & { data: Question };

export type GetQuestionsResponse = BaseResponse & { data: Array<Question> };

export type GetQuestionResponse = BaseResponse & { data: Question };

export class OutputGenerator {
    public static generateError(
        message: string,
        code: number = 500,
        data?: any
    ): BaseResponseWithData {
        let theResponse: BaseResponseWithData = {
            isSuccess: false,
            code: code,
            message: message,
        };

        if (data != undefined && data != null) theResponse.data = data;

        return theResponse;
    }

    public static generateSuccess(data?: any): BaseResponseWithData {
        let theResponse: BaseResponseWithData = {
            isSuccess: true,
            code: 200,
            message: "OK",
        };

        if (data != undefined || data != null) theResponse.data = data;

        return theResponse;
    }
}
