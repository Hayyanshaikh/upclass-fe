import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:3000/api/docs-json",
    },
    output: {
      mode: "tags-split",
      target: "./app/api/endpoints",
      schemas: "./app/api/schemas",
      client: "react-query",
      clean: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: "./app/api/axios-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});
