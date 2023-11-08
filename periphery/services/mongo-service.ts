import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import {
    UpdateSurveyRequest,
    GetSurveyRequest,
    DeleteSurveyRequest,
    GetSurveysRequest,
    DeleteQuestionRequest,
    GetQuestionRequest,
    GetQuestionsRequest,
    UpdateQuestionRequest,
    GetSurveyEntriesRequest,
    GetSurveyEntryRequest,
    UpdateSurveyEntryRequest,
} from "../../domain/inputs";
import {
    IQuestionStorageService,
    ISurveyEntryStorageService,
    ISurveyStorageService,
} from "../../domain/outbound";
import {
    UpdateSurveyResponse,
    GetSurveyResponse,
    BaseResponse,
    GetSurveysResponse,
    OutputGenerator,
    GetQuestionResponse,
    GetQuestionsResponse,
    UpdateQuestionResponse,
    GetSurveyEntriesResponse,
    GetSurveyEntryResponse,
    UpdateSurveyEntryResponse,
} from "../../domain/outputs";
import { Question, Survey, SurveyEntry } from "../../domain/entities";

export class MongoService
    implements
        ISurveyStorageService,
        IQuestionStorageService,
        ISurveyEntryStorageService
{
    public static COLL_SURVEYS = "surveys";
    public static COLL_QUESTIONS = "questions";
    public static COLL_RESPONSES = "responses";

    host: string;
    port: number;
    db: string;
    theClient: MongoClient;
    theDb: Db;
    collSurveys: Collection;
    collQuestions: Collection;
    collResponses: Collection;

    setHost(host: string): MongoService {
        this.host = host;
        return this;
    }

    setPort(port: number): MongoService {
        this.port = port;
        return this;
    }

    setDb(db: string): MongoService {
        this.db = db;
        return this;
    }

    public async ensureConnection(): Promise<void> {
        if (this.theClient) return;

        let url = `mongodb://${this.host}:${this.port}/${this.db}`;

        if (this.host && this.port && this.db) {
            this.theClient = new MongoClient(url);
            this.theDb = this.theClient.db();
            this.collSurveys = this.theDb.collection(MongoService.COLL_SURVEYS);
            this.collQuestions = this.theDb.collection(
                MongoService.COLL_QUESTIONS
            );
            this.collResponses = this.theDb.collection(
                MongoService.COLL_RESPONSES
            );
        }
    }

    async updateSurvey(
        request: UpdateSurveyRequest
    ): Promise<UpdateSurveyResponse> {
        try {
            await this.ensureConnection();

            let payload = {};
            for (let key in request) {
                payload[key] = request[key];
            }

            let theID: ObjectId = null;
            if (request.id) {
                theID = ObjectId.createFromHexString(request.id);

                let updateFields = {
                    $set: payload,
                };

                await this.collSurveys.updateOne({ _id: theID }, updateFields);
            } else {
                let result = await this.collSurveys.insertOne(payload);
                theID = result.insertedId;
            }

            let theDocument = await this.getDocumentById(
                this.collSurveys,
                theID
            );

            let { _id, name, title, description } = theDocument;
            let createdSurvey = {
                id: _id.toHexString(),
                name,
                title,
                description,
            };
            for (let key in theDocument) {
                if (key == "_id" || key in createdSurvey) continue;
                createdSurvey[key] = theDocument[key];
            }

            return <UpdateSurveyResponse>(
                OutputGenerator.generateSuccess(createdSurvey)
            );
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return <UpdateSurveyResponse>(
                OutputGenerator.generateError(message, 500)
            );
        }
    }

    async getSurvey(request: GetSurveyRequest): Promise<GetSurveyResponse> {
        try {
            await this.ensureConnection();

            let doc = await this.getDocumentById(
                this.collSurveys,
                ObjectId.createFromHexString(request.id)
            );

            if (!doc) {
                return <GetSurveyResponse>(
                    OutputGenerator.generateError(
                        `Survey with ID ${request.id} not found`,
                        404
                    )
                );
            }

            let { name, title, description } = doc;
            let survey = <Survey>{
                id: doc._id.toHexString(),
                name,
                title,
                description,
            };

            for (let key in doc) {
                if (key == "_id" || key in survey) continue;
                survey[key] = doc[key];
            }

            return <GetSurveyResponse>OutputGenerator.generateSuccess(survey);
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return <GetSurveyResponse>OutputGenerator.generateError(message);
        }
    }

    async getSurveys(request: GetSurveysRequest): Promise<GetSurveysResponse> {
        try {
            await this.ensureConnection();

            let cursor = this.collSurveys.find().sort({ title: 1 });

            let surveys = await cursor
                .map((document) => {
                    let { name, title, description } = document;
                    let survey: Survey = {
                        id: document._id.toHexString(),
                        name,
                        title,
                        description,
                    };

                    for (let key in document) {
                        if (key == "_id") continue;
                        if (key in survey) continue;

                        survey[key] = document[key];
                    }

                    return survey;
                })
                .toArray();

            return <GetSurveysResponse>OutputGenerator.generateSuccess(surveys);
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return <GetSurveysResponse>OutputGenerator.generateError(message);
        }
    }

    async deleteSurvey(request: DeleteSurveyRequest): Promise<BaseResponse> {
        try {
            await this.ensureConnection();

            let surveyOid = ObjectId.createFromHexString(request.id);
            this.collSurveys.deleteOne({ _id: surveyOid });
            return OutputGenerator.generateSuccess();
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return OutputGenerator.generateError(message);
        }
    }

    async updateQuestion(
        request: UpdateQuestionRequest
    ): Promise<UpdateQuestionResponse> {
        try {
            let surveyId = ObjectId.createFromHexString(request.surveyId);
            let questionId: ObjectId;

            let payload = {};
            for (let key in request) {
                if (key == "id") continue;
                if (key == "surveyId") {
                    payload["surveyId"] = surveyId;
                    continue;
                }

                payload[key] = request[key];
            }

            if (request.id) {
                questionId = ObjectId.createFromHexString(request.id);

                await this.collQuestions.updateOne(
                    { _id: questionId },
                    { $set: payload }
                );
            } else {
                let result = await this.collQuestions.insertOne(payload);
                questionId = result.insertedId;
            }

            let savedDoc = await this.getDocumentById(
                this.collQuestions,
                questionId
            );

            let question = {
                id: savedDoc._id.toHexString(),
                surveyId: savedDoc.surveyId.toHexString(),
            };

            for (let key in savedDoc) {
                if (key == "_id" || key == "surveyId") continue;
                question[key] = savedDoc[key];
            }

            return <UpdateQuestionResponse>(
                OutputGenerator.generateSuccess(question)
            );
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return <UpdateQuestionResponse>(
                OutputGenerator.generateError(message)
            );
        }
    }

    async getQuestionsBySurvey(
        request: GetQuestionsRequest
    ): Promise<GetQuestionsResponse> {
        try {
            let { surveyId } = request;
            let cursor = this.collQuestions
                .find({ surveyId: ObjectId.createFromHexString(surveyId) })
                .sort({ order: 1 });
            let questions = await cursor
                .map((document) => {
                    let { name, title, type, order } = document;
                    let question: Question = {
                        id: document._id.toHexString(),
                        surveyId: document.surveyId.toHexString(),
                        name,
                        title,
                        type,
                        order,
                    };

                    for (let key in document) {
                        if (key == "_id") continue;
                        if (key in question) continue;

                        question[key] = document[key];
                    }

                    return question;
                })
                .toArray();

            return <GetQuestionsResponse>(
                OutputGenerator.generateSuccess(questions)
            );
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return <GetQuestionsResponse>OutputGenerator.generateError(message);
        }
    }

    async getQuestionById(
        request: GetQuestionRequest
    ): Promise<GetQuestionResponse> {
        try {
            let id = ObjectId.createFromHexString(request.id);
            let document = await this.getDocumentById(this.collQuestions, id);
            if (!document) {
                return <GetQuestionResponse>(
                    OutputGenerator.generateError(
                        `Question with ID ${id} not found`,
                        404
                    )
                );
            }

            let { name, title, type, order } = document;
            let question = <Question>{
                id: document._id.toHexString(),
                surveyId: document.surveyId.toHexString(),
                name,
                title,
                type,
                order,
            };

            for (let key in document) {
                if (key == "_id") continue;
                if (key in question) continue;

                question[key] = document[key];
            }

            return <GetQuestionResponse>(
                OutputGenerator.generateSuccess(question)
            );
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return <GetQuestionResponse>OutputGenerator.generateError(message);
        }
    }

    async deleteQuestionById(
        request: DeleteQuestionRequest
    ): Promise<BaseResponse> {
        try {
            let _id = ObjectId.createFromHexString(request.id);
            await this.collQuestions.deleteOne({ _id });
            return OutputGenerator.generateSuccess();
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return OutputGenerator.generateError(message);
        }
    }

    async updateEntry(
        request: UpdateSurveyEntryRequest
    ): Promise<UpdateSurveyEntryResponse> {
        try {
            let { surveyId } = request;
            let surveyOid = ObjectId.createFromHexString(surveyId);
            let timestamp = new Date();

            let payload = { surveyId: surveyOid, timestamp };

            for (let key in request) {
                if (key == "surveyId") continue;

                payload[key] = request[key];
            }

            let result = await this.collResponses.insertOne(payload);
            let id = result.insertedId;

            let docu = await this.getDocumentById(this.collResponses, id);

            let entry: SurveyEntry = {
                id: docu._id.toHexString(),
                surveyId: docu.surveyId.toHexString(),
            };
            for (let key in docu) {
                if (key == "_id") continue;
                if (key == "surveyId") continue;

                entry[key] = docu[key];
            }

            return <UpdateSurveyEntryResponse>(
                OutputGenerator.generateSuccess(entry)
            );
        } catch (e) {
            let message = `${e}`;
            console.log(e);
            return <UpdateSurveyEntryResponse>(
                OutputGenerator.generateError(message)
            );
        }
    }

    async getEntries(
        request: GetSurveyEntriesRequest
    ): Promise<GetSurveyEntriesResponse> {
        try {
            let { surveyId } = request;
            let oid = ObjectId.createFromHexString(surveyId);

            let docs = this.collResponses.find({ surveyId: oid });

            let entries = await docs
                .map((docu) => {
                    let entry: SurveyEntry = { id: docu._id.toHexString() };

                    for (let key in docu) {
                        if (key == "_id") continue;
                        entry[key] = docu[key];
                    }

                    return entry;
                })
                .toArray();

            return <GetSurveyEntriesResponse>(
                OutputGenerator.generateSuccess(entries)
            );
        } catch (e: any) {
            let message = `${e}`;
            console.log(message);
            return <GetSurveyEntriesResponse>(
                OutputGenerator.generateError(message)
            );
        }
    }

    async getEntryById(
        request: GetSurveyEntryRequest
    ): Promise<GetSurveyEntryResponse> {
        try {
            let oid = ObjectId.createFromHexString(request.id);
            let docu = await this.collResponses.findOne({ _id: oid });

            if (!docu) {
                let message = `Survey response with ID ${request.id} not found`;
                console.log(message);

                return <GetSurveyEntryResponse>(
                    OutputGenerator.generateError(message, 404)
                );
            }

            let entry: SurveyEntry = {
                id: docu._id.toHexString(),
                surveyId: docu.surveyId.toHexString(),
            };

            for (let key in docu) {
                if (key == "_id") continue;
                if (key == "surveyId") continue;

                entry[key] = docu[key];
            }

            return <GetSurveyEntryResponse>(
                OutputGenerator.generateSuccess(entry)
            );
        } catch (e) {
            let message = `${e}`;
            console.log(message);
            return <GetSurveyEntryResponse>(
                OutputGenerator.generateError(message)
            );
        }
    }

    async deleteEntryById(id: string): Promise<void> {
        try {
            let oid = ObjectId.createFromHexString(id);
            await this.collResponses.deleteOne({ _id: oid });
        } catch (e) {
            console.log(`${e}`);
        }
    }

    async shutdown() {
        if (this.theClient) {
            this.theClient.close();
            this.theClient = null;
        }
    }

    private async getDocumentById(theCollection: Collection, theID: ObjectId) {
        await this.ensureConnection();
        return await theCollection.findOne({ _id: theID });
    }

    private async getQuestionBySurveyName(surveyId: ObjectId, name: string) {
        await this.ensureConnection();
        return await this.collQuestions.findOne({
            surveyId,
            name,
        });
    }
}
