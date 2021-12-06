import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ResDTO} from './dto/ResDTO';
import {UserModel} from '../modules/auth/_models/user.model';
import {environment as env} from '../../environments/environment';
import {SelectBoxDTO} from './dto/SelectBoxDTO';
import {AREA_LIST, CacheService, DISTRICT_LIST, PROVINCE_LIST, REGION_LIST} from './utils/cache.service';
import {SUCCESS_CODE} from './constants/input.constants';
import {RegionDTO} from './dto/RegionDTO';
import {UnitDTO} from './dto/UnitDTO';
import {TaskDTO} from './dto/TaskDTO';
import {TargetGroup} from "./models/target-group";

@Injectable({providedIn: 'root'})
export class ShareService {
    public resourceUserUrl = env.URL_API + 'api/admin/users';
    public resourceApiUrl = env.URL_API + 'api';
    public resourceTaskUrl = env.URL_API + 'api/tasks';
    public resourceProjectUrl = env.URL_API + 'api/projects';

    priority = [
        {
            priority: 'NORMAL',
            desc: 'NORMAL'
        },
        {
            priority: 'HIGH',
            desc: 'HIGH'
        }
    ];

    constructor(protected http: HttpClient,
                private cacheService: CacheService) {
    }

    getAllUsers(): Observable<UserModel[]> {
        return this.http.get<ResDTO<UserModel[]>>(`${this.resourceUserUrl}/get-all`)
            .pipe(map((res: ResDTO<UserModel[]>) => {
                if (res.code === SUCCESS_CODE && res.data) {
                    return res.data;
                }
                return [];
            }));
    }

    getTarget(): Observable<ResDTO<SelectBoxDTO[]>> {
        return this.http
            .get(`${this.resourceApiUrl}/targets/get-select-box`, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<SelectBoxDTO[]>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    getProject(): Observable<ResDTO<SelectBoxDTO[]>> {
        return this.http
            .get(`${this.resourceApiUrl}/projects/get-select-box`, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<SelectBoxDTO[]>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    getRegions(force?: boolean): Observable<RegionDTO[]> {
        const regions: RegionDTO[] = this.cacheService.get('REGION_LIST');
        if (!force && regions && regions.length > 0) {
            return of(regions);
        }
        return this.http.get<ResDTO<RegionDTO[]>>(`${this.resourceApiUrl}/regions/get-all`).pipe(
            map((res: ResDTO<RegionDTO[]>) => {
                if (res.code === SUCCESS_CODE && res.data && res.data.length > 0) {
                    this.cacheService.putSession(REGION_LIST, res.data);
                    this.cacheService.putSession(AREA_LIST,
                        res.data.filter(d => d.regionCode === undefined || d.regionCode === null));
                    this.cacheService.putSession(PROVINCE_LIST,
                        res.data.filter(d => d.regionCode && (d.provinceCode === undefined || d.provinceCode === null)));
                    this.cacheService.putSession(DISTRICT_LIST,
                        res.data.filter(d => d.regionCode && d.provinceCode));
                    return res.data;
                } else {
                    return [];
                }
            })
        );
    }

    getAreas(force?: boolean): Observable<RegionDTO[]> {
        const areas: RegionDTO[] = this.cacheService.get(AREA_LIST);
        if (!force && areas && areas.length > 0) {
            return of(areas);
        }
        return this.http.get<ResDTO<RegionDTO[]>>(`${this.resourceApiUrl}/regions/get-all-area`).pipe(
            map((res: ResDTO<RegionDTO[]>) => {
                if (res.code === SUCCESS_CODE && res.data && res.data.length > 0) {
                    this.cacheService.put(AREA_LIST, res.data);
                    return res.data;
                } else {
                    return [];
                }
            })
        );
    }

    getProvinces(force?: boolean): Observable<RegionDTO[]> {
        const provinces: RegionDTO[] = this.cacheService.get(PROVINCE_LIST);
        if (!force && provinces && provinces.length > 0) {
            return of(provinces);
        }
        return this.http.get<ResDTO<RegionDTO[]>>(`${this.resourceApiUrl}/regions/get-all-province`).pipe(
            map((res: ResDTO<RegionDTO[]>) => {
                if (res.code === SUCCESS_CODE && res.data && res.data.length > 0) {
                    this.cacheService.put(PROVINCE_LIST, res.data);
                    return res.data;
                } else {
                    return [];
                }
            })
        );
    }

    getDistricts(force?: boolean): Observable<RegionDTO[]> {
        const districts: RegionDTO[] = this.cacheService.get(DISTRICT_LIST);
        if (!force && districts && districts.length > 0) {
            return of(districts);
        }
        return this.http.get<ResDTO<RegionDTO[]>>(`${this.resourceApiUrl}/regions/get-all-district`).pipe(
            map((res: ResDTO<RegionDTO[]>) => {
                if (res.code === SUCCESS_CODE && res.data && res.data.length > 0) {
                    this.cacheService.put(DISTRICT_LIST, res.data);
                    return res.data;
                } else {
                    return [];
                }
            })
        );
    }

    getUnits(): Observable<UnitDTO[]> {
        const units: UnitDTO[] = this.cacheService.get('UNIT_LIST');
        if (units && units.length > 0) {
            return of(units);
        }
        return this.http.get<ResDTO<UnitDTO[]>>(`${this.resourceApiUrl}/units/get-all`).pipe(
            map((res: ResDTO<UnitDTO[]>) => {
                if (res.code === SUCCESS_CODE && res.data && res.data.length > 0) {
                    this.cacheService.put('UNIT_LIST', res.data);
                    return res.data;
                } else {
                    return [];
                }
            })
        );
    }

    unitByProjectCode(code: string): Observable<UnitDTO[]> {
        return this.http.get(`${this.resourceApiUrl}/units/get-by-project-code/` + code)
            .pipe(map((res: ResDTO<UnitDTO[]>) => {
                if (res.code === SUCCESS_CODE && res.data) {
                    return res.data;
                }
                return [];
            }));
    }

    getTargetGroup(projectId: number): Observable<ResDTO<SelectBoxDTO[]>> {
        let url = `${this.resourceApiUrl}/target-groups/get-select-box`;
        if (projectId != null) {
            url = url + `?projectId=` + projectId;
        }
        return this.http
            .get(url, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<SelectBoxDTO[]>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    getTasks(): Observable<TaskDTO[]> {
        return this.http
            .get<ResDTO<TaskDTO[]>>(`${this.resourceTaskUrl}/get-all`).pipe(
                map((res: ResDTO<TaskDTO[]>) => {
                    if (res.code === SUCCESS_CODE && res.data && res.data.length > 0) {
                        this.cacheService.put('UNIT_LIST', res.data);
                        return res.data;
                    } else {
                        return [];
                    }
                })
            );
    }

    getAllProjectCode(): Observable<string[]> {
        let key = 'project-codes';
        let cache = this.cacheService.get<string[]>(key);
        if (cache) {
            return of(cache);
        }

        return this.http.get(`${this.resourceProjectUrl}/get-all-code`)
            .pipe(map((res: ResDTO<any>) => {
                if (res.code === SUCCESS_CODE && res.data) {
                    this.cacheService.put(key, res.data);
                    return res.data;
                }
                return null;
            }));
    }

    uploadFile(formData: any): Promise<ResDTO<string>> {
        return this.http.post<ResDTO<string>>(`${env.URL_API}api/pm/upload-file`, formData).toPromise();
    }

    deleteFile(path: any): Promise<ResDTO<string>> {
        return this.http.delete<ResDTO<string>>(`${env.URL_API}api/pm/delete/${path}`).toPromise();
    }
}
