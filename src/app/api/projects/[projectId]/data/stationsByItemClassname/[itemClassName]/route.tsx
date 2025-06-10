import { ItemType } from "@/lib/satisfactory/data";
import { getCurrentUser } from "@/lib/services/auth";
import { getStationsByItemClassname } from "@/lib/services/stations";
import { getDatabase } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

// For now just trains
//
// Given an item className, we want to see how that item is used in the
// network
//
// 1. Which train stations are loading or unloading the item and at which platforms
// 2. Which trains are carrying this item.

export async function GET(req: NextRequest, { params }: { params: Promise<{ itemClassName: ItemType, projectId: string }> }) {

    const user = await getCurrentUser();
    const pathParams = await params;

    const projectId = parseInt(pathParams.projectId);
    const itemClassName = pathParams.itemClassName;

    const stations = await getStationsByItemClassname(itemClassName, projectId, user.id);

    return NextResponse.json(stations);
}