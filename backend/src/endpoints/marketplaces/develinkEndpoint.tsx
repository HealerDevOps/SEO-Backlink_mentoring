import { getBacklinksDataFromDevelink } from '@/services/getBacklinksFromMarketplaces/develink';
import { Endpoint } from 'payload';

export const fetchDevelinkEndpoint: Endpoint = {
  path: '/fetch-develink',
  method: 'get',
  handler: async ({ payload }) => {
    try {
      // Fetch the DevelinkData
      const develinkData = await getBacklinksDataFromDevelink();

      if (!Array.isArray(develinkData) || develinkData.length === 0) {
        return new Response(
          JSON.stringify({
            message: 'No DevelinkData found.',
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const totalItems = develinkData.length;
      let processedItems = 0; // Track the number of processed items

      const savePromises = develinkData.map(async (item) => {
        // Ensure the numeric fields are properly parsed
        const RD = Number(item.rd);
        const TF = Number(item.tf);
        const CF = Number(item.cf);
        const price = Number(item.price);

        // Validate that the conversion was successful
        if (isNaN(RD) || isNaN(TF) || isNaN(CF) || isNaN(price)) {
          throw new Error(
            `Invalid data received: RD=${item.rd}, TF=${item.tf}, CF=${item.cf}, price=${item.price}`
          );
        }

        // Check if the domain with the same source already exists
        const existingEntry = await payload.find({
          collection: 'backlinks',
          where: {
            domain: {
              equals: item.domain,
            },
            source: {
              equals: 'Develink', // Match the hardcoded source
            },
          },
        });

        if (existingEntry && existingEntry.totalDocs > 0) {
          // Update the existing entry
          const entryToUpdate = existingEntry.docs[0];
          await payload.update({
            collection: 'backlinks',
            id: entryToUpdate.id,
            data: {
              RD, // Update Referring Domains
              TF, // Update Trust Flow
              CF, // Update Citation Flow
              price, // Update price
              dateFetched: new Date().toISOString(), // Update fetch date
            },
          });
        } else {
          // Create a new entry
          await payload.create({
            collection: 'backlinks',
            data: {
              domain: item.domain,
              RD,
              TF,
              CF,
              price,
              source: 'Develink', // Hardcoded source for Paper Club
              dateFetched: new Date().toISOString(), // Current date
            },
          });
        }

        // Increment the processed items count
        processedItems += 1;

        // Calculate the progress percentage
        const progress = Math.round((processedItems / totalItems) * 100);

        // Send progress updates (You can implement a different way to report this progress to the client if needed)
        console.log(`Progress: ${progress}%`);

      });

      // Wait for all save operations to complete
      await Promise.all(savePromises);

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          results: develinkData,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error: any) {
      console.error('Error occurred while fetching:', error);

      return new Response(
        JSON.stringify({
          message: 'An error occurred while fetching data.',
          error: error.message || 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
