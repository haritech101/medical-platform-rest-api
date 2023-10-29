import { config } from "dotenv";
import { Defaults, EnvVars } from "../services/service-factory";
import { ExpressHTTPService } from "../services/express-http-service";
import { expect } from "chai";
import axios from "axios";
import { SurveyController } from "../controllers/survey-controller";

describe("Express HTTP Service", () => {
    let expressHttpService: ExpressHTTPService = null;
    let httpPort = 0;

    beforeAll(async () => {
        config({ path: ".local/.env" });

        httpPort = parseInt(process.env[EnvVars.httpPort] || Defaults.httpPort);
        let controller = new SurveyController();

        expressHttpService = new ExpressHTTPService()
            .setPort(httpPort)
            .setSurveyController(controller);
        await expressHttpService.start();
    });

    it("Service should start and listen", async () => {
        let theResponse = await axios.get(
            `http://localhost:${httpPort}/hello`,
            {
                validateStatus: (status) => true,
            }
        );

        expect(theResponse.status).to.equal(200);
        expect(theResponse.data.greeting).to.equal("Hello, World");
    });

    afterAll(async () => {
        await expressHttpService.stop();
    });
});
