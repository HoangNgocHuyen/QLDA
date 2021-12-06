import {RegionDTO} from '../../share/dto/RegionDTO';
import {UnitDTO} from '../../share/dto/UnitDTO';

export function getViewRegion(code: string, regions: RegionDTO[]): string {
    const item = regions.filter(t => {
        return t.code === code;
    });
    if (item && item.length > 0) {
        return item[0].name;
    }
    return code;
}

export function getViewUnit(unitCode: string, units: UnitDTO[]): string {
    const item = units.filter(t => {
        return t.unitCode === unitCode;
    });
    if (item && item.length > 0) {
        return item[0].unitName;
    }
    return unitCode;
}

export function filterRegion(provinceCode: string, regionCode, regions: RegionDTO[]): any[] {
    let data = regions;
    if (regionCode) {
        data = data.filter(t => {
            return t.regionCode === regionCode;
        });
    }
    if (provinceCode) {
        data = data.filter(t => {
            return t.provinceCode === provinceCode;
        });
    }
    return data;
}

export function findRegionCode(code: string, regions: RegionDTO[]): string {
    const item = regions.filter(t => {
        return t.code === code;
    });
    if (item && item.length > 0) {
        return item[0].regionCode;
    }
    return null;
}


