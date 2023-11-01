import { Response } from "express";
import { ISurveyOpsListener } from "../../domain/outbound";
import {
    UpdateSurveyResponse,
    GetSurveysResponse,
    GetSurveyResponse,
    BaseResponse,
    OutputGenerator,
} from "../../domain/outputs";
import { BasePresenter } from "./base-presenter";

export class SurveyJSPresenter
    extends BasePresenter
    implements ISurveyOpsListener
{
    static fromHttpOutput(httpOutput: Response) {
        let presenter: SurveyJSPresenter = new SurveyJSPresenter();
        presenter.setHttpOutput(httpOutput);
        return presenter;
    }

    async onSurveyUpdated(response: UpdateSurveyResponse): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async onSurveysFetched(response: GetSurveysResponse): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async onSurveyFetched(response: GetSurveyResponse): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async onSurveyDeleted(response: BaseResponse): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async onSurveyHierarchyFetched(response: GetSurveyResponse): Promise<void> {
        if (!response.isSuccess) {
            this.respondAsUsual(response);
            return;
        }

        let { data } = response;

        let elements = data.questions.map((question) => {
            let element = {};

            for (let key in question) {
                if (key == "id") continue;
                if (key == "surveyId") continue;
                if (key == "order") continue;
                if (key == "htmlId") {
                    element["id"] = question[key];
                    continue;
                }

                element[key] = question[key];
            }

            return element;
        });

        let survey = {};
        for (let key in data) {
            if (key == "id") continue;
            if (key == "questions") continue;
            survey[key] = data[key];
        }

        survey["elements"] = elements;

        this.httpOutput.status(200);
        this.httpOutput.json(OutputGenerator.generateSuccess(survey));
    }
}
