import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { mutationFns } from "@/lib/requests";

export const usePasswordlessLoginStart = (
  options?: UseMutationOptions<
    void,
    Error,
    Parameters<typeof mutationFns.startPasswordlessLogin>[0]
  >
) => {
  return useMutation({
    mutationFn: mutationFns.startPasswordlessLogin,
    ...options,
  });
};

export const usePasswordlessCodeVerify = (
  options?: UseMutationOptions<
    Response,
    Error,
    Parameters<typeof mutationFns.verifyPasswordlessCode>[0]
  >
) => {
  return useMutation({
    mutationFn: mutationFns.verifyPasswordlessCode,
    ...options,
  });
};
