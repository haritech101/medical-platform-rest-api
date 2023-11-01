import { config } from "dotenv";
import { Defaults, EnvVars, ServiceFactory } from "../services/service-factory";
import axios, { AxiosResponse } from "axios";
import {
    UpdateQuestionRequest,
    UpdateSurveyRequest,
} from "../../domain/inputs";
import { expect } from "chai";
import {
    BaseResponse,
    GetQuestionResponse,
    GetQuestionsResponse,
    UpdateQuestionResponse,
    UpdateSurveyResponse,
} from "../../domain/outputs";

describe("HTTP requests for questions", () => {
    let factory: ServiceFactory;
    let url = "";

    beforeAll(async () => {
        config({ path: ".local/.env" });

        let httpPort = parseInt(
            process.env[EnvVars.httpPort] || Defaults.httpPort
        );
        url = `http://localhost:${httpPort}`;

        factory = ServiceFactory.getInstance();
        await factory.init();

        await factory.getHttpService().start();
    });

    describe("Create a new question", () => {
        let surveyId = "";
        let questionId = "";
        let questionName = "";

        beforeAll(async () => {
            let { id } = await createSurvey("Created with axios");
            surveyId = id;
        });

        it("Should create the new question", async () => {
            expect(surveyId).to.be.not.empty;

            let questionNumber = Math.floor(Math.random() * 100000);
            let questionName = `Created with axios ${questionNumber}`;

            let httpResponse = await axios({
                method: "post",
                url: `${url}/questions`,
                validateStatus: () => true,
                data: <UpdateQuestionRequest>{
                    surveyId,
                    name: questionName,
                    title: questionName,
                    type: "text",
                    order: 5,
                    showOtherItem: true,
                    showNoneItem: true,
                },
            });

            expect(httpResponse.status).to.equal(200);

            let questionResponse = <UpdateQuestionResponse>httpResponse.data;
            expect(questionResponse.isSuccess).to.be.true;

            let question = questionResponse.data;
            expect(question.id).to.be.not.undefined;
            expect(question.id).to.be.not.empty;
            expect(question.name).to.equal(questionName);
            expect(question.title).to.equal(questionName);
            expect(question.type).to.equal("text");
            expect(question.order).to.equal(5);
            expect(question.showOtherItem).to.be.true;
            expect(question.showNoneItem).to.be.true;

            questionId = question.id;
        });

        afterAll(async () => {
            await deleteSurveyAndQuestion(surveyId, questionId);
        });
    });

    describe("Update an existing question", () => {
        let surveyId = "";
        let questionId = "";
        let questionName = "";
        let modifiedName = "";

        beforeAll(async () => {
            let { id, name } = await createSurvey("Created with axios");
            surveyId = id;
            ({ id, name } = await createQuestion(
                surveyId,
                "Created with axios"
            ));
            questionId = id;
            questionName = name;
            modifiedName = questionName.replace("Created", "Modified");
        });

        it("Should update the specified question", async () => {
            let httpResponse = await axios({
                method: "put",
                url: `${url}/questions/${questionId}`,
                validateStatus: () => true,
                data: <UpdateQuestionRequest>{
                    surveyId,
                    name: modifiedName,
                    title: modifiedName,
                    type: "text",
                    order: 1,
                },
            });

            expect(httpResponse.status).to.equal(200);

            let questionResponse = <UpdateQuestionResponse>httpResponse.data;
            expect(questionResponse.isSuccess).to.be.true;

            let question = questionResponse.data;
            expect(question.id).to.equal(questionId);
            expect(question.surveyId).to.equal(surveyId);
            expect(question.name).to.equal(modifiedName);
            expect(question.title).to.equal(modifiedName);
            expect(question.order).to.equal(1);
            expect(question.showOtherItem).to.be.true;
            expect(question.showNoneItem).to.be.true;
        });

        afterAll(async () => {
            await deleteSurveyAndQuestion(surveyId, questionId);
        });
    });

    describe("Get the list of all questions inside a survey", () => {
        let surveyId = "";
        let questionId = "";
        let questionName = "";

        beforeAll(async () => {
            let { id, name } = await createSurvey("Created with axios");
            surveyId = id;
            ({ id, name } = await createQuestion(
                surveyId,
                "Created with axios"
            ));
            questionId = id;
            questionName = name;
        });

        it("Should get the list of questions", async () => {
            let httpResponse = await axios({
                method: "get",
                url: `${url}/surveys/${surveyId}/questions`,
                validateStatus: () => true,
            });

            expect(httpResponse.status).to.equal(200);

            let questionsResponse = <GetQuestionsResponse>httpResponse.data;
            expect(questionsResponse.isSuccess).to.be.true;

            let questions = questionsResponse.data;
            let needle = questions.find(
                (question) => (question.id = questionId)
            );
            expect(needle).to.be.not.undefined;
            expect(needle.name).to.equal(questionName);
            expect(needle.title).to.equal(questionName);
            expect(needle.type).to.equal("text");
            expect(needle.order).to.equal(5);
            expect(needle.showOtherItem).to.be.true;
            expect(needle.showNoneItem).to.be.true;
        });

        afterAll(async () => {
            await deleteSurveyAndQuestion(surveyId, questionId);
        });
    });

    describe("Get a question given its ID", () => {
        let surveyId = "";
        let questionId = "";
        let questionName = "";

        beforeAll(async () => {
            let { id, name } = await createSurvey("Created with axios");
            surveyId = id;
            ({ id, name } = await createQuestion(
                surveyId,
                "Created with axios"
            ));
            questionId = id;
            questionName = name;
        });

        it("Should get the specified question", async () => {
            let httpResponse = await axios({
                method: "get",
                url: `${url}/questions/${questionId}`,
                validateStatus: () => true,
            });

            expect(httpResponse.status).to.equal(200);

            let questionResponse = <GetQuestionResponse>httpResponse.data;
            expect(questionResponse.isSuccess).to.be.true;

            let question = questionResponse.data;
            expect(question.id).to.equal(questionId);
            expect(question.surveyId).to.equal(surveyId);
            expect(question.name).to.equal(questionName);
            expect(question.title).to.equal(questionName);
            expect(question.type).to.equal("text");
            expect(question.order).to.equal(5);
            expect(question.showOtherItem).to.be.true;
            expect(question.showNoneItem).to.be.true;
        });

        afterAll(async () => {
            await deleteSurveyAndQuestion(surveyId, questionId);
        });
    });

    describe("Delete a question", () => {
        let surveyId = "";
        let questionId = "";

        beforeAll(async () => {
            let { id } = await createSurvey("Created with axios");
            surveyId = id;
            ({ id } = await createQuestion(surveyId, "Created with axios"));
            questionId = id;
        });

        it("Should delete the specified question", async () => {
            let httpResponse = await axios({
                method: "delete",
                url: `${url}/questions/${questionId}`,
                validateStatus: () => true,
            });
            expect(httpResponse.status).to.equal(200);

            httpResponse = await axios({
                method: "get",
                url: `${url}/questions/${questionId}`,
                validateStatus: () => true,
            });
            expect(httpResponse.status).to.equal(404);

            let questionResponse = <GetQuestionResponse>httpResponse.data;
            expect(questionResponse.code).to.equal(404);
            expect(questionResponse.isSuccess).to.be.false;
        });

        afterAll(async () => {
            await deleteSurveyAndQuestion(surveyId);
        });
    });

    afterAll(async () => {
        await factory.getHttpService().stop();
    });

    async function createSurvey(namePrefix: string) {
        let surveyNumber = Math.floor(Math.random() * 100000);
        let name = `${namePrefix} ${surveyNumber}`;

        let httpResponse = await axios({
            method: "post",
            url: `${url}/surveys`,
            validateStatus: () => true,
            data: <UpdateSurveyRequest>{
                name,
                title: name,
                description: name,
            },
        });

        expect(httpResponse.status).to.equal(200);

        let { id } = (<UpdateSurveyResponse>httpResponse.data).data;

        return { id, name };
    }

    async function createQuestion(surveyId: string, namePrefix: string) {
        let questionNumber = Math.floor(Math.random());
        let name = `${namePrefix} ${questionNumber}`;

        let httpResponse = await axios({
            method: "POST",
            url: `${url}/questions`,
            validateStatus: () => true,
            data: <UpdateQuestionRequest>{
                surveyId,
                name,
                title: name,
                type: "text",
                order: 5,
                showOtherItem: true,
                showNoneItem: true,
            },
        });

        expect(httpResponse.status).to.equal(200);

        let { id } = (<UpdateQuestionResponse>httpResponse.data).data;

        return { id, surveyId, name };
    }

    async function deleteSurveyAndQuestion(
        surveyId: string,
        questionId?: string
    ) {
        let questionResponse: AxiosResponse;
        if (questionId)
            questionResponse = await axios({
                method: "delete",
                url: `${url}/questions/${questionId}`,
                validateStatus: () => true,
            });

        let surveyResponse = await axios({
            method: "delete",
            url: `${url}/surveys/${surveyId}`,
            validateStatus: () => true,
        });

        if (questionId) expect(questionResponse.status).to.equal(200);
        expect(surveyResponse.status).to.equal(200);
    }
});
