'use client';
import { handleTextSearch } from '@/lib/string';
import {
  IParamLichBieu,
  IParamTuan
} from '@/types/params';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import { GridActionsCellItem, GridColDef, GridFilterModel, useGridApiRef } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import dynamic from 'next/dynamic';
import { LoaiMonHocEnum } from '@/models/MonHoc';
import moment from 'moment';
import { useNotifications } from '@toolpad/core';
import { useUser } from '@/stores/selectors';
import { LichBieuService } from '@/services/LichBieuService';
import { TuanService } from '@/services/TuanService';
import ModalAdd from './ModalAdd';
import { LopHocService } from '@/services/LopHocService';
import { Edit, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import ModalEdit from './ModalEdit';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
const TableEdit = dynamic(() => import('./TableEdit'), {
  ssr: false
});

interface IContentProps {
  queryKey: string;
  lopHocServer?: any[];
  boMonServer?: any[];
}

const Content = ({ queryKey, lopHocServer, boMonServer }: IContentProps) => {
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const user = useUser();
  const apiRef = useGridApiRef();
  const { setTitle } = useBreadcrumb();
  const [anchorElConfirmDelete, setAnchorElConfirmDelete] = useState<boolean>(false);
  const [giangVienOptions, setGiangVienOptions] = useState<{ [khoaId: string]: any[] }>({});
  const refModal = useRef<{ reset: () => void }>(null);
  const refModalEdit = useRef<{ reset: (data: any) => void }>(null);
  const [sortModel, setSortModel] = useState<Record<string, string | null | undefined>>({
    field: '',
    sort: ''
  });
  const [filterWeek, setfilterWeek] = useState<{
    tuanVao: string;
    tuanDen: string;
  } | null>(null);
  const [filter, setfilter] = useState<{
    namHoc: {
      id: number | string;
      name: string;
    };
    tuan: {
      id: string;
      name: string;
    };
    giangVien: {
      id: string;
      name: string;
    };
    hocKy: number | string;
    lopHoc: {
      id: string;
      name: string;
    };
  } | null>(null);
  const filterRef = useRef(filter);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const [isOpenPopover, setisOpenPopover] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [itemId, setItemId] = useState<any>(null);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenEdit = (id: string | number | null) => {
    setItemId(id);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleCloseDelete = () => {
    setAnchorElConfirmDelete(false);
  };
  const handleOpenDelete = () => {
    setAnchorElConfirmDelete(true);
  };
  const handleClose = () => {
    setOpen(false);
    if (refModal.current) {
      refModal.current.reset();
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: [
      queryKey,
      filterModel,
      sortModel,
      filter?.lopHoc?.id,
      filter?.tuan?.id,
      filter?.hocKy,
      filter?.namHoc?.id
    ],
    queryFn: async () => {
      if (!filter || !filter?.lopHoc?.id || !filter?.tuan?.id || !filter?.hocKy || !filter?.namHoc?.id) {
        return [];
      }
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamLichBieu = {
        lopHocId: filter?.lopHoc.id,
        tuanId: filter?.tuan?.id,
        hocKy: filter?.hocKy,
        namHoc: filter?.namHoc?.id
      };
      if (sortModel?.field && sortModel?.sort) {
        params = {
          ...params,
          sortBy: sortModel.field,
          sortByOrder: sortModel.sort === 'asc' ? 'asc' : 'desc'
        };
      }
      if (searchKeyWord) {
        params = {
          ...params,
          search: searchKeyWord
        };
      }
      const result = await LichBieuService.getLichBieuByKhoa(params);
      console.log('result', result);
      return result;
    },
    enabled: !!filter?.tuan && !!filter?.lopHoc?.id && !!filter?.hocKy && !!filter?.namHoc,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0
  });
  const { data: lopHocs, isLoading: isLoadingLH } = useQuery({
    queryKey: ['lop-hoc-list'],
    queryFn: async () => {
      const result = await LopHocService.getLopHocNoPage();
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.maLopHoc
      }));
    },
    initialData: lopHocServer,
    refetchOnWindowFocus: false
  });

  const { data: tuans, isLoading: isLoadingTuan } = useQuery({
    queryKey: ['tuan-list', filter?.namHoc],
    queryFn: async () => {
      const params: IParamTuan = {
        namHoc: filter?.namHoc?.id
      };
      const result = await TuanService.getAllTuanByNamHoc(params);
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: `${item.soTuan}`
      }));
    },
    refetchOnWindowFocus: false,
    enabled: !!filter?.namHoc
  });
  const { data: tuanDens, isLoading: isLoadingTuanDen } = useQuery({
    queryKey: ['tuan-den-list', filterWeek?.tuanVao],
    queryFn: async () => {
      const params: IParamTuan = {
        namHoc: filter?.namHoc?.id,
        TuanBatDauId: filterWeek?.tuanVao
      };
      const result = await TuanService.getAllTuanDenByTuanVao(params);
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: `${item.soTuan}`
      }));
    },
    refetchOnWindowFocus: false,
    enabled: !!user && !!filterWeek?.tuanVao && !!filter?.namHoc && !!filter?.giangVien?.id
  });
  const mutationCopy = useMutation({
    mutationFn: async (data: any) => {
      const response = await LichBieuService.copyLichBieu(data);
      return response;
    },
    onSuccess: (data) => {
      notification.show('Sao chép lịch thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: false
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || `Lỗi khi sao chép lịch`, {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);
  useEffect(() => {
    setTitle('Lịch lớp học');
    return () => setTitle('');
  }, []);
  const mutationDelete = useMutation({
    mutationFn: async (id: string | number | null) => {
      const result = await LichBieuService.deleteLichBieu(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá lịch thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá lịch thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };
  const columns = useMemo((): GridColDef[] => {
    const formatDateBirth = (date: string) => {
      return moment(date).format('DD/MM/YYYY');
    };
    const handleFormatType = (type: number | null) => {
      switch (type) {
        case LoaiMonHocEnum.LY_THUYET:
          return 'LT';
        case LoaiMonHocEnum.THUC_HANH:
          return 'TH';
        case LoaiMonHocEnum.MODUN:
          return 'MD';
        case LoaiMonHocEnum.THUC_TAP_TOT_NGHIEP:
          return 'TTTN';
        case LoaiMonHocEnum.KIEN_TAP:
          return 'KT';
        case LoaiMonHocEnum.DO_AN_TOT_NGHIEP:
          return 'DATN';
        case LoaiMonHocEnum.KHOA_LUAN_TOT_NGHIEP:
          return 'KL';
        case LoaiMonHocEnum.THI_TOT_NGHIEP_LY_THUYET:
          return 'TTN-LT';
        case LoaiMonHocEnum.THI_TOT_NGHIEP_THUC_HANH:
          return 'TTN-TH';
        case LoaiMonHocEnum.CHUC_CHUNG_CHI:
          return 'CCC';
        default:
          return '';
      }
    };
    return [
      {
        field: 'phanCong',
        headerName: 'Phân công',
        type: 'string',
        headerAlign: 'left',
        minWidth: 250,
        flex: 2,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params.row?.lopHocPhan ? (
            <Typography variant='body2'>{`${params.row?.lopHocPhan?.maHocPhan} - ${params.row?.lopHocPhan?.monHoc?.tenMonHoc}`}</Typography>
          ) : null;
        }
      },
      {
        field: 'loai',
        headerName: 'Loại',
        type: 'string',
        headerAlign: 'left',
        minWidth: 60,
        flex: 0.4,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return handleFormatType(params.row?.lopHocPhan?.monHoc?.chiTietChuongTrinhDaoTao?.loaiMonHoc);
        }
      },
      {
        field: 'SiSo',
        headerName: 'Sĩ số',
        type: 'number',
        headerAlign: 'left',
        minWidth: 60,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.lopHocPhan?.siSo ? (
            <Typography variant='body2'>{params?.row?.lopHocPhan?.siSo}</Typography>
          ) : (
            <Typography variant='body2'>0</Typography>
          );
        }
      },
      {
        field: 'phongHoc',
        headerName: 'Phòng',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params: any) => {
          return params.row?.phongHoc?.tenPhong ? (
            <Typography variant='body2'>{params.row?.phongHoc?.tenPhong}</Typography>
          ) : (
            <Typography variant='body2'></Typography>
          );
        }
      },
      {
        field: 't2',
        headerName: 'Thứ 2',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 2 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't3',
        headerName: 'Thứ 3',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 3 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't4',
        headerName: 'Thứ 4',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 4 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't5',
        headerName: 'Thứ 5',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 5 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't6',
        headerName: 'Thứ 6',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 6 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't7',
        headerName: 'Thứ 7',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 7 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't8',
        headerName: 'Thứ 8',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 8 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        headerAlign: 'center',
        minWidth: 100,
        flex: 1,
        sortable: false,
        display: 'flex',
        align: 'center',
        editable: false,
        filterable: false,
        hideSortIcons: true,
        disableReorder: true,
        cellClassName: 'actions-cell',
        disableColumnMenu: true,
        getActions: ({ id, row }) => {
          return [
            <GridActionsCellItem
              key={id}
              icon={<Edit className='text-blue-500 h-4 w-4' />}
              label='Edit'
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                handleClickOpenEdit(id as string | number);
              }}
              color='inherit'
            />,
            <GridActionsCellItem
              key={`${id}-delete`}
              icon={<Trash2 className='text-red-500 h-4 w-4' />}
              label='Delete'
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                handleOpenDelete();
                setItemId(id);
              }}
              color='inherit'
            />
          ];
        }
      }
    ];
  }, [data?.data, giangVienOptions]);
  // const handleShowFilter = useMemo((): ReactNode => {
  //   return (
  //     <Fragment>
  //       <Select
  //         fullWidth
  //         displayEmpty
  //         value={loaiLopHocPhan ?? ''}
  //         onChange={(e) => {
  //           setloaiLopHocPhan(Number(e.target.value) || null);
  //         }}
  //         renderValue={(selected) => {
  //           if (!selected) return <em>Chọn loại lớp học phần</em>;
  //           const selectedOption = (LoaiLopHocPhan ?? []).find((option) => option.id === Number(selected));
  //           return selectedOption ? selectedOption.name : '';
  //         }}
  //       >
  //         <MenuItem value=''>
  //           <em>Chọn loại lớp học phần</em>
  //         </MenuItem>
  //         {(LoaiLopHocPhan ?? []).map((option) => (
  //           <MenuItem key={option.id} value={option.id}>
  //             {option.name}
  //           </MenuItem>
  //         ))}
  //       </Select>
  //     </Fragment>
  //   );
  // }, [loaiLopHocPhan]);
  const handleCopy = () => {
    if (!user || !filterWeek?.tuanVao || !filterWeek?.tuanDen || !filter?.giangVien?.id || !filter?.namHoc) {
      notification.show('Vui lòng chọn đầy đủ thông tin để sao chép lịch', {
        severity: 'warning',
        autoHideDuration: 6000
      });
      return;
    }
    const finalResult = {
      namHoc: filter?.namHoc?.id,
      vaoTuanId: filterWeek?.tuanVao,
      tuanHienTaiId: filter?.tuan?.id,
      denTuanId: filterWeek?.tuanDen,
      hocKy: filter?.hocKy,
      lopHocId: filter?.lopHoc?.id
    };
    mutationCopy.mutate(finalResult);
  };
  return (
    <Box className='flex flex-col gap-4'>
      <Dialog
        open={anchorElConfirmDelete}
        onClose={handleCloseDelete}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          component={'div'}
          id='alert-dialog-title'
          className={'!px-6 !pt-4 !pb-0 flex items-center justify-start'}
        >
          <Typography variant={'h5'} className={'text-black flex items-center justify-start gap-3'}>
            <DeleteForeverIcon className={'text-red-500 !w-8 !h-8 border border-solid border-red-600 rounded-md'} />
            {'Bạn có chắc chắn muốn xóa?'}
          </Typography>
        </DialogTitle>
        <DialogContent className={'!pt-4 !pb-6'}>
          <DialogContentText id='alert-dialog-description' className={'!text-[16px] text-gray-700'}>
            Hành động này không thể hoàn tác. Mục sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={'!px-6 !pb-4 !pt-0 flex items-center justify-end gap-3'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={
              'bg-gray-600 px-4 py-2 rounded-md border-0 cursor-pointer text-[16px] hover:bg-gray-500 text-white'
            }
            onClick={() => handleCloseDelete()}
          >
            Hủy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={
              'bg-blue-700 px-4 py-2 rounded-md border-0 cursor-pointer text-[16px] hover:bg-blue-600 text-white'
            }
            onClick={() => {
              handleDelete(itemId);
              handleCloseDelete();
              handleClose();
            }}
            autoFocus
          >
            Đồng ý
          </motion.button>
        </DialogActions>
      </Dialog>
      <TableEdit
        queryKey={queryKey}
        apiRef={apiRef}
        lophocs={lopHocs}
        isLoadingLH={isLoadingLH}
        setFilterModel={setFilterModel}
        row={data}
        columns={columns}
        isLoading={isLoading}
        setfilter={setfilter}
        setSortModel={setSortModel}
        filter={filter}
        tuans={tuans}
        tuanDens={tuanDens}
        filterWeek={filterWeek}
        isLoadingTuanDen={isLoadingTuanDen}
        isLoadingTuan={isLoadingTuan}
        setfilterWeek={setfilterWeek}
        handleCopy={handleCopy}
        handleOpenModal={handleClickOpen}
        isLoadingMutationCopy={mutationCopy.isPending}
        // contentPopover={handleShowFilter}
        // isOpen={isOpenPopover}
        // handleClick={handleOpenPopover}
        // onClose={handleClosePopover}
      />
      <ModalAdd open={open} handleClose={handleClose} queryKey={queryKey} filter={filter} ref={refModal} />
      <ModalEdit
        open={openEdit}
        handleClose={handleCloseEdit}
        filter={filter}
        id={itemId}
        queryKey={queryKey}
        ref={refModalEdit}
      />
    </Box>
  );
};

export default memo(Content);
