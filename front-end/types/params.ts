interface IBaseParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortByOrder?: 'asc' | 'desc';
    search?: string;
}


export interface IParamGiangVien extends IBaseParams {
  active?: boolean;
}

export interface IParamLopHocPhan extends IBaseParams {
    khoa?: number;
    loaiChuongTrinhDaoTao?: number;
    chuongTrinhDaoTaoId?: string;
    hocKy?: number;
}

export interface IParamMonHoc extends IBaseParams {

}

export interface IParamLopHoc extends IBaseParams {
    
}

export interface IParamChuongTrinhDaoTao extends IBaseParams {

}
export interface IParamSinhVien extends IBaseParams {
    LopId?: number;
}

export interface IParamKhoa extends IBaseParams {
    
}

export interface IParamNganh extends IBaseParams {

}
export interface IParamBoMon extends IBaseParams {}

export interface IParamPhongHoc extends IBaseParams {}