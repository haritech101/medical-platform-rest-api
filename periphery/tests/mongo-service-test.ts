import { MongoService } from "../services/mongo-service";
import { config } from "dotenv";
import { Defaults, EnvVars } from "../services/service-factory";
import { expect } from "chai";
import {
    DeleteSurveyRequest,
    GetSurveyRequest,
    GetSurveysRequest,
    UpdateQuestionRequest,
    UpdateSurveyEntryRequest,
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
                            title: surveyName,
                            description: "",
                            previewText: "Preview",
                            requiredText: "!",
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
                        let {
                            name,
                            title,
                            description,
                            previewText,
                            requiredText,
                        } = survey;

                        // assert
                        expect({
                            name,
                            title,
                            description,
                            previewText,
                            requiredText,
                        }).to.deep.equal(updateSurveyRequest);
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
                    let updateSurveyRequest: UpdateSurveyRequest = {
                        name: surveyName,
                        title: surveyName,
                        description: "",
                        previewText: "Preview",
                        requiredText: "!",
                    };

                    beforeAll(async () => {
                        let response = await mongoService.updateSurvey(
                            updateSurveyRequest
                        );
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
                            (survey) => survey.id == surveyId
                        );

                        // Assert
                        expect(needle).to.be.not.undefined;
                        expect(needle.id).to.be.not.empty;
                        for (let key in updateSurveyRequest) {
                            expect(needle[key]).to.equal(
                                updateSurveyRequest[key]
                            );
                        }
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
                            title: surveyName,
                            description: "",
                            previewText: "Preview",
                            requiredText: "!",
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

                        // pre assert
                        let survey = surveyResponse.data;
                        expect(survey.id).to.equal(surveyId);
                        expect(survey.name).to.equal(surveyName);
                        expect(survey.title).to.equal(surveyName);
                        expect(survey.previewText).to.equal("Preview");
                        expect(survey.requiredText).to.equal("!");
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
                            title: surveyName,
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
                    let questionId = "";

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
                            showNoneItem: true,
                            showOtherItem: true,
                            order: 5,
                        };

                        // act
                        let questionResponse =
                            await mongoService.updateQuestion(request);

                        // assert
                        expect(
                            questionResponse.isSuccess,
                            questionResponse.message
                        ).to.be.true;

                        // pre assert
                        let question = questionResponse.data;

                        // assert
                        expect(question.id).to.be.not.empty;
                        expect(question.surveyId).to.equal(surveyId);
                        expect(question.name).to.equal(questionName);
                        expect(question.showNoneItem).to.equal(
                            request.showNoneItem
                        );
                        expect(question.showOtherItem).to.equal(
                            request.showOtherItem
                        );
                        expect(question.order).to.equal(5);

                        questionId = question.id;
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionId
                        );
                    });
                });

                describe("Get list of questions", () => {
                    let surveyId = "";
                    let questionId = "";
                    let questionName = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created by Mongo Service Test"
                        );
                        let { id, name } = await this.createQuestion(
                            surveyId,
                            "Created by Mongo Service"
                        );
                        questionId = id;
                        questionName = name;
                    });

                    it("Should return the list of questions", async () => {
                        expect(surveyId).to.be.not.empty;
                        expect(questionId).to.be.not.empty;
                        expect(questionName).to.be.not.empty;

                        // act
                        let questionsResponse =
                            await mongoService.getQuestionsBySurvey({
                                surveyId,
                            });

                        // assert
                        expect(
                            questionsResponse.isSuccess,
                            questionsResponse.message
                        ).to.be.true;

                        // pre assert
                        let questions = questionsResponse.data;
                        let needle = questions.find(
                            (question) =>
                                question.surveyId == surveyId &&
                                question.name == questionName
                        );

                        // assert
                        expect(needle).to.be.not.undefined;
                        expect(needle.id).to.equal(questionId);
                        expect(needle.name).to.equal(questionName);
                        expect(needle.title).to.equal(questionName);
                        expect(needle.order).to.equal(5);
                        expect(needle.showOtherItem).to.be.true;
                        expect(needle.showNoneItem).to.be.true;
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionId
                        );
                    });
                });

                describe("Get single question", () => {
                    let surveyId = "";
                    let questionName = "";
                    let questionId = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created from Mongo Service Test"
                        );
                        let { id, name } = await this.createQuestion(
                            surveyId,
                            "Created from Mongo Service Test"
                        );
                        questionId = id;
                        questionName = name;
                    });

                    it("Should get the specified question", async () => {
                        expect(surveyId).to.be.not.empty;
                        expect(questionId).to.be.not.empty;
                        expect(questionName).to.be.not.empty;

                        // act
                        let questionResponse =
                            await mongoService.getQuestionById({
                                id: questionId,
                            });

                        // assert
                        expect(
                            questionResponse.isSuccess,
                            questionResponse.message
                        ).to.be.true;

                        // pre assert
                        let question = questionResponse.data;

                        // assert
                        expect(question.id).to.equal(questionId);
                        expect(question.surveyId).to.equal(surveyId);
                        expect(question.name).to.equal(questionName);
                        expect(question.order).to.equal(5);
                        expect(question.showOtherItem).to.be.true;
                        expect(question.showNoneItem).to.be.true;
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionId
                        );
                    });
                });

                describe("Modify an existing question", () => {
                    let surveyId = "";
                    let questionId = "";
                    let questionName = "";
                    let updatedName = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created from Mongo Service Test"
                        );
                        let { id, name } = await this.createQuestion(
                            surveyId,
                            "Created from Mongo Service Test"
                        );
                        questionId = id;
                        questionName = name;
                        updatedName = questionName.replace(
                            "Created",
                            "Modified"
                        );
                    });

                    it("Should modify the specified question", async () => {
                        let questionResponse =
                            await mongoService.updateQuestion({
                                id: questionId,
                                surveyId,
                                name: updatedName,
                                title: updatedName,
                                type: "text",
                                order: 1,
                            });

                        expect(
                            questionResponse.isSuccess,
                            questionResponse.message
                        ).to.be.true;

                        let question = questionResponse.data;
                        expect(question.id).to.equal(questionId);
                        expect(question.surveyId).to.equal(surveyId);
                        expect(question.name).to.equal(updatedName);
                        expect(question.title).to.equal(updatedName);
                        expect(question.type).to.equal("text");
                        expect(question.order).to.equal(1);
                        expect(question.showNoneItem).to.be.true;
                        expect(question.showOtherItem).to.be.true;
                    }, 60000);

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionId
                        );
                    });
                });

                describe("Delete a question", () => {
                    let surveyId = "";
                    let questionId = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created from Mongo Service Test"
                        );
                        let { id } = await this.createQuestion(
                            surveyId,
                            "Created from Mongo Service Test"
                        );
                        questionId = id;
                    });

                    it("Should delete the specified question", async () => {
                        expect(surveyId).to.be.not.empty;
                        expect(questionId).to.be.not.empty;

                        await mongoService.deleteQuestionById({
                            id: questionId,
                        });

                        let questionResponse =
                            await mongoService.getQuestionById({
                                id: questionId,
                            });

                        expect(
                            questionResponse.isSuccess,
                            questionResponse.message
                        ).to.be.false;
                        expect(questionResponse.code).to.equal(404);
                    });

                    afterAll(async () => {
                        await this.deleteSurveyAndQuestion(
                            surveyId,
                            questionId
                        );
                    });
                });
            });

            describe("Survey Responses", () => {
                describe("Create survey response", () => {
                    let surveyId = "";
                    let entryId = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created in Mongo Service Test"
                        );
                    });

                    it("Should create the survey response", async () => {
                        // arrange
                        let request: UpdateSurveyEntryRequest = {
                            surveyId,
                            age: 24,
                            gender: "F",
                        };

                        // act
                        let response = await mongoService.updateEntry(request);

                        // assert
                        expect(response.isSuccess).to.be.true;

                        // pre assert
                        let entry = response.data;

                        // assert
                        expect(entry.id).to.be.not.empty;
                        expect(entry.surveyId).to.equal(surveyId);
                        expect(entry.timestamp).to.be.instanceOf(Date);
                        expect(entry.age).to.equal(request.age);
                        expect(entry.gender).to.equal(request.gender);

                        entryId = entry.id;
                    });

                    afterAll(async () => {
                        await this.deleteEntry(entryId);
                        await this.deleteSurvey(surveyId);
                    });
                });

                describe("Get list of responses for a survey", () => {
                    let surveyId = "";
                    let entryId = "";

                    beforeAll(async () => {
                        surveyId = await this.createSurvey(
                            "Created in Mongo Service Test"
                        );
                        entryId = await this.createEntry(surveyId);
                    });

                    it("Should return the list of responses", async () => {
                        // act
                        let entriesResponse = await mongoService.getEntries({
                            surveyId,
                        });

                        // assert
                        expect(entriesResponse.isSuccess).to.be.true;

                        // pre assert
                        let entries = entriesResponse.data;
                        let needle = entries.find(
                            (entry) => entry.id == entryId
                        );

                        // assert
                        expect(needle).to.be.not.undefined;
                        expect(needle.timestamp).to.be.instanceOf(Date);
                        expect(needle.gender).to.equal("F");
                        expect(needle.age).to.equal(24);
                    });

                    afterAll(async () => {
                        await this.deleteEntry(entryId);
                        await this.deleteSurvey(surveyId);
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
            title: surveyName,
            description: "",
        });

        return surveyResponse.data.id;
    }

    private async createQuestion(
        surveyId: string,
        namePrefix: string
    ): Promise<{ id: string; name: string; order: number }> {
        let questionNumber = Math.floor(Math.random() * 100000);
        let questionName = `${namePrefix} ${questionNumber}`;

        let questionResponse = await this.mongoService.updateQuestion({
            surveyId,
            name: questionName,
            title: questionName,
            type: "text",
            order: 5,
            showNoneItem: true,
            showOtherItem: true,
        });

        expect(questionResponse.isSuccess).to.be.true;

        let { id, name, order } = questionResponse.data;
        return { id, name, order };
    }

    private async createEntry(surveyId: string): Promise<string> {
        let response = await this.mongoService.updateEntry({
            surveyId,
            age: 24,
            gender: "F",
        });

        expect(response.isSuccess).to.be.true;

        return response.data.id;
    }

    private async deleteSurvey(surveyId: string) {
        await this.mongoService.deleteSurvey({ id: surveyId });
    }

    private async deleteSurveyAndQuestion(
        surveyId: string,
        questionId: string
    ) {
        let opResponse = await this.mongoService.deleteQuestionById({
            id: questionId,
        });
        expect(opResponse.isSuccess).to.be.true;

        opResponse = await this.mongoService.deleteSurvey({ id: surveyId });
        expect(opResponse.isSuccess).to.be.true;
    }

    private async deleteEntry(entryId: string) {
        await this.mongoService.deleteEntryById(entryId);
    }
}

new MongoServiceTest().run();
