import { Endpoint } from 'payload';

interface BacklinkData {
  domain: string;
  RD: string;
  TF: number;
  CF: number;
  price: number;
  source: string;
  allSources: { source: string; price: number }[];
}

export const bulkDomainSearchEndpoint: Endpoint = {
  path: '/bulkDomainSearch',
  method: 'post',
  handler: async (req) => {
    try {
      // Parse and validate the request body
      if (!req.text) {
        return new Response(
          JSON.stringify({ error: 'Request body is missing' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const rawBody = await req.text();
      let { domains } = JSON.parse(rawBody);

      console.log('Received domains:', domains);

      // Handle case where domains are passed as a comma-separated string
      if (typeof domains === 'string') {
        domains = domains.split(',').map((domain) => domain.trim());
      }

      if (!domains || domains.length === 0) {
        return new Response(
          JSON.stringify({
            error: 'Missing or invalid required field: domains',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Normalize domains
      domains = domains.map((domain: string) =>
        domain.toLowerCase().replace(/^www\./, '')
      );

      const batchSize = 100; // Adjust batch size as needed
      const backlinksData: { docs: BacklinkData[] } = { docs: [] };

      // Batch process the domains to avoid query size limits
      for (let i = 0; i < domains.length; i += batchSize) {
        const batch = domains.slice(i, i + batchSize);
        const result = await req.payload.find({
          collection: 'backlinks',
          where: { domain: { in: batch } },
          limit: batchSize, // Ensure the limit is set
        });
        const mappedDocs = result.docs.map((doc: any) => ({
          ...doc,
          allSources: [{ source: doc.source, price: doc.price }],
        }));
        backlinksData.docs.push(...mappedDocs);
      }

      console.log('Fetched backlinks data:', backlinksData.docs);

      // Filter to get unique domains with the smallest price
      const backlinksMap: Record<string, BacklinkData> = {};

      backlinksData.docs.forEach((doc: any) => {
        const existingBacklink = backlinksMap[doc.domain];
        if (!existingBacklink || doc.price < existingBacklink.price) {
          const otherSources = backlinksData.docs
            .filter(
              (source: any) =>
                source.domain === doc.domain && source.source !== doc.source
            )
            .map((source: any) => ({
              source: source.source,
              price: source.price,
            }));

          otherSources.push({
            source: doc.source,
            price: doc.price,
          });

          backlinksMap[doc.domain] = {
            domain: doc.domain,
            RD: doc.RD > 1000 ? `${(doc.RD / 1000).toFixed(1)}k` : `${doc.RD}`,
            TF: doc.TF,
            CF: doc.CF,
            price: doc.price,
            source: doc.source,
            allSources: otherSources,
          };
        }
      });

      const backlinks = Object.values(backlinksMap);

      const foundDomains = backlinks.map((backlink) => backlink.domain);
      const foundCount = domains.length;
      const minPrice = backlinks.reduce(
        (total, backlink) => total + backlink.price,
        0
      );
      const avgPrice = Math.floor(minPrice / foundDomains.length);
      const maxPrice = backlinks
        .map((backlink) => {
          if (backlink.allSources.length > 1) {
            // Get the maximum price if there are multiple items
            return Math.max(...backlink.allSources.map((source) => source.price));
          } else {
            // Return the price directly if there is only one item
            return backlink.allSources[0]?.price || 0;
          }
        })
        .reduce((sum, price) => sum + price, 0); // Sum up the maximum prices

      const aboutPrice = [foundCount, avgPrice, minPrice, maxPrice];

      // Respond with the processed data
      return new Response(
        JSON.stringify({
          keys: domains,
          aboutPrice,
          backlinks,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {
      console.error('Error fetching SERP data:', error);

      return new Response(
        JSON.stringify({
          error: error.message || 'An unknown error occurred.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
