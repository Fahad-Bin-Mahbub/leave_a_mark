import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// Remove an inappropriate handprint:
//   curl -X DELETE https://your-site.vercel.app/api/feedback/<id> -H "x-admin-key: <ADMIN_KEY>"
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const key = request.headers.get("x-admin-key");

  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return Response.json({ error: "Nice try." }, { status: 401 });
  }
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id." }, { status: 400 });
  }

  try {
    const col = await getCollection();
    const { deletedCount } = await col.deleteOne({ _id: new ObjectId(id) });
    return Response.json({ deleted: deletedCount === 1 });
  } catch (err) {
    console.error("DELETE /api/feedback failed:", err);
    return Response.json({ error: "Database error." }, { status: 500 });
  }
}

