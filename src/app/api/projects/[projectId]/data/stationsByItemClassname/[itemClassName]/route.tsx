import { ItemType } from "@/lib/satisfactory/data";
import { getCurrentUser } from "@/lib/services/auth";
import { getStationsByItemClassname } from "@/lib/services/stations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ itemClassName: ItemType, projectId: string }> }) {

    const user = await getCurrentUser();
    const pathParams = await params;

    const projectId = parseInt(pathParams.projectId);
    const itemClassName = pathParams.itemClassName;

    const stations = await getStationsByItemClassname(itemClassName, projectId, user.id);

    return NextResponse.json(stations);
}