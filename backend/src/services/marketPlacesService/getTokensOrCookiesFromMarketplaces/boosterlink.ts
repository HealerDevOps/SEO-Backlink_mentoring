import * as cheerio from 'cheerio';
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import { BOOSTERLINK_API_URL } from '@/globals/marketplaceUrls.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { MARKETPLACE_NAME_BOOSTERLINK } from '@/globals/strings.ts';

export const getCookieFromBoosterlink = async (): Promise<string | null> => {

    try {
        const credentials = await getCredentialsForMarketplaces();

        // Iterate through the credentials and fetch cookie for Boosterlink
        for (const credential of credentials) {
            const hasBoosterlinkTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_BOOSTERLINK);

            if (hasBoosterlinkTarget) {
                console.log(`Found "Boosterlink" credentials for ${credential.email}`);

                // Fetch cookie from Boosterlink API
                if (credential.password) {

                    const cookie = await fetchCookieFromBoosterlink(credential.email, credential.password);

                    return cookie;
                }
            }
        }

        return null; // Return null if no Boosterlink credentials found
    } catch (error) {

        const { errorDetails, status } = ErrorHandler.handle(error, "Not Found Cookie From Boosterlink : ");
        console.log(errorDetails, status);

        return null;
    }
};

const fetchCookieFromBoosterlink = async (email: string, password: string): Promise<string> => {

    try {
        const getValidationData = await getValidationDataForPostLogin();

        if (!getValidationData) {
            throw new Error('Validation data could not be fetched');
        }

        const formData = new URLSearchParams();
        formData.append('Button_Valider', "Login");
        formData.append('TextBox_email', email);
        formData.append('TextBox_mot_de_passe', password);
        formData.append('__EVENTVALIDATION', getValidationData.__EVENTVALIDATION);
        formData.append('__VIEWSTATE', getValidationData.__VIEWSTATE);
        formData.append('__VIEWSTATEGENERATOR', getValidationData.__VIEWSTATEGENERATOR);

        const response = await fetch(BOOSTERLINK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            redirect: 'manual',  // Prevent automatic redirects
        });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to log in to Boosterlink');
        }

        // Extract cookies from the response headers
        const setCookieHeader = response.headers.get('set-cookie') || '';

        if(setCookieHeader){
            const cookies = extractCookie(setCookieHeader);
            return cookies || '';
        }

        return ''; // Return an empty string if no cookies are found

    } catch (error) {

        const { errorDetails, status } = ErrorHandler.handle(error, 'Error fetching cookie from Boosterlink:');
        console.log(errorDetails, status);
        return errorDetails.context;

    }
};

const extractCookie = (cookieString: string): string | null => {

    const regex = /(ASP\.NET_SessionId=[^;]+).*?(ClientUserName=[^;]+)/;

    const match = cookieString.match(regex);

    if (match) {
        // Join the captured cookies together, excluding any extra metadata
        const extractedCookie = `${match[1].trim()}; ${match[2].trim()}`;
        return extractedCookie;
    }
    return null;
};

const getValidationDataForPostLogin = async (): Promise<
    {
        __EVENTVALIDATION: string;
        __VIEWSTATE: string;
        __VIEWSTATEGENERATOR: string;
    } | null> => {

    try {
        const response = await fetch(BOOSTERLINK_API_URL, { method: 'GET' });

        if (!response.ok && response.status !== 302) {
            console.error('Response body:', await response.text());
            throw new Error('Failed to fetch validation data');
        }

        const responseBody = await response.text();
        const $ = cheerio.load(responseBody);

        const viewState = $("input[name='__VIEWSTATE']").val() as string || '';
        const viewStateGenerator = $("input[name='__VIEWSTATEGENERATOR']").val() as string || '';
        const eventValidation = $("input[name='__EVENTVALIDATION']").val() as string || '';

        if (viewState && viewStateGenerator && eventValidation) {
            return {
                __EVENTVALIDATION: eventValidation,
                __VIEWSTATE: viewState,
                __VIEWSTATEGENERATOR: viewStateGenerator,
            };
        }

        throw new Error('Validation data missing in response');
    } catch (error) {

        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching validation data for Boosterlink : ");
        console.log(errorDetails, status);

        return null;

    }
};
