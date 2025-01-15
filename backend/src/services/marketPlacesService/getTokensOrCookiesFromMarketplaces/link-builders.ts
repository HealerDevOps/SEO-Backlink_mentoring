import { LINK_BUILDERS_API_URL } from '@/global/marketplaceUrls.ts';
import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';


 // Replace with actual URL if needed

// Function to fetch token from Link.Builders API
const fetchTokenFromLinkBuilders = async (email: string, password: string): Promise<string> => {
    try {
      const response = await axios.post(LINK_BUILDERS_API_URL, {
        email: email,
        password: password,
      });

      // Extract the token from the response
      const token = response.data.token;

      return token;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios Error while fetching token:',
          error.response?.status,
          error.response?.data || error.message
        );
      } else {
        console.error('Error fetching token:', error.message);
      }
      throw new Error('Failed to fetch token from Link.Builders.');
    }
};

// Main function to fetch credentials and compare website target
export const getTokenForLinkBuilders = async (): Promise<string | null> => {
    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for Link.Builders
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'Link.Builders'
        const hasLinkBuildersTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'Link.Builders');

        if (hasLinkBuildersTarget) {
            console.log(`Found Link.Builders credentials for ${credential.email}`);

            // Fetch token from Link.Builders API
            if (credential.password) {
                const token = await fetchTokenFromLinkBuilders(credential.email, credential.password);

                return token;
            }
        }
    }

    return null; // Return null if no Link.Builders credentials found
};
