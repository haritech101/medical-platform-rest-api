import axios, { AxiosResponse } from "axios";
import { expect } from "chai";
import { config } from "dotenv";
import {
    GetSurveyRequest,
    UpdateQuestionRequest,
    UpdateSurveyRequest,
} from "../../domain/inputs";
import { Defaults, EnvVars, ServiceFactory } from "../services/service-factory";
import {
    GetSurveyResponse,
    GetSurveysResponse,
    UpdateQuestionResponse,
    UpdateSurveyResponse,
} from "../../domain/outputs";

describe("HTTP requests for survey", () => {
    config({
        path: ".local/.env",
    });

    let httpPort = process.env[EnvVars.httpPort] || Defaults.httpPort;

    let factory: ServiceFactory;
    let url = `http://localhost:${httpPort}`;

    beforeAll(async () => {
        factory = ServiceFactory.getInstance();
        await factory.init();

        factory.getHttpService().start();
    });

    describe("Create a survey", () => {
        let surveyId = "";

        it("Should create the survey", async () => {
            // arrange
            let surveyNumber = Math.floor(Math.random() * 10000);
            let surveyName = `Survey ${surveyNumber}`;
            let request: UpdateSurveyRequest = {
                name: surveyName,
                title: surveyName,
                description: "",
                previewText: "Preview",
                requiredText: "!",
            };

            // act
            let httpResponse = await axios({
                url: `${url}/surveys`,
                method: "POST",
                data: request,
                validateStatus: () => true,
            });

            // assert
            expect(httpResponse.status).to.equal(200);

            // pre assert
            let surveyResponse = <UpdateSurveyResponse>httpResponse.data;

            // assert
            expect(surveyResponse.isSuccess).to.be.true;

            // pre assert
            let survey = surveyResponse.data;

            // assert
            expect(survey.id).to.be.not.undefined;

            // pre assert
            for (let key in request) {
                expect(survey[key]).to.equal(request[key]);
            }

            surveyId = survey.id;
        });

        afterAll(async () => {
            await axios({
                url: `${url}/surveys/${surveyId}`,
                method: "delete",
                validateStatus: () => true,
            });
        });
    });

    describe("Get the list of created surveys", () => {
        let surveyId = "";
        let surveyNumber = Math.floor(Math.random() * 10000);
        let surveyName = `Created with axios ${surveyNumber}`;

        beforeAll(async () => {
            let httpResponse = await axios({
                method: "post",
                url: `${url}/surveys`,
                validateStatus: () => true,
                data: <UpdateSurveyRequest>{
                    name: surveyName,
                    title: surveyName,
                    description: "",
                    previewText: "Preview",
                    requiredText: "!",
                },
            });

            surveyId = (<UpdateSurveyResponse>httpResponse.data).data.id;
        });

        it("Should return the list of surveys", async () => {
            // act
            let httpResponse = await axios({
                url: `${url}/surveys`,
                method: "get",
                validateStatus: () => true,
            });

            // assert
            expect(httpResponse.status).to.equal(200);

            // pre assert
            let surveysResponse = <GetSurveysResponse>httpResponse.data;

            // assert
            expect(surveysResponse.isSuccess).to.be.true;

            // pre assert
            let surveys = surveysResponse.data;
            let needle = surveys.find((survey) => survey.id == surveyId);

            // assert
            expect(needle).to.be.not.undefined;
            expect(needle.name).to.equal(surveyName);
            expect(needle.title).to.equal(surveyName);
            expect(needle.description).to.be.empty;
            expect(needle.previewText).to.equal("Preview");
            expect(needle.requiredText).to.equal("!");
        });

        afterAll(async () => {
            await axios({
                url: `${url}/surveys/${surveyId}`,
                method: "delete",
                validateStatus: () => true,
            });
        });
    });

    describe("Get a specific survey by its ID", () => {
        let surveyId = "";
        let surveyNumber = Math.floor(Math.random() * 10000);
        let surveyName = `Created with axios ${surveyNumber}`;

        beforeAll(async () => {
            let httpResponse = await axios({
                method: "post",
                url: `${url}/surveys`,
                validateStatus: () => true,
                data: <UpdateSurveyRequest>{
                    name: surveyName,
                    title: surveyName,
                    description: "",
                    previewText: "Preview",
                    requiredText: "!",
                },
            });

            surveyId = (<UpdateSurveyResponse>httpResponse.data).data.id;
        });

        it("Should get the specified survey", async () => {
            // arrange
            let request = <GetSurveyRequest>{
                id: surveyId,
            };

            // act
            let httpResponse = await axios({
                method: "get",
                url: `${url}/surveys/${surveyId}`,
                validateStatus: () => true,
            });

            // assert
            expect(httpResponse.status).to.equal(200);

            // pre assert
            let surveyResponse = <GetSurveyResponse>httpResponse.data;

            // assert
            expect(surveyResponse.isSuccess).to.be.true;

            // pre assert
            let survey = surveyResponse.data;

            // assert
            expect(survey.name).to.equal(surveyName);
            expect(survey.title).to.equal(surveyName);
            expect(survey.id).to.equal(surveyId);
            expect(survey.previewText).to.equal("Preview");
            expect(survey.requiredText).to.equal("!");
        });

        afterAll(async () => {
            await axios({
                method: "delete",
                url: `${url}/surveys/${surveyId}`,
                validateStatus: () => true,
            });
        });
    });

    describe("Update an existing survey", () => {
        let surveyId = "";
        let surveyNumber = Math.floor(Math.random() * 10000);
        let surveyName = `Created with axios ${surveyNumber}`;
        let updatedName = `Modified with axios ${surveyNumber}`;

        beforeAll(async () => {
            let httpResponse = await axios({
                method: "post",
                url: `${url}/surveys`,
                validateStatus: () => true,
                data: <UpdateSurveyRequest>{
                    name: surveyName,
                    title: surveyName,
                    description: "",
                },
            });

            surveyId = (<UpdateSurveyResponse>httpResponse.data).data.id;
        }, 60000);

        it("Should modify the existing survey", async () => {
            expect(surveyId).to.be.not.empty;

            // act
            let httpResponse = await axios({
                method: "put",
                url: `${url}/surveys/${surveyId}`,
                validateStatus: () => true,
                data: <UpdateSurveyRequest>{
                    name: updatedName,
                    title: updatedName,
                    description: "",
                },
            });

            // assert
            expect(httpResponse.status).to.equal(200);

            // pre assert
            let surveyResponse = <UpdateSurveyResponse>httpResponse.data;

            // assert
            expect(surveyResponse.isSuccess).to.be.true;

            // pre assert
            let survey = surveyResponse.data;

            // assert
            expect(survey.id).to.equal(surveyId);
            expect(survey.name).to.equal(updatedName);
            expect(survey.title).to.equal(updatedName);
            expect(survey.previewText);
        }, 60000);

        afterAll(async () => {
            await axios({
                method: "delete",
                url: `${url}/surveys/${surveyId}`,
                validateStatus: () => true,
            });
        });
    });

    describe("Delete a survey", () => {
        let surveyId = "";
        let surveyNumber = Math.floor(Math.random() * 10000);
        let surveyName = `Created with axios ${surveyNumber}`;

        beforeAll(async () => {
            let httpResponse = await axios({
                method: "post",
                url: `${url}/surveys`,
                validateStatus: () => true,
                data: <UpdateSurveyRequest>{
                    name: surveyName,
                    description: "",
                },
            });

            surveyId = (<UpdateSurveyResponse>httpResponse.data).data.id;
        });

        it("Should delete the specified survey", async () => {
            expect(surveyId).to.be.not.empty;

            // act
            await axios({
                method: "delete",
                url: `${url}/surveys/${surveyId}`,
                validateStatus: () => true,
            });

            // pre assert
            let httpResponse = await axios({
                method: "get",
                url: `${url}/surveys/${surveyId}`,
                validateStatus: () => true,
            });

            let surveyResponse = <GetSurveyResponse>httpResponse.data;
            expect(surveyResponse.isSuccess).to.be.false;
            expect(surveyResponse.code).to.equal(404);
        });
    });

    afterAll(async () => {
        factory.getHttpService().stop();
    });
});
