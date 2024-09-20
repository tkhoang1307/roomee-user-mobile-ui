export interface LocationOptionsModel {
  value: string;
  label: string;
}

export interface WardResponseModel {
  ward_id: string;
  ward_name: string;
}

export interface DistrictResponseModel {
  district_id: string;
  district_name: string;
  ward: WardResponseModel[];
}

export interface ProvinceResponseModel {
  province_id: string;
  province_name: string;
  province_type: string;
  district: DistrictResponseModel[];
}

export interface UnitOptionModel extends LocationOptionsModel {}
