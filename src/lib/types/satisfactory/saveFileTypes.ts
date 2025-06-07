/**
 * Additional types not defined in @etothepii/satisfactory-file-parser
 */
import { BoolProperty, EnumProperty, FloatProperty, ObjectArrayProperty, ObjectProperty, StructProperty } from "@etothepii/satisfactory-file-parser";

export interface TimeTableStop {
    properties: {
        Station: ObjectProperty,
        DockingRuleSet: StructProperty,
        
    },
    type: string
}

export interface TrainDockingRuleSet {
    properties: {
        DockingDefinition: EnumProperty,
        DockForDuration: FloatProperty,
        IsDurationAndRule: BoolProperty,
        IgnoreFullLoadUnloadIfTransferBlockedByFilters: BoolProperty,
        LoadFilterDescriptors: ObjectArrayProperty,
        UnloadFilterDescriptors: ObjectArrayProperty,
    }
}