import { config } from "dotenv";
import { ServiceFactory } from "../periphery/services/service-factory";

async function main() {
    config({
        path: ".local/.env",
    });

    let factory = ServiceFactory.getInstance();
    await factory.init();

    let httpService = factory.getHttpService();
    await httpService.start();
}

main();
