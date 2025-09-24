import { z } from "zod";

export type Issue = {
  code: string;
  field: string;
  message: string;
}

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
