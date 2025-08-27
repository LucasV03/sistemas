import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/cloudinary";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "repuestos" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
