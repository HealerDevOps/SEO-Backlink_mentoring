
import { CollectionConfig } from 'payload';

export const Backlinks: CollectionConfig = {
  slug: 'backlinks',
  admin: {
    useAsTitle: 'domain', // Use the email field as the title in the admin panel
  },
  access: {
    read: () => true,
    create: () => true,  // Allow creation for all
    update: ({ req }) => req.user?.role === 'admin', // Allow only admins to update
  },
  fields: [
    {
      name: 'domain',
      type: 'text',
      index: true,
      required: true,
    },
    {
        name: 'RD',
        type: 'number', // Referring Domains
      },
    {
      name: 'TF',
      type: 'number', // Trust Flow
    },
    {
      name: 'CF',
      type: 'number', // Citation Flow
    },
    {
      name: 'price',
      type: 'number', // Price
      required: true,
    },
    {
      name: 'TTF',
      type: 'text', // Price
    },
    {
      name: 'Language',
      type: 'text', // Price
    },
    {
      name: 'Title',
      type: 'text', // Price
    },
    {
      name: 'source',
      type: 'select', // Source of the backlink (Paper Club, Press Whizz, etc.)
      options: [
        { label: 'Paperclub', value: 'Paperclub' },
        { label: 'Ereferer', value: 'Ereferer' },
        { label: 'Presswhizz', value: 'Presswhizz' },
        { label: 'Bulldoz', value: 'Bulldoz' },
        { label: 'Prensalink', value: 'Prensalink' },
        { label: 'Seojungle', value: 'Seojungle' },
        { label: 'Mistergoodlink', value: 'Mistergoodlink' },
        { label: 'Boosterlink', value: 'Boosterlink' },
        { label: 'Linkavistar', value: 'Linkavistar' },
        { label: 'Getalink', value: 'Getalink' },
        // Add more sources as needed
      ],
      required: true,
    },
    {
      name: 'expiry date',
      type: 'text',
    },
    {
      name: 'dateFetched',
      type: 'date',
      required: true,
    },
  ],
};
