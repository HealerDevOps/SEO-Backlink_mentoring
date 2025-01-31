import { Payload } from "payload";
import { fetchDataFromPublisuites } from "../fetchDataFromMarketplaces/publisuites.ts";
import PQueue from "p-queue";
import { uploadToDatabase } from "../uploadDatabase.ts";
import { MARKETPLACE_NAME_PUBLISUITES } from "@/globals/strings.ts";

const TOTAL_PAGES = 566;
const CONCURRENCY_LIMIT = 100;
const BATCH_SIZE = 200;

export const getAlldatafromPublisuites = async (url: string, cookie: string, payload: Payload) => {

    if (!cookie) {
        throw new Error('API cookie is missing');
    }

    const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });
    const seenDomains = new Set<string>();

    const fetchPageData = async (page: number) => {

        console.log(`Fetching Publisuites page ${page}...`);

        try {

            // Fetch data from Publisuites
            const data = await fetchDataFromPublisuites(url, cookie, page);

            if (data && Array.isArray(data)) {
                for (const item of data) {
                    if (!seenDomains.has(item.domain)) {
                        seenDomains.add(item.domain); // Track processed domain
                        await uploadToDatabase(payload, item, MARKETPLACE_NAME_PUBLISUITES); // Upload to database
                    }
                }
            } else {
                console.warn(`No data fetched for page ${page}`);
            }

            return data;

        }catch(error){
            console.error(`Error fetching data for page ${page}`, error instanceof Error ? error.message : error);
        }
    }

    for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);

        const tasks = [];
        for (let page = start; page <= end; page++) {
            tasks.push(queue.add(() => fetchPageData(page)));
        }

        await Promise.all(tasks);
    }

    console.log('Publisuites data processing complete.');
}