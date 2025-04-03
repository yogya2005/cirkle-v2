// services/resourceSyncService.ts

import { getGoogleAccessToken } from "@/services/googleAuthService";
import { fetchDriveFileMetadata } from "@/services/googleDriveService";
import { updateGroupResourceName } from "@/services/groupService";

export async function syncResourceNames(group: any, userId: string) {
  if (!group?.resources) return;

  const accessToken = getGoogleAccessToken();
  if (!accessToken) return;

  for (const type of ["documents", "files"] as const) {
    const resources = group.resources[type];
    if (!resources || !Array.isArray(resources)) continue;

    for (const resource of resources) {
      try {
        const metadata = await fetchDriveFileMetadata(resource.id, accessToken);

        if (metadata.name !== resource.name) {
          await updateGroupResourceName(group.id, resource.id, type, metadata.name);
        }
      } catch (err) {
        console.warn(`Could not update ${type} ${resource.id}:`, err);
      }
    }
  }
}
