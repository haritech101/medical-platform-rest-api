import { config } from "dotenv";
import {
    Defaults,
    EnvVars,
    ServiceFactory,
} from "../periphery/services/service-factory";
import { createConnection } from "mysql2";

(async () => {
    let conn, mongoService;

    try {
        config({ path: ".local/.env-live" });

        let factory = ServiceFactory.getInstance();
        await factory.init();
        mongoService = factory.getMongoService();

        console.log("Connecting to Mongo");
        await mongoService.ensureConnection();

        let mHost = process.env[EnvVars.mysqlHost] || Defaults.mysqlHost;
        let mUser = process.env[EnvVars.mysqlUser];
        let mPassword = process.env[EnvVars.mysqlPassword];
        let mDb = process.env[EnvVars.mysqlDb];

        console.log("Connecting to MySQL");
        conn = createConnection({
            host: mHost,
            user: mUser,
            password: mPassword,
            database: mDb,
        });

        console.log("Querying MongoDB");
        let cursor = mongoService.collResponses.find({});

        console.log("Duplicating records in MySQL");
        for await (let doc of cursor) {
            console.log("Taking from Mongo");
            console.log(doc);
            console.log("Inserting in MySQL");

            let timestamp = doc.timestamp
                .toISOString()
                .replace("T", " ")
                .substring(0, 20);

            let query =
                "insert into survey_responses(" +
                "id,surveyId,timestamp,emailAddress,gender,age,levelOfFunction,recentStress,issuesAffectedConversation," +
                "treatmentRating,whetherMedicationUsed,whichMedication,doctorAttitude,localHospitalRating," +
                "insuranceAffordability,recentPain,recommendationLevel" +
                ") " +
                "values(" +
                `'${doc._id}', '${doc.surveyId}', '${timestamp}', '${
                    doc.emailAddress
                }', '${doc.gender || ""}', ${doc.age}, '${
                    doc.levelOfFunction
                }',` +
                `'${doc.recentStress}', '${doc.issuesAffectedConversation}', '${doc.treatmentRating}', '${doc.whetherMedicationUsed}',` +
                `'${doc.whichMedication || ""}', ${doc.doctorAttitude}, '${
                    doc.localHospitalRating
                }', ${doc.insuranceAffordability},` +
                `'${doc.recentPain}', '${doc.recommendationLevel}'` +
                ")";
            let result = await new Promise((resolve, reject) => {
                conn.query(query, (err, res, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(fields);
                        resolve(res);
                    }
                });
            });
            console.log(result);
        }

        conn.destroy();
        mongoService.theClient.close();
    } catch (e) {
        console.log("App failed because of");
        console.log(e);
        conn.destroy();
        mongoService.theClient.close();
    }
})();

/*
create table survey_responses(
    id varchar(48) primary key,
    surveyId varchar(48) not null,
    timestamp timestamp not null,
    emailAddress varchar(64) not null,
    gender varchar(16),
    age int(2) not null,
    levelOfFunction varchar(16) not null,
    recentStress varchar(16) not null,
    issuesAffectedConversation varchar(16) not null,
    treatmentRating varchar(16) not null,
    whetherMedicationUsed varchar(3) not null,
    whichMedication varchar(256),
    doctorAttitude int(2),
    localHospitalRating varchar(16),
    insuranceAffordability double(5, 2),
    recentPain varchar(256),
    recommendationLevel varchar(16)
)
*/
