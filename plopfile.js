/**
 * ============================================================================
 * PLOP.JS CODE GENERATORS
 * ============================================================================
 *
 * Usage:
 *   npm run generate         # Interactive mode
 *   npm run generate feature # Generate a feature module
 *   npm run generate component # Generate a component
 *
 * @see https://plopjs.com/documentation/
 */

export default function (plop) {
  // ===========================================================================
  // GENERATOR: Feature Module
  // ===========================================================================
  plop.setGenerator("feature", {
    description: "Create a new feature module with components, api, and types",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Feature name (e.g., auth, dashboard, users):",
        validate: (value) =>
          value.trim() ? true : "Feature name is required",
      },
    ],
    actions: [
      // Index file (barrel export)
      {
        type: "add",
        path: "src/features/{{kebabCase name}}/index.ts",
        template: `/**
 * {{pascalCase name}} Feature Module
 */

export * from "./components";
export * from "./types";
`,
      },
      // Components barrel
      {
        type: "add",
        path: "src/features/{{kebabCase name}}/components/index.ts",
        template: `/**
 * {{pascalCase name}} Components
 */

// export { ExampleComponent } from "./ExampleComponent";
`,
      },
      // API
      {
        type: "add",
        path: "src/features/{{kebabCase name}}/api.ts",
        template: `/**
 * {{pascalCase name}} API
 */

import apiClient from "@/lib/api-client";

const BASE_URL = "/{{kebabCase name}}";

export const {{camelCase name}}Api = {
  getAll: async () => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(\`\${BASE_URL}/\${id}\`);
    return response.data;
  },

  create: async <T>(data: T) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async <T>(id: string, data: T) => {
    const response = await apiClient.patch(\`\${BASE_URL}/\${id}\`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(\`\${BASE_URL}/\${id}\`);
    return response.data;
  },
};
`,
      },
      // Types
      {
        type: "add",
        path: "src/features/{{kebabCase name}}/types.ts",
        template: `/**
 * {{pascalCase name}} Types
 */

export interface {{pascalCase name}}Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface {{pascalCase name}}CreateInput {
  // Define create input fields
}

export interface {{pascalCase name}}UpdateInput {
  // Define update input fields
}
`,
      },
      // Success message
      () => {
        console.log("\n✅ Feature created at: src/features/{{kebabCase name}}/");
        console.log("   - index.ts (barrel export)");
        console.log("   - components/index.ts");
        console.log("   - api.ts");
        console.log("   - types.ts\n");
        return "";
      },
    ],
  });

  // ===========================================================================
  // GENERATOR: Common Component
  // ===========================================================================
  plop.setGenerator("component", {
    description: "Create a new common component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (PascalCase, e.g., Button, Modal, Card):",
        validate: (value) =>
          value.trim() ? true : "Component name is required",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/common/{{pascalCase name}}.tsx",
        template: `interface {{pascalCase name}}Props {
  children?: React.ReactNode;
  className?: string;
}

/**
 * {{pascalCase name}} Component
 */
export function {{pascalCase name}}({ children, className }: {{pascalCase name}}Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
`,
      },
      () => {
        console.log(
          "\n✅ Component created at: src/components/common/{{pascalCase name}}.tsx\n"
        );
        return "";
      },
    ],
  });
}
