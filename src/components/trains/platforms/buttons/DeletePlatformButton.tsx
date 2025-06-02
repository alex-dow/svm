"use client";

import ButtonWithBusyModal from "@/components/buttons/ButtonWithBusyModal";
import { removeStationPlatform } from "@/lib/services/stationPlatforms";

export interface DeletePlatformButtonProps {
  platformId: number;
}

export function DeletePlatformButton({platformId}: DeletePlatformButtonProps) {
  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await removeStationPlatform(platformId);
  }

  return (
    <ButtonWithBusyModal severity="danger" icon="pi pi-trash" progressMessage="Deleting ..." onClick={onClick} />
  );
}
