import { Response } from "express";
import { BaseResponseWithData } from "../../domain/outputs";

export class BasePresenter {
    httpOutput: Response;

    setHttpOutput(httpOutput: Response) {
        this.httpOutput = httpOutput;
    }

    respondAsUsual(response: BaseResponseWithData) {
        this.httpOutput.status(response.code);
        this.httpOutput.json(response);
    }
}
