import { IQuestionOps, ISurveyOps } from "../../domain/inbound";
import { ISurveyStorageService } from "../../domain/outbound";
import { QuestionUseCases } from "../../domain/use-cases/question-use-cases";
import { SurveyUseCases } from "../../domain/use-cases/survey-use-cases";
import { QuestionController } from "../controllers/question-controller";
import { SurveyController } from "../controllers/survey-controller";
import { ExpressHTTPService } from "./express-http-service";
import { MongoService } from "./mongo-service";

export class EnvVars {
    public static mongoHost = "MONGO_HOST";
    public static mongoPort = "MONGO_PORT";
    public static mongoDb = "MONGO_DB";
    public static httpPort = "HTTP_PORT";
}

export class Defaults {
    public static mongoHost = "localhost";
    public static mongoPort = "27017";
    public static httpPort = "8080";
}

export class ServiceFactory {
    private static theInstance: ServiceFactory;
    private mongoService: MongoService;

    private surveyOps: ISurveyOps;
    private surveyController: SurveyController;

    private questionOps: IQuestionOps;
    private questionController: QuestionController;

    private httpService: ExpressHTTPService;

    public static getInstance(): ServiceFactory {
        if (!ServiceFactory.theInstance) {
            ServiceFactory.theInstance = new ServiceFactory();
        }
        return ServiceFactory.theInstance;
    }

    private constructor() {}

    public async init(): Promise<void> {
        let mongoHost = process.env[EnvVars.mongoHost] || Defaults.mongoHost;
        let mongoPort = parseInt(
            process.env[EnvVars.mongoPort] || Defaults.mongoPort
        );
        let mongoDb = process.env[EnvVars.mongoDb];

        this.mongoService = new MongoService()
            .setHost(mongoHost)
            .setPort(mongoPort)
            .setDb(mongoDb);

        let httpPort = parseInt(
            process.env[EnvVars.httpPort] || Defaults.httpPort
        );

        this.surveyOps = new SurveyUseCases().setSurveyStorageService(
            this.mongoService
        );
        this.questionOps = new QuestionUseCases().setQuestionStorageService(
            this.mongoService
        );

        this.surveyController = new SurveyController()
            .setSurveyOps(this.surveyOps)
            .setQuestionOps(this.questionOps);
        this.questionController = new QuestionController().setQuestionOps(
            this.questionOps
        );

        this.httpService = new ExpressHTTPService()
            .setPort(httpPort)
            .setSurveyController(this.surveyController)
            .setQuestionController(this.questionController);
    }

    public getHttpService(): ExpressHTTPService {
        return this.httpService;
    }
}
