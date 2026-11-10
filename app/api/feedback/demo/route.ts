import { getCollection } from "@/lib/mongodb";
import { makeDemoDocs } from "@/lib/demo";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const key = request.headers.get("x-admin-key");
  return !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

// Seed ~130 demo handprints (65 per batch) into MongoDB with isDemo: true
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const perBatch = Math.min(Math.max(Number(body.perBatch) || 65, 10), 200);
    const col = await getCollection();

    // Clear existing demo docs first so we don't duplicate if clicked twice
    await col.deleteMany({ isDemo: true });

    const docs = makeDemoDocs(perBatch);
    const result = await col.insertMany(docs);
    return Response.json({ inserted: result.insertedCount }, { status: 201 });
  } catch (err) {
    console.error("POST /api/feedback/demo failed:", err);
    return Response.json({ error: "Could not seed demo handprints into MongoDB." }, { status: 500 });
  }
}

// Delete all demo handprints (isDemo: true) from MongoDB, leaving real student feedback untouched
export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const col = await getCollection();
    const { deletedCount } = await col.deleteMany({ isDemo: true });
    return Response.json({ deleted: deletedCount });
  } catch (err) {
    console.error("DELETE /api/feedback/demo failed:", err);
    return Response.json({ error: "Could not delete demo handprints from MongoDB." }, { status: 500 });
  }
}

