import { z } from "zod";

export type Issue = {
  code: string;
  field: string;
  message: string;
}

/**
 * Formats a list of zod errors to match the issues shape
 * @param error - A list of zod errors
 * @returns A list of formatted issues
 */
export function formatError(error: z.ZodError): Issue[] {
  return error.issues.map(i => {
    const params = (i as z.core.$ZodIssue & { params?: Record<string, unknown> }).params;
    return {
      code: (params?.code as string) ?? i.code,
      field: i.path.reduce<string>((acc, segment) => {
        if (typeof segment === "number") {
          return `${acc}[${segment}]`
        }
        return acc ? `${acc}.${String(segment)}` : String(segment)
      }, ""),
      message: i.message,
    }
  });
}

/**
 * Parses a request through specified zod schema
 * @param req - JSON request to parse
 * @param schema - A zod schema
 * @returns The parsed data if ok, or a formatted list of errors
 */
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
