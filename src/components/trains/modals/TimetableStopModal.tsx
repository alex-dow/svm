'use client';
import TrainStationSelect from "@/components/TrainStationSelect";
import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useState } from "react";
import { StationMode } from "@/lib/types";
import { handleGetStationItems } from "@/lib/actions/trainStations";
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { ItemSelect } from "@/components/ItemSelect";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { getSatisfactoryItems } from "@/lib/satisfactory/data";
import { handleAddStop } from "@/lib/actions/trains";


export interface TimetableStopItemSelectModalProps {
    visible: boolean,
    onHide: () => void,
    stationId: number,
    mode: StationMode,
    onSelectItem?: (itemId?: string) => void
}

export function TimetableStopItemSelectModal({stationId, mode, visible, onHide, onSelectItem}: TimetableStopItemSelectModalProps) {

    const [ stationItems, setStationItems ] = useState<{item_id: string, station_id: number, mode: StationMode}[]>([]);
    const [ showStationItems, setShowStationItems ] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState<string>();
    

    const itemFilter = (item: IItemSchema) => {
        return stationItems.findIndex((stationItem) => stationItem.item_id === item.className) > -1;
    }

    const _onHide = () => {
        setSelectedItem(undefined);
        onHide();
    }

    const refresh = useCallback(() => {

        handleGetStationItems(stationId)
        .then((res) => {
            console.log('res?', res);
            setStationItems(res.filter((i) => i.mode === mode));
        });
    }, [stationId, mode])

    useEffect(() => {
        refresh();
    },[stationId, mode, refresh]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (onSelectItem) {
            onSelectItem(selectedItem);
        }

        _onHide();

    }
    

    return (
        <Dialog visible={visible} onHide={_onHide}>
            <form onSubmit={onSubmit}>
            <div className="flex align-items-center">
                <Checkbox onChange={e => setShowStationItems(e.checked === true)} checked={showStationItems} inputId="show-station-items" />
                <label htmlFor="show-station-items" className="ml-2">Only show items available at the selected station</label>
            </div>

                
            {!showStationItems && <ItemSelect onChange={(e) => setSelectedItem(e)} value={selectedItem} /> }
            {showStationItems && <ItemSelect onChange={(e) => setSelectedItem(e)} value={selectedItem} itemFilter={itemFilter} /> }
            { selectedItem && (
                <Button label="Add item" type="submit" />
            )}
            </form>

        </Dialog>
    )


}

export interface NewTrainStationModalProps {
    visible: boolean,
    onHide: () => void,
    projectId: number,
    trainId: number
}

export default function TimetableStopModal({visible, onHide, projectId, trainId}: NewTrainStationModalProps) {

    const [ stationId, setStationId] = useState<number>();

    const [ itemMap, setItemMap ] = useState<{[key: string]: IItemSchema}>({});
    getSatisfactoryItems().then(setItemMap);

    const [ selectItemMode, setSelectItemMode ] = useState<StationMode>('loading');
    const [ showSelectItemModal, setShowSelectItemModal ] = useState(false);

    const [ loadingItems, setLoadingItems ] = useState<string[]>([]);
    const [ unloadingItems, setUnloadingItems ] = useState<string[]>([]);


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stationId) return;

        await handleAddStop({
            stationId,
            trainId,
            loadingItems,
            unloadingItems

        })

        _onHide();
    }

    const _onHide = () => {
        setStationId(undefined);
        setLoadingItems([]);
        setUnloadingItems([]);
        onHide();
    }

  
    return (
        <>
        <Dialog visible={visible} header="Add a stop on this train's timetable" onHide={() => _onHide()} >
            <div className="flex flex-col gap-4">
                <TrainStationSelect 
                    projectId={projectId} 
                    value={stationId} 
                    onChange={setStationId}
                />
            
            { stationId && <>
                <div className="flex gap-2">
                    <div className="w-1/2">
                        <h3 className="text-3xl font-bold">Loading</h3>
                        <Button label="Add item" onClick={() => {
                            setSelectItemMode('loading');
                            setShowSelectItemModal(true);
                        }} />
                        { loadingItems.map((loadingItem) => (
                            <div key={loadingItem}>
                                { itemMap[loadingItem].name }
                            </div>
                        ))}
                    </div>
                    <div className="w-1/2">
                        <h3 className="text-3xl font-bold">Unloading</h3>
                        <Button label="Add item" onClick={() => {
                            setSelectItemMode('unloading');
                            setShowSelectItemModal(true);
                        }} />
                        { unloadingItems.map((loadingItem) => (
                            <div key={loadingItem}>
                                { itemMap[loadingItem].name }
                            </div>
                        ))}                        
                    </div>
                </div>
                <Button label="Add stop" onClick={onSubmit} />

                <TimetableStopItemSelectModal 
                    visible={showSelectItemModal} 
                    onHide={() => setShowSelectItemModal(false)} 
                    mode={selectItemMode} 
                    stationId={stationId}
                    onSelectItem={(itemId) => {
                        if (itemId) {
                        if (selectItemMode === 'loading') {
                            setLoadingItems([...loadingItems, itemId]);
                        } else {
                            setUnloadingItems([...unloadingItems, itemId]);
                        }
                    }}}
                />
            </>}
            </div>
            

        </Dialog>
        </>
    );
}