import Ajv, { JSONSchemaType } from "ajv";
import schema from '@schemas/data.schemas.json';
export const ajv = new Ajv();

ajv.addSchema(schema, "data");