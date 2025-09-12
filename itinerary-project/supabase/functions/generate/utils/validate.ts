import { z } from "zod";

export type Issue = {
  code: string;
  field: string;
  message: string;
}

export function formatError(error: z.ZodError): Issue[] {
  return error.issues.map(i => ({
    code: mapIssueCode(i),
    field: i.path.join("."),
    message: i.message,
  }));
}

function mapIssueCode(i: z.core.$ZodIssue) : string {
  switch (`${i.code}:${i.path.join(".")}`) {
    case "invalid_type:name":
      return "MISSING_NAME";
    case "invalid_type:preferences":
      return "MISSING_PACE";
    case "invalid_type:dates":
      return "MISSING_DATES";
    case "invalid_type:dates.start":
      return "PARTIAL_DATES";
    case "invalid_type:dates.end":
      return "PARTIAL_DATES";
    case "invalid_value:preferences.pace":
      return "INCORRECT_PACE";
    case "custom:dates":
      return "END_BEFORE_START"
    case "invalid_format:dates.start":
      return "INVALID_DATE_FORMAT"
    case "invalid_format:dates.end":
      return "INVALID_DATE_FORMAT"
    default:
      return i.code
  }
}

export async function parseJsonWith<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
) : Promise<{ok: true; data: z.infer<T>} | {ok:false;errors:Issue[]}> {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  return parsed.success
    ? {ok: true, data: parsed.data}
    : {ok: false, errors: formatError(parsed.error)};
}