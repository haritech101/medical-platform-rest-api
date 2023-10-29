import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import {
    UpdateSurveyRequest,
    GetSurveyRequest,
    DeleteSurveyRequest,
    GetSurveysRequest,
} from "../../domain/inputs";
import { ISurveyStorageService } from "../../domain/outbound";
import {
    UpdateSurveyResponse,
    GetSurveyResponse,
    BaseResponse,
    GetSurveysResponse,
    OutputGenerator,
} from "../../domain/outputs";
import { Survey } from "../../domain/entities";

export class MongoService implements ISurveyStorageService {
    public static COLL_SURVEYS = "surveys";

    host: string;
    port: number;
    db: string;
    theClient: MongoClient;
    theDb: Db;
    collSurveys: Collection;

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

    private async ensureConnection(): Promise<void> {
        if (this.theClient) return;

        let url = `mongodb://${this.host}:${this.port}/${this.db}`;

        if (this.host && this.port && this.db) {
            this.theClient = new MongoClient(url);
            this.theDb = this.theClient.db();
            this.collSurveys = this.theDb.collection(MongoService.COLL_SURVEYS);
        }
    }

    async updateSurvey(
        request: UpdateSurveyRequest
    ): Promise<UpdateSurveyResponse> {
        try {
            await this.ensureConnection();

            let { name, description } = request;
            let payload = { name, description };

            let theID: ObjectId = null;
            if (request.id) {
                theID = ObjectId.createFromHexString(request.id);

                let updateFields = {
                    $set: { name, description },
                };

                let result = await this.collSurveys.updateOne(
                    { _id: theID },
                    updateFields
                );
            } else {
                let result = await this.collSurveys.insertOne(payload);
                theID = result.insertedId;
            }

            let theDocument = await this.getDocumentById(
                this.collSurveys,
                theID
            );

            let { _id } = theDocument;
            ({ name, description } = theDocument);
            let createdSurvey: Survey = {
                id: _id.toHexString(),
                name,
                description,
            };

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

            let { name, description } = doc;
            let survey = <Survey>{
                id: doc._id.toHexString(),
                name,
                description,
            };
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

            let cursor = this.collSurveys.find().sort({ name: 1 });

            let surveys = await cursor
                .map((document) => {
                    let { name, description } = document;
                    return <Survey>{
                        id: document._id.toHexString(),
                        name,
                        description,
                    };
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
}
