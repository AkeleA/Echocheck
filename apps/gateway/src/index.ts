import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 4000);

// --- middleware ---
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// --- routes ---

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Questionnaire schema (stub)
app.get("/questionnaire", async (_req: Request, res: Response) => {
  res.json({
    version: 1,
    steps: ["demographics", "symptoms", "meds", "lifestyle", "wellbeing"],
  });
});

// Submit response -> returns coded summary (stub SNOMED mapping)
app.post("/response", async (req: Request, res: Response) => {
  const Body = z.object({
    personId: z.string().uuid(),
    subjectId: z.string().uuid(),
    // Accept any JSON object: string keys, unknown values
    answers: z.record(z.string(), z.unknown()),
  });

  const body = Body.parse(req.body);

  // TODO: real mapping from answers -> coded summary
  const coded = { snomed: [{ code: "999999", display: "Example finding" }] };

  const saved = await prisma.response.create({
    data: { ...body, coded },
  });

  res.status(201).json({ id: saved.id, summary: coded });
});

// Book appointment (and later enqueue emails)
app.post("/book", async (req: Request, res: Response) => {
  const Body = z.object({
    patientId: z.string().uuid(),
    slot: z.string(), // ISO8601
    location: z.string(),
    bookedBy: z.string().uuid(),
    notes: z.string().optional(),
  });

  const body = Body.parse(req.body);

  const saved = await prisma.appointment.create({
    data: {
      patientId: body.patientId,
      slot: new Date(body.slot),
      location: body.location,
      status: "booked",
      bookedBy: body.bookedBy,
      notes: body.notes ?? null,
    },
  });

  // TODO: enqueue Azure Function "sendEmail"
  res.status(201).json({ id: saved.id });
});

// Consent (GDPR lawful basis)
app.post("/consent", async (req: Request, res: Response) => {
  const Body = z.object({
    personId: z.string().uuid(),
    scope: z.string(),
    lawfulBasis: z.string(),
    grantedAt: z.string(), // ISO8601
  });

  const body = Body.parse(req.body);

  await prisma.consent.create({
    data: {
      personId: body.personId,
      scope: body.scope,
      lawfulBasis: body.lawfulBasis,
      grantedAt: new Date(body.grantedAt),
    },
  });

  res.sendStatus(204);
});

// --- boot ---
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
