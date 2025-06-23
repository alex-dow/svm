import { ObjectProperty, TextProperty } from "@etothepii/satisfactory-file-parser";
import { SaveItem } from "./pathTypes";


export function getNextPlatforms(connectionId: string, platformConnections: SaveItem[], platforms: SaveItem[]): SaveItem[] {
    const stationPlatforms: SaveItem[] = [];

    for (let i = 0; i < platformConnections.length; i++) {
        if (platformConnections[i].instanceName === connectionId) {
            const mConnectedTo = platformConnections[i].properties['mConnectedTo'] as ObjectProperty
            if (mConnectedTo) {

                const pathName = mConnectedTo.value.pathName;

                const platformId = pathName.replace('.PlatformConnection0','').replace('.PlatformConnection1','');
                const platform = platforms.find((e) => e.instanceName === platformId);
                if (platform) {
                    stationPlatforms.push(platform);

                    let nextConnection: string;
                    if (pathName.endsWith('.PlatformConnection0')) {
                        nextConnection = pathName.replace('.PlatformConnection0','.PlatformConnection1');
                    } else if (pathName.endsWith('.PlatformConnection1')) {
                        nextConnection = pathName.replace('.PlatformConnection1','.PlatformConnection0');
                    } else {
                        console.warn('strange connection?', pathName);
                        break;
                    }
                    stationPlatforms.push(...getNextPlatforms(nextConnection, platformConnections, platforms));
                }
                break;
            }
        }
    }

    /*
    if (stationPlatforms.length > 0) {
        const connectedTo = stationPlatforms[stationPlatforms.length-1];
        let nextConnection: string;
        if (connectionId.endsWith('.PlatformConnection0')) {
            nextConnection = connectedTo.instanceName.replace('.PlatformConnection0','.PlatformConnection1');
        } else if (connectionId.endsWith('.PlatformConnection1')) {
            nextConnection = connectionId.replace('.PlatformConnection1','.PlatformConnection0');
        } else {
            console.warn('strange connection?', connectionId);
            return stationPlatforms;
        }

        stationPlatforms.push(...getNextPlatforms(nextConnection, platformConnections, platforms));
    }
        */

    return stationPlatforms;
    
}


/**
 * Get the entire chain of platform connections for a given connectionId.
 * 
 * @param connectionId 
 * @param platforms 
 * @returns 
 */
export function getStationPlatforms(station: SaveItem, platformConnections: SaveItem[], platforms: SaveItem[]): SaveItem[] {
    const mStation = station.properties['mStation'] as ObjectProperty;
    const stationInstanceName = mStation.value.pathName;
    const connectionId = stationInstanceName + '.PlatformConnection0';

    return getNextPlatforms(connectionId, platformConnections, platforms);
}

export function getStationName(station: SaveItem): string {
    const mStationName = station.properties['mStationName'] as TextProperty;
    return mStationName.value.value || '';
}
