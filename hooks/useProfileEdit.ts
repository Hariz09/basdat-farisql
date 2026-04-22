"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfileAction } from "@/services/profileService";

export function useProfileEdit() {
  const [state, action, pending] = useActionState(updateProfileAction, null);

  useEffect(() => {
    if (state?.ok) toast.success("Profil berhasil diperbarui.");
  }, [state]);

  return { state, action, pending };
}
