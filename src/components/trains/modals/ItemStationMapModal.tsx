'use client';
import Loading from "@/components/Loading";
import { StationByItem, type StationsByItem } from "@/lib/services/stations";
import { NetworkOverviewItem } from "@/lib/types";
import { Badge } from "primereact/badge";
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
    const [ stations, setStations ] = useState<{station_id: number, station_name: string, platforms: StationByItem[]}[]>([]);

    useEffect(() => {
        const refresh = async () => {
            setLoading(true);
            try {
                if (!item) {
                    return;
                }

                const res = await fetch('/api/projects/' + projectId + '/data/stationsByItemClassname/' + item.item_classname);
                const data = await res.json() as StationsByItem;

                const groupedData = data
                    .sort((a,b) => {
                        return a.station_name.localeCompare(b.station_name) || a.position - b.position;
                    })
                    .reduce((a, item) => {
                        let idx = a.findIndex((i) => i.station_id === item.station_id);
                        if (idx === -1) {
                            a.push({station_id: item.station_id, station_name: item.station_name, platforms: []});
                            idx = a.length-1;
                        }
                        a[idx].platforms.push(item);

                        return a;
                    }, [] as {station_id: number, station_name: string, platforms: Array<StationByItem>}[])

                setStations(groupedData);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        refresh();

    }, [projectId, item]);


    return <Dialog visible={visible} onHide={onHide} header="Where is this item?" style={{width: '35rem'}}>
        { loading && <Loading />}
        { !loading && 
        <div className="flex flex-col flex-1" >
            {stations.map((station) => (
                <div key={station.station_id} className="flex gap-4 flex-1 items-start border-b-1 pb-1 pt-1 border-slate-600">
                    <div className="min-w-30">{ station.station_name }</div>
                    <div className="flex flex-col flex-1">
                        {station.platforms.map((platform) => (
                            <div className="flex items-center" key={platform.item_id}>
                                <div className="text-sm font-light">
                                    Platform <strong>#{platform.position}</strong>
                                </div>
                                <div className="flex-1 flex items-center justify-end gap-2">
                                    <div>
                                    <Badge 
                                        value={platform.platform_mode === 'loading' ? 'Loading' : 'Unloading'} 
                                        severity={platform.platform_mode === 'loading' ? 'success' : 'warning'}
                                    />   
                                    </div>
                                    <div>
                                        {platform.rate } / min                                                   
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        }

    </Dialog>


}