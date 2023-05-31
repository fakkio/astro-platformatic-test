/// <reference path="./global.d.ts" />
import { FastifyInstance } from "fastify";
const S = require("fluent-json-schema");

export default async function (app: FastifyInstance) {
  app.log.info("plugin loaded");

  async function incrementQuoteLikes(id) {
    const { db, sql } = app.platformatic;

    const result = await db.query(sql`
      UPDATE quotes SET likes = likes + 1 WHERE id=${id} RETURNING likes
    `);

    return result[0]?.likes;
  }

  // This JSON Schema will validate the request path parameters.
  // It reuses part of the schema that Platormatic DB has
  // automatically generated for our Quote entity.
  const schema = {
    params: S.object().prop("id", app.getSchema("Quote").properties.id),
  };

  app.post("/quotes/:id/like", { schema }, async function (request, response) {
    const params = request.params as { id: number };
    return { likes: await incrementQuoteLikes(params.id) };
  });

  app.graphql.extendSchema(`
    extend type Mutation {
      likeQuote(id: ID!): Int
    }
  `);

  app.graphql.defineResolvers({
    Mutation: {
      likeQuote: async (_, { id }) => await incrementQuoteLikes(id),
    },
  });
}
