import { MongoService } from "../services/mongo-service";
import { config } from "dotenv";
import { Defaults, EnvVars } from "../services/service-factory";
import { expect } from "chai";
import {
    DeleteSurveyRequest,
    GetSurveyRequest,
    GetSurveysRequest,
    UpdateQuestionRequest,
    UpdateSurveyRequest,
} from "../../domain/inputs";

class MongoServiceTest {
    private mongoService: MongoService;

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

                this.mongoService = mongoService;
            });

            describe("Surveys", () => {
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
                        let updateSurveyResponse =
                            await mongoService.updateSurvey(
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
            });

            describe("Questions", () => {
                describe("Create a question", () => {
                    let surveyId = "";
                    let questionNum = Math.floor(Math.random() * 100000);
                    let questionName = `Created from Mongo Service Test ${questionNum}`;

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created from Mongo Service Test"
                        );
                    });

                    it("Should create the new question", async () => {
                        expect(surveyId).to.be.not.empty;

                        // arrange
                        let request = <UpdateQuestionRequest>{
                            surveyId,
                            name: questionName,
                            title: questionName,
                            type: "text",
                        };

                        // act
                        let questionResponse =
                            await mongoService.updateQuestion(request);

                        // assert
                        expect(questionResponse.isSuccess).to.be.true;

                        // pre assert
                        let question = questionResponse.data;

                        // assert
                        expect(question).to.deep.equal(request);
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionName
                        );
                    });
                });

                describe("Get list of questions", () => {
                    let surveyId = "";
                    let questionName = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created by Mongo Service Test"
                        );
                        questionName = await this.createQuestion(
                            surveyId,
                            "Created by Mongo Service"
                        );
                    });

                    it("Should return the list of questions", async () => {
                        // act
                        let questionsResponse =
                            await mongoService.getQuestionsBySurvey({
                                surveyId,
                            });

                        // assert
                        expect(questionsResponse.isSuccess).to.be.true;

                        // pre assert
                        let questions = questionsResponse.data;
                        let needle = questions.find(
                            (question) =>
                                question.surveyId == surveyId &&
                                question.name == questionName
                        );

                        // assert
                        expect(needle).to.be.not.undefined;
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionName
                        );
                    });
                });

                describe("Get single question", () => {
                    let surveyId = "";
                    let questionName = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created from Mongo Service Test"
                        );
                        questionName = await this.createQuestion(
                            surveyId,
                            "Created from Mongo Service Test"
                        );
                    });

                    it("Should get the specified question", async () => {
                        expect(surveyId).to.be.not.empty;
                        expect(questionName).to.be.not.empty;

                        // act
                        let questionResponse =
                            await mongoService.getQuestionById({
                                surveyId,
                                name: questionName,
                            });

                        // assert
                        expect(questionResponse.isSuccess).to.be.true;

                        // pre assert
                        let question = questionResponse.data;

                        // assert
                        expect(question.surveyId).to.equal(surveyId);
                        expect(question.name).to.equal(questionName);
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionName
                        );
                    });
                });

                describe("Modify an existing question", () => {
                    let surveyId = "";
                    let questionName = "";
                    let updatedName = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created from Mongo Service Test"
                        );
                        questionName = await this.createQuestion(
                            surveyId,
                            "Created from Mongo Service Test"
                        );
                        updatedName = questionName.replace(
                            "Created",
                            "Modified"
                        );
                    });

                    it("Should modify the specified question", async () => {
                        let questionResponse =
                            await mongoService.updateQuestion({
                                surveyId,
                                name: questionName,
                                title: updatedName,
                                type: "text",
                            });

                        expect(questionResponse.isSuccess).to.be.true;

                        let question = questionResponse.data;
                        expect(question.surveyId).to.equal(surveyId);
                        expect(question.name).to.equal(questionName);
                        expect(question.title).to.equal(updatedName);
                        expect(question.type).to.equal("text");
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionName
                        );
                    });
                });

                describe("Delete a question", () => {
                    let surveyId = "";
                    let questionName = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created from Mongo Service Test"
                        );
                        questionName = await this.createQuestion(
                            surveyId,
                            "Created from Mongo Service Test"
                        );
                    });

                    it("Should delete the specified question", async () => {
                        expect(surveyId).to.be.not.empty;
                        expect(questionName).to.be.not.empty;

                        let questionResponse =
                            await mongoService.getQuestionById({
                                surveyId,
                                name: questionName,
                            });

                        expect(questionResponse.isSuccess).to.be.true;

                        let question = questionResponse.data;
                        expect(question.surveyId).to.equal(surveyId);
                        expect(question.name).to.equal(questionName);

                        await mongoService.deleteQuestionById({
                            surveyId,
                            name: questionName,
                        });

                        questionResponse = await mongoService.getQuestionById({
                            surveyId,
                            name: questionName,
                        });

                        expect(questionResponse.isSuccess).to.be.false;
                        expect(questionResponse.code).to.equal(404);
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionName
                        );
                    });
                });
            });

            afterAll(async () => {
                // await mongoService.shutdown();
            });
        });
    }

    private async createSurvey(namePrefix: string): Promise<string> {
        let surveyNumber = Math.floor(Math.random() * 100000);
        let surveyName = `${namePrefix} ${surveyNumber}`;

        let surveyResponse = await this.mongoService.updateSurvey({
            name: surveyName,
            description: "",
        });

        return surveyResponse.data.id;
    }

    private async createQuestion(
        surveyId: string,
        namePrefix: string
    ): Promise<string> {
        let questionNumber = Math.floor(Math.random() * 100000);
        let questionName = `${namePrefix} ${questionNumber}`;

        await this.mongoService.updateQuestion({
            surveyId,
            name: questionName,
            title: questionName,
            type: "text",
        });

        return questionName;
    }

    private async deleteSurveyAndQuestion(
        surveyId: string,
        questionName: string
    ) {
        await this.mongoService.deleteQuestionById({
            surveyId,
            name: questionName,
        });
        await this.mongoService.deleteSurvey({ id: surveyId });
    }
}

new MongoServiceTest().run();
