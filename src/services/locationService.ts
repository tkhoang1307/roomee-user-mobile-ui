import {LocationOptionsModel, ProvinceResponseModel} from '@models/location';
import data from '@assets/locations/data.json';

const provinces: ProvinceResponseModel[] = data;

export const getProvinces = async () => {
  const provincesOpts: Array<LocationOptionsModel> = provinces.map(x => {
    return {
      value: x.province_id,
      label: x.province_name,
    };
  });
  return provincesOpts;
};

export const getDistricts = async (provinceId: string) => {
  const index = provinces.findIndex(p => p.province_id === provinceId);
  if (index === -1) return [];

  const districtsOpts: Array<LocationOptionsModel> = provinces[
    index
  ].district.map(x => {
    return {
      value: x.district_id,
      label: x.district_name,
    };
  });
  return districtsOpts;
};

export const getWards = async (districtId: string, provinceId: string) => {
  const indexProvince = provinces.findIndex(p => p.province_id === provinceId);
  if (indexProvince === -1) return [];

  const indexDistrict = provinces[indexProvince].district.findIndex(
    d => d.district_id === districtId,
  );
  if (indexDistrict === -1) return [];

  const wardsOpts: Array<LocationOptionsModel> = provinces[
    indexProvince
  ].district[indexDistrict].ward.map(x => {
    return {
      value: x.ward_id,
      label: x.ward_name,
    };
  });
  return wardsOpts;
};
