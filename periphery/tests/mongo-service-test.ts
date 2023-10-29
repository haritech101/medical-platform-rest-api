import { MongoService } from "../services/mongo-service";
import { config } from "dotenv";
import { Defaults, EnvVars } from "../services/service-factory";
import { expect } from "chai";
import {
    DeleteSurveyRequest,
    GetSurveyRequest,
    GetSurveysRequest,
    UpdateSurveyRequest,
} from "../../domain/inputs";

class MongoServiceTest {
    run() {
        describe("Mongo storage service", () => {
            let mongoService: MongoService = null;

            beforeAll(async () => {
                config({ path: ".local/.env" });

                let host = process.env[EnvVars.mongoHost] || Defaults.mongoHost;
                let port = parseInt(
                    process.env[EnvVars.mongoPort] || Defaults.mongoPort
                );
                let db = process.env[EnvVars.mongoDb];

                mongoService = new MongoService()
                    .setHost(host)
                    .setPort(port)
                    .setDb(db);
            });

            describe("Create a new survey", () => {
                let surveyId = "";

                it("New survey should be created", async () => {
                    // arrange
                    let surveyNumber = Math.floor(Math.random() * 10000);
                    let surveyName = `Survey ${surveyNumber}`;
                    let updateSurveyRequest: UpdateSurveyRequest = {
                        name: surveyName,
                        description: "",
                    };

                    // act
                    let updateSurveyResponse = await mongoService.updateSurvey(
                        updateSurveyRequest
                    );

                    // assert
                    expect(updateSurveyResponse.isSuccess).to.be.true;

                    // pre assert
                    let survey = updateSurveyResponse.data;

                    // assert
                    expect(survey.id).to.be.not.empty;
                    surveyId = survey.id;

                    // pre assert
                    let { name } = survey;

                    // assert
                    expect(name).to.equal(surveyName);
                });

                afterAll(async () => {
                    if (surveyId)
                        await mongoService.deleteSurvey({ id: surveyId });
                });
            });

            describe("Get the list of all surveys", () => {
                let surveyId = "";
                let surveyNumber = Math.floor(Math.random() * 10000);
                let surveyName = `Survey ${surveyNumber}`;

                beforeAll(async () => {
                    let response = await mongoService.updateSurvey({
                        name: surveyName,
                        description: "",
                    });
                    surveyId = response.data.id;
                });

                it("Should return the list of all surveys", async () => {
                    // Arrange
                    let request: GetSurveysRequest = {};

                    // Act
                    let surveysResponse = await mongoService.getSurveys(
                        request
                    );

                    // Assert
                    expect(surveysResponse.isSuccess).to.be.true;
                    expect(surveysResponse.data).to.be.an.instanceof(Array);

                    // Pre assert
                    let surveys = surveysResponse.data;
                    let needle = surveys.find(
                        (survey) => survey.name == surveyName
                    );

                    // Assert
                    expect(needle).to.be.not.undefined;
                });

                afterAll(async () => {
                    await mongoService.deleteSurvey({ id: surveyId });
                });
            });

            describe("Get a single survey by its ID", () => {
                let surveyId = "";
                let surveyNum = Math.floor(Math.random() * 10000);
                let surveyName = `Survey ${surveyNum}`;

                beforeAll(async () => {
                    let request: UpdateSurveyRequest = {
                        name: surveyName,
                        description: "",
                    };

                    let updateResponse = await mongoService.updateSurvey(
                        request
                    );
                    surveyId = updateResponse.data.id;
                });

                it("Should return the requested survey", async () => {
                    // arrange
                    let surveyRequest: GetSurveyRequest = {
                        id: surveyId,
                    };

                    // act
                    let surveyResponse = await mongoService.getSurvey(
                        surveyRequest
                    );

                    // assert
                    expect(surveyResponse.isSuccess).to.be.true;
                });

                afterAll(async () => {
                    await mongoService.deleteSurvey({ id: surveyId });
                });
            });

            describe("Delete survey", () => {
                let surveyId = "";

                beforeAll(async () => {
                    let surveyNumber = Math.floor(Math.random() * 10000);
                    let surveyName = `Survey ${surveyNumber}`;
                    let surveyResponse = await mongoService.updateSurvey({
                        name: surveyName,
                        description: "",
                    });
                    surveyId = surveyResponse.data.id;
                });

                it("Should delete survey with requested ID", async () => {
                    // arrange
                    let deleteRequest: DeleteSurveyRequest = {
                        id: surveyId,
                    };

                    // act
                    let deleteResponse = await mongoService.deleteSurvey(
                        deleteRequest
                    );

                    // assert
                    expect(deleteResponse.isSuccess).to.be.true;

                    // pre assert
                    let surveyResponse = await mongoService.getSurvey({
                        id: surveyId,
                    });

                    // assert
                    expect(surveyResponse.isSuccess).to.be.false;
                    expect(surveyResponse.code).to.equal(404);
                    expect(surveyResponse.message).to.contain(surveyId);
                });
            });

            afterAll(async () => {
                //await mongoService.shutdown();
            });
        });
    }
}

new MongoServiceTest().run();
