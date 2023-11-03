import { ISurveyEntryOps } from "../inbound";
import {
    GetSurveyEntriesRequest,
    GetSurveyEntryRequest,
    UpdateSurveyEntryRequest,
} from "../inputs";
import {
    ISurveyEntryOpsListener,
    ISurveyEntryStorageService,
} from "../outbound";
import { OutputGenerator, UpdateSurveyEntryResponse } from "../outputs";

export class EntryUseCase implements ISurveyEntryOps {
    private entryStorageService: ISurveyEntryStorageService;

    setSurveyEntryStorageService(
        service: ISurveyEntryStorageService
    ): EntryUseCase {
        this.entryStorageService = service;
        return this;
    }

    async updateEntry(
        request: UpdateSurveyEntryRequest,
        listener: ISurveyEntryOpsListener
    ): Promise<void> {
        try {
            let response = await this.entryStorageService.updateEntry(request);
            await listener.onSurveyEntryUpdated(response);
        } catch (e) {
            let message = `${e}`;
            console.log(message);
            await listener.onSurveyEntryUpdated(
                <UpdateSurveyEntryResponse>(
                    OutputGenerator.generateError(message)
                )
            );
        }
    }

    async getEntries(
        request: GetSurveyEntriesRequest,
        listener: ISurveyEntryOpsListener
    ): Promise<void> {
        try {
            let response = await this.entryStorageService.getEntries(request);
            await listener.onSurveyEntriesFetched(response);
        } catch (e) {
            let message = `${e}`;
            console.log(message);
            await listener.onSurveyEntriesFetched(
                <UpdateSurveyEntryResponse>(
                    OutputGenerator.generateError(message)
                )
            );
        }
    }

    async getEntryById(
        request: GetSurveyEntryRequest,
        listener: ISurveyEntryOpsListener
    ): Promise<void> {
        try {
            let response = await this.entryStorageService.getEntryById(request);
            await listener.onSurveyEntryFetched(response);
        } catch (e) {
            let message = `${e}`;
            console.log(message);
            await listener.onSurveyEntryFetched(
                <UpdateSurveyEntryResponse>(
                    OutputGenerator.generateError(message)
                )
            );
        }
    }
}
