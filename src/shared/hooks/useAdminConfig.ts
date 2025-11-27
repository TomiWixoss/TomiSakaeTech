import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService, UploadConfig } from "../services/adminService";

export const useAdminConfig = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["adminConfig"],
    queryFn: () => adminService.getConfig(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSaveAdminConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ password, config }: { password: string; config: UploadConfig }) =>
      adminService.saveConfig(password, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConfig"] });
    },
  });
};

export const useVerifyAdminPassword = () => {
  return useMutation({
    mutationFn: (password: string) => adminService.verifyPassword(password),
  });
};
