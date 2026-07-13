// ── Holidays — GraphQL schema ───────────────────────────────────────
// Exposes NZ public holidays as a simple query. No database storage needed.

import { getNzPublicHolidays } from '../utils/nz-holidays';

export default () => {

    const typeDefs = `
        type PublicHoliday {
            """The observed date of the holiday (Mondayised where applicable)."""
            date: Date!

            """Human-readable name, e.g. \"Waitangi Day\", \"Auckland Anniversary\"."""
            name: String!

            """Region name for provincial anniversary days. null for national holidays."""
            region: String
        }

        extend type Query {
            """
            Returns NZ public holidays for a calendar year.

            - year: The calendar year (e.g. 2026).
            - region: Optional filter for provincial anniversary days.
              E.g. \"Canterbury Anniversary\", \"Auckland Anniversary\".
              When omitted, only national holidays are returned.
            """
            publicHolidays(year: Int!, region: String): [PublicHoliday!]!
        }
    `;

    const resolvers = {
        Query: {
            publicHolidays: (
                _root: unknown,
                args: { year: number; region?: string },
            ) => {
                return getNzPublicHolidays(args.year, args.region);
            },
        },
    };

    return { typeDefs, resolvers };
};
