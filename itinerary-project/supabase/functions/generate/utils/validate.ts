import { z } from "zod";

export type Issue = {
  code: string;
  field: string;
  message: string;
}

export function formatError(error: z.ZodError): Issue[] {
  return error.issues.map(i => ({
    code: i.code,
    field: i.path.join("."),
    message: i.message,
  }));
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