// import { NextResponse } from "next/server";
// import { client } from "@/sanity/lib/client";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { messageId, messageIds } = body;

//     console.log("Delete request received for messageId:", messageId);

//     if (!messageId) {
//       return NextResponse.json(
//         { error: "Message ID is required" },
//         { status: 400 }
//       );
//     }

//     // First, find documents that reference this one
//     const referencingDocs = await client.fetch(`*[references($docId)]._id`, {
//       docId: messageId,
//     });

//     console.log(
//       `Found ${referencingDocs.length} documents referencing ${messageId}:`,
//       referencingDocs
//     );

//     if (referencingDocs.length > 0) {
//       // Option 1: Delete all referencing documents first
//       console.log("Deleting all referencing documents first");

//       // Execute each delete in sequence
//       for (const docId of referencingDocs) {
//         try {
//           console.log(`Deleting referencing document: ${docId}`);
//           await client.delete(docId);
//         } catch (refDeleteError) {
//           console.error(
//             `Failed to delete referencing document ${docId}:`,
//             refDeleteError
//           );
//           // Continue with other deletions even if one fails
//         }
//       }

//       // Now try to delete the original document
//       console.log(`Now deleting the original document: ${messageId}`);
//       await client.delete(messageId);
//     } else {
//       // No references, simple delete
//       console.log("No references found, proceeding with normal delete");
//       await client.delete(messageId);
//     }

//     console.log("Delete operation completed successfully");
//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Error deleting message:", error);

//     // Check for specific reference error
//     const isReferenceError =
//       error.message &&
//       error.message.includes("cannot be deleted as there are references to it");

//     if (isReferenceError) {
//       return NextResponse.json(
//         {
//           error:
//             "Cannot delete this message because it's referenced by other content",
//           details: error.message,
//           type: "reference_error",
//         },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json(
//       {
//         error: "Failed to delete message",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messageId, messageIds } = body;

    // Handle single message deletion
    if (messageId) {
      console.log("Delete request received for messageId:", messageId);

      // First, find documents that reference this one
      const referencingDocs = await client.fetch(`*[references($docId)]._id`, {
        docId: messageId,
      });

      console.log(
        `Found ${referencingDocs.length} documents referencing ${messageId}:`,
        referencingDocs
      );

      if (referencingDocs.length > 0) {
        // Option 1: Delete all referencing documents first
        console.log("Deleting all referencing documents first");

        // Execute each delete in sequence
        for (const docId of referencingDocs) {
          try {
            console.log(`Deleting referencing document: ${docId}`);
            await client.delete(docId);
          } catch (refDeleteError) {
            console.error(
              `Failed to delete referencing document ${docId}:`,
              refDeleteError
            );
            // Continue with other deletions even if one fails
          }
        }

        // Now try to delete the original document
        console.log(`Now deleting the original document: ${messageId}`);
        await client.delete(messageId);
      } else {
        // No references, simple delete
        console.log("No references found, proceeding with normal delete");
        await client.delete(messageId);
      }

      console.log("Delete operation completed successfully");
      return NextResponse.json({ success: true });
    }
    // Handle bulk message deletion
    else if (messageIds && Array.isArray(messageIds) && messageIds.length > 0) {
      console.log("Bulk delete request received for messageIds:", messageIds);

      let successCount = 0;
      let failCount = 0;

      // Process each message ID
      for (const id of messageIds) {
        try {
          // First, find documents that reference this one
          const referencingDocs = await client.fetch(
            `*[references($docId)]._id`,
            {
              docId: id,
            }
          );

          console.log(
            `Found ${referencingDocs.length} documents referencing ${id}:`,
            referencingDocs
          );

          if (referencingDocs.length > 0) {
            // Delete all referencing documents first
            console.log("Deleting all referencing documents first");

            // Execute each delete in sequence
            for (const docId of referencingDocs) {
              try {
                console.log(`Deleting referencing document: ${docId}`);
                await client.delete(docId);
              } catch (refDeleteError) {
                console.error(
                  `Failed to delete referencing document ${docId}:`,
                  refDeleteError
                );
                // Continue with other deletions even if one fails
              }
            }
          }

          // Delete the original document
          console.log(`Deleting message: ${id}`);
          await client.delete(id);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete message ${id}:`, error);
          failCount++;
        }
      }

      console.log(
        `Bulk delete operation completed: ${successCount} successful, ${failCount} failed`
      );
      return NextResponse.json({
        success: true,
        successCount,
        failCount,
      });
    }
    // No valid ID provided
    else {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error deleting message:", error);

    // Check for specific reference error
    const isReferenceError =
      error.message &&
      error.message.includes("cannot be deleted as there are references to it");

    if (isReferenceError) {
      return NextResponse.json(
        {
          error:
            "Cannot delete this message because it's referenced by other content",
          details: error.message,
          type: "reference_error",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete message",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
