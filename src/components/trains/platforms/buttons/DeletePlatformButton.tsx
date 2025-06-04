"use client";

import ButtonWithBusyModal from "@/components/buttons/ButtonWithBusyModal";
import { handleDeleteStationPlatform } from "@/lib/actions/trainStations";

export interface DeletePlatformButtonProps {
  platformId: number;
}

export function DeletePlatformButton({platformId}: DeletePlatformButtonProps) {
  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleDeleteStationPlatform(platformId);
  }

  return (
    <ButtonWithBusyModal severity="danger" icon="pi pi-trash" progressMessage="Deleting ..." onClick={onClick} />
  );
}
