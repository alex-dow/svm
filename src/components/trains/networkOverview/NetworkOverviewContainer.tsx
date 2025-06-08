'use client';
import { NetworkOverviewItem } from "@/lib/types";
import { Checkbox } from "primereact/checkbox";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import NetworkOverviewUngroupedList from "./NetworkOverviewUngroupedList";
import NetworkOverviewGroupedList from "./NetworkOverviewGroupedList";


export default function NetworkOverviewContainer({ items }: { items: NetworkOverviewItem[] }) {
    const [ groupByPlatform, setGroupByPlatform ] = useState(false);

    const [ loadingItems, setLoadingItems ] = useState<NetworkOverviewItem[]>([]);
    const [ unloadingItems, setUnloadingItems ] = useState<NetworkOverviewItem[]>([]);
    const [ availabilityItems, setAvailabilityItems ] = useState<NetworkOverviewItem[]>([]);

    const [ loadingItemsGrouped, setLoadingItemsGrouped ] = useState<NetworkOverviewItem[][]>([]);
    const [ unloadingItemsGrouped, setUnloadingItemsGrouped ] = useState<NetworkOverviewItem[][]>([]);
    const [ availabilityItemsGrouped, setAvailabilityItemsGrouped ] = useState<NetworkOverviewItem[][]>([]);

    useEffect(() => {

        const li = {} as Record<string, NetworkOverviewItem>;
        const ui = {} as Record<string, NetworkOverviewItem>;
        const ai = {} as Record<string, NetworkOverviewItem>;

        items.forEach((item) => {
            if (item.mode === 'loading') {
                if (!li[item.item_id]) {
                    li[item.item_id] = {...item};
                } else {
                    li[item.item_id].rate += item.rate;
                }
            } else if (item.mode === 'unloading') {
                if (!ui[item.item_id]) {
                    ui[item.item_id] = {...item};
                } else {
                    ui[item.item_id].rate += item.rate;
                }
            }

            if (!ai[item.item_id]) {
                ai[item.item_id] = (item.mode === 'loading') ? {...item} : {...item, rate: -item.rate};
            } else {
                ai[item.item_id].rate += (item.mode === 'loading') ? item.rate : -item.rate;
            }
        });
        setLoadingItems(Object.values(li).sort((a,b) => a.rate > b.rate ? -1 : 1));
        setUnloadingItems(Object.values(ui).sort((a,b) => a.rate > b.rate ? -1 : 1));
        setAvailabilityItems(Object.values(ai).sort((a,b) => a.rate > b.rate ? -1 : 1));

    },[items]);

    useEffect(() => {
        if (groupByPlatform) {

            const res = items.reduce((acc, item) => {
                const pos = item.position;
                if (item.mode === 'loading') {
                    if (!acc.loading[pos]) {
                        acc.loading[pos] = {} as Record<string, NetworkOverviewItem>;
                    }

                    if (acc.loading[pos][item.item_id]) {
                        acc.loading[pos][item.item_id].rate += item.rate;
                    } else {
                        acc.loading[pos][item.item_id] = {...item};
                    }
                } else if (item.mode === 'unloading') {
                    if (!acc.unloading[pos]) {
                        acc.unloading[pos] = {} as Record<string, NetworkOverviewItem>;
                    }

                    if (acc.unloading[pos][item.item_id]) {
                        acc.unloading[pos][item.item_id].rate += item.rate;
                    } else {
                        acc.unloading[pos][item.item_id] = {...item};
                    }
                }

                if (!acc.availability[pos]) {
                    acc.availability[pos] = {};
                }

                if (!acc.availability[pos][item.item_id]) {
                    acc.availability[pos][item.item_id] = {...item, rate: item.mode === 'loading' ? item.rate : -item.rate};
                } else {
                    if (item.mode === 'loading') {
                        acc.availability[pos][item.item_id].rate += item.rate;
                    } else {
                        acc.availability[pos][item.item_id].rate -= item.rate;
                    }
                }
                

                return acc;
            }, {
                'loading': {} as Record<number, Record<string, NetworkOverviewItem>>, 
                'unloading': {} as Record<number, Record<string, NetworkOverviewItem>>, 
                'availability': {} as Record<number, Record<string, NetworkOverviewItem>>
            });

            console.log('groupedby res:', res);

            setLoadingItemsGrouped(Object.values(res.loading).map((items) => Object.values(items)));
            setUnloadingItemsGrouped(Object.values(res.unloading).map((items) => Object.values(items)));
            setAvailabilityItemsGrouped(Object.values(res.availability).map((items) => Object.values(items)));
        }
    },[groupByPlatform, items])
    
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <Checkbox checked={groupByPlatform} onChange={(e) => setGroupByPlatform(e.checked ?? false)} inputId="groupByPlatform" />
                <label htmlFor="groupByPlatform">Group by platform</label>
            </div>
           
            <TabView pt={{
                panelContainer: {
                className: 'p-1'
                },
                
            }}>
                <TabPanel header="Loading" pt={{
                headerAction: {
                    className: 'p-2'
                }
                }}>
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={loadingItems} />}
                    {groupByPlatform && <NetworkOverviewGroupedList items={loadingItemsGrouped} />}
                </TabPanel>
                <TabPanel header="Unloading" pt={{
                headerAction: {
                    className: 'p-2'
                }
                }}>
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={unloadingItems} />}
                    {groupByPlatform && <NetworkOverviewGroupedList items={unloadingItemsGrouped} />}
                </TabPanel>          
                <TabPanel header="Availability" pt={{
                headerAction: {
                    className: 'p-2'
                }
                }}>
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={availabilityItems} />}
                    {groupByPlatform && <NetworkOverviewGroupedList items={availabilityItemsGrouped} />}
                </TabPanel>              
            </TabView>
            
        </div>
    )
}