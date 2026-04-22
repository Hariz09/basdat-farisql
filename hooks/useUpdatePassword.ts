"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updatePasswordAction } from "@/services/profileService";

export function useUpdatePassword() {
  const [state, action, pending] = useActionState(updatePasswordAction, null);

  useEffect(() => {
    if (state?.ok) toast.success("Password berhasil diperbarui.");
  }, [state]);

  return { state, action, pending };
}
