import { NextResponse } from "next/server";
import { getVisionAnalysisResult } from "@lib/openai";
import { getNewFileUploads } from "@lib/supabase";
import pinata from "@lib/pinata";
import { DeleteRequest, PinRequest, UploadRow } from "@lib/types";
import { createClient } from "@lib/supabase/server";
import pinataWeb3 from "@lib/pinata/web3";

const validImageTypes = new Set(['image/jpeg', 'image/png', 'image/avif']);

export async function POST(request: Request) {
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error || !userResponse.data?.user) {
    return NextResponse.json({ message: 'User is not signed in' }, { status: 401 });
  }

  const userId = userResponse.data.user.id;
  const formData = await request.formData();
  const files: File[] = formData.getAll('files').filter(file => file instanceof File);
  const uploadResults: UploadRow[] = [];

  let newFiles = await getNewFileUploads(supabase, files);
  newFiles = newFiles.filter(newFile => validImageTypes.has(newFile.file.type));

  for (let i = 0; i < newFiles.length; i++) {
    const {file, buffer, imageHash} = newFiles[i];
    const upload = await pinata.upload.file(file); // TODO: Handle exceptions
    const type = file.type;

    const visionResult = await getVisionAnalysisResult(type, buffer);

    if (!visionResult) {
      throw new Error('No analysis');
    }

    uploadResults.push({
      upload: {
        visionAnalysis: visionResult,
        fileName: file.name,
      },
      pinata_cid_private: upload.cid,
      pinata_id: upload.id,
      hash: imageHash,
      is_pinned: false,
      user_id: userId
    });
  }

  const { error } = await supabase.from("uploads").insert(uploadResults);

  if (error) {
    const idsToDelete = uploadResults.map(upload => upload.pinata_id);

    pinata.files.delete(idsToDelete);

    return NextResponse.json({message: error.message}, {status: 500});
  }

  // TODO: If zero files were uploaded then an error code should be returned.
  return NextResponse.json({
    uploadedFilesCount: uploadResults.length,
    filesCount: files.length
  });
}

/**
 * TODO: Must unpin public file before deleting.
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request) {
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error || !userResponse.data?.user) {
    return NextResponse.json({ message: 'User is not signed in' }, { status: 401 });
  }

  const { ids }: DeleteRequest = await request.json();
  const {data, error} = await supabase.from('uploads').select().in('id', ids);

  if (error) {
    console.error(error);
    return NextResponse.json({message: "There was a problem getting the rows to delete"}, {status: 500});
  }

  const pinataIds: string[] = data.map(row => row.pinata_id);

  console.log(`Pinata ID for delete: ${pinataIds}`);

  const deletedFiles = await pinata.files.delete(pinataIds);

  console.log(`Pinata deleted files: ${JSON.stringify(deletedFiles)}`);

  const deleteError = (await supabase.from('uploads').delete().in('pinata_id', pinataIds)).error;

  if (deleteError) {
    console.error(`Supabase delete error: ${JSON.stringify(error)}`); // TODO: Handle this better
  }

  console.log(`Delete successful`)

  return new Response();
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error || !userResponse.data?.user) {
    return NextResponse.json({ message: 'User is not signed in' }, { status: 401 });
  }

  const {id}: PinRequest = await request.json();
  const {data, error} = await supabase.from('uploads').select().eq('id', id);

  if (error) {
    return NextResponse.json({message: "Unable to find upload"}, {status: 400});
  }

  const uploadRow = data[0];
  const isPinned = uploadRow.is_pinned;
  const uploadId = uploadRow.id;
  const fileName = uploadRow.upload.fileName;
  const privateCid = uploadRow.pinata_cid_private;
  let ipfsHash = uploadRow.pinata_cid_public;

  try {
    if (isPinned) {
      await pinataWeb3.unpin([ipfsHash]);
    } else {
      const file = await pinata.gateways.get(privateCid);
      
      if (file.data instanceof Blob) {
        const pin = await pinataWeb3.upload.file(new File([file.data], fileName));
        ipfsHash = pin.IpfsHash;
      } else {
        console.error("Uploaded file is not blob type");
        throw new Error("Uploaded file is not blob type");
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({message: "unable to pin or unpin"}, {status: 500});
  }

  const updateResponse = await supabase.from("uploads").update({is_pinned: !isPinned, pinata_cid_public: ipfsHash})
    .eq('id', uploadId);
  const updateError = updateResponse.error;

  if (updateError) {
    console.error(`Update error ${JSON.stringify(updateError)}`);
    return NextResponse.json({message: "Unable to update supbase"}, {status: 500});
  }

  return new Response();
}