import { useQuery } from "@tanstack/react-query";
import { driveService } from "../services/driveService";

export const useFilePreview = (fileId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["filePreview", fileId],
    queryFn: () => driveService.getFilePreview(fileId),
    enabled: enabled && !!fileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
