"use client"; // Wajib karena ada onClick

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { handleDeleteEventAction } from "@/services/actions"; // Nanti kita buat file ini
import { useTransition } from "react";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();

  const onClickDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus acara ini?")) {
      // startTransition memastikan UI terupdate setelah action selesai
      startTransition(async () => {
        await handleDeleteEventAction(eventId);
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
      disabled={isPending}
      onClick={onClickDelete}
    >
      <Trash2 className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
    </Button>
  );
}