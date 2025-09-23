import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function sendEmailHandler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = await req.json().catch(() => ({}));
  context.log("sendEmail called", body);

  // TODO: Integrate SMTP/SendGrid
  return { status: 200, jsonBody: { ok: true, received: body } };
}

app.http("sendEmail", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: sendEmailHandler,
});
