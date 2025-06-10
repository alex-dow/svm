'use client';
import Loading from "@/components/Loading";
import { type StationsByItem } from "@/lib/services/stations";
import { NetworkOverviewItem } from "@/lib/types";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";

export interface ItemStationMapModalProps {
    item?: NetworkOverviewItem,
    projectId: number,
    visible: boolean,
    onHide: () => void
}

export function ItemStationMapModal({projectId, item, visible, onHide}: ItemStationMapModalProps) {
    
    const [ loading, setLoading ] = useState(false);
    const [ stations, setStations ] = useState<StationsByItem>([]);

    useEffect(() => {
        const refresh = async () => {
            setLoading(true);
            try {
                if (!item) {
                    console.error('ItemStationMapModal needs an item');
                    return;
                }

                const res = await fetch('/api/projects/' + projectId + '/data/stationsByItemClassname/' + item.item_classname);
                const data = await res.json() as StationsByItem;

                data.sort((a,b) => {
                    return a.station_name.localeCompare(b.station_name) || b.position - a.position;
                })

                setStations(data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        refresh();

    }, [projectId, item]);


    return <Dialog visible={visible} onHide={onHide} header="Where is this item?">
        { loading && <Loading />}
        <div className="flex flex-col flex-1">
            {stations.map((station) => (
                <div key={station.item_id} className="flex gap-2">
                    <div>
                        { station.station_name }
                    </div>
                    <div>
                        {station.position}
                    </div>
                    <div>
                        { station.platform_mode }
                    </div>
                    <div>
                        {station.rate } / min
                    </div>
                </div>
            ))}
        </div>

    </Dialog>


}