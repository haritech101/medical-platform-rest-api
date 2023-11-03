import axios from "axios";
import {
    UpdateSurveyEntryRequest,
    UpdateSurveyRequest,
} from "../../domain/inputs";
import { MongoService } from "../services/mongo-service";
import { config } from "dotenv";
import { ServiceFactory } from "../services/service-factory";
import { expect } from "chai";
import {
    GetSurveyEntryResponse,
    UpdateSurveyEntryResponse,
} from "../../domain/outputs";

describe("HTTP requests for survey responses", () => {
    let baseUrl = `http://localhost:8080`;
    let mongoService: MongoService;

    beforeAll(async () => {
        config({ path: ".local/.env" });

        let factory = ServiceFactory.getInstance();
        await factory.init();
        await factory.getHttpService().start();

        mongoService = factory.getMongoService();
    });

    describe("Create a new survey response", () => {
        let surveyId = "";
        let entryId = "";

        beforeAll(async () => {
            surveyId = await createSurvey();
        });

        it("Should create the new survey response", async () => {
            // act
            let httpResponse = await axios({
                url: `${baseUrl}/survey-responses`,
                method: "post",
                data: <UpdateSurveyEntryRequest>{
                    surveyId: surveyId,
                    age: 40,
                    gender: "M",
                },
            });

            // assert
            expect(httpResponse.status).to.equal(200);

            // pre assert
            let { id, timestamp, age, gender } = (<UpdateSurveyEntryResponse>(
                httpResponse.data
            )).data;
            expect(id).to.be.a.string;
            entryId = id;

            expect(httpResponse.data.data.surveyId).to.equal(surveyId);
            expect(Date.parse(timestamp)).to.not.throw;
            expect(age).to.equal(40);
            expect(gender).to.equal("M");
        });

        afterAll(async () => {
            await deleteSurveyResponse(entryId);
            await deleteSurvey(surveyId);
        });
    });

    describe("Get list of all survey responses", () => {
        let surveyId = "";
        let entryId = "";

        beforeAll(async () => {
            surveyId = await createSurvey();
            entryId = await createSurveyEntry(surveyId);
        }, 20000);

        it("Should return list of all survey responses", async () => {
            let httpResponse = await axios({
                url: `${baseUrl}/surveys/${surveyId}/responses`,
                method: "get",
            });

            let { status, data } = httpResponse;
            expect(status).to.equal(200);

            let entries = data.data;
            let needle = entries.find((entry) => entry.id == entryId);

            expect(needle).to.be.not.undefined;
            expect(needle.surveyId).to.equal(surveyId);
            expect(Date.parse(needle.timestamp)).to.not.throw;
            expect(needle.age).to.equal(40);
            expect(needle.gender).to.equal("M");
        }, 20000);

        afterAll(async () => {
            await deleteSurveyResponse(entryId);
            await deleteSurvey(surveyId);
        }, 20000);
    });

    describe("Get a single survey response", () => {
        let surveyId = "";
        let entryId = "";

        beforeAll(async () => {
            surveyId = await createSurvey();
            entryId = await createSurveyEntry(surveyId);
        });

        it("Should get the specified survey response", async () => {
            let httpResponse = await axios({
                url: `${baseUrl}/survey-responses/${entryId}`,
                method: "get",
            });

            let { status, data } = httpResponse;
            expect(status).to.equal(200);

            let entry = (<GetSurveyEntryResponse>data).data;
            let { id, timestamp, age, gender } = entry;
            expect(id).to.be.not.empty;
            expect(entry.surveyId).to.equal(surveyId);
            expect(Date.parse(timestamp)).to.not.throw;
            expect(age).to.equal(40);
            expect(gender).to.equal("M");
        });

        afterAll(async () => {
            await deleteSurveyResponse(entryId);
            await deleteSurvey(surveyId);
        });
    });

    afterAll(async () => {
        await ServiceFactory.getInstance().getHttpService().stop();
    });

    async function createSurvey(): Promise<string> {
        let surveyNumber = Math.floor(Math.random() * 100000);
        let surveyName = `Survey created with axios ${surveyNumber}`;

        let httpResponse = await axios({
            url: `${baseUrl}/surveys`,
            method: "post",
            data: <UpdateSurveyRequest>{
                name: surveyName,
                title: surveyName,
                description: surveyName,
            },
        });

        return httpResponse.data.data.id;
    }

    async function createSurveyEntry(surveyId: string): Promise<string> {
        let httpResponse = await axios({
            url: `${baseUrl}/survey-responses`,
            method: "post",
            data: <UpdateSurveyEntryRequest>{
                surveyId,
                age: 40,
                gender: "M",
            },
        });

        return httpResponse.data.data.id;
    }

    async function deleteSurveyResponse(entryId: string): Promise<void> {
        await mongoService.deleteEntryById(entryId);
    }

    async function deleteSurvey(surveyId: string): Promise<void> {
        await axios({
            url: `${baseUrl}/surveys/${surveyId}`,
            method: "delete",
            validateStatus: () => true,
        });
    }
});
