'use client';
import React, { Dispatch, forwardRef, useEffect, useState } from 'react';
import {
  DataGrid,
  GridRowId,
  GridValidRowModel,
  DataGridProps,
  GridColDef,
  gridClasses,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridToolbarContainer,
  QuickFilter,
  QuickFilterTrigger,
  QuickFilterControl,
  QuickFilterClear
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { darken } from '@mui/material/styles';
import { motion } from 'motion/react';
import { Box, Grid, Typography } from '@mui/material';
import { HocKyLopHocPhan, IOption, yearOptions } from '@/types/options';
import { ToolbarButton } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import { usePopoverLock } from '@/hooks/context/PopoverLock';
import InputSelect2 from '@/components/selects/InputSelect2';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { useUser } from '@/stores/selectors';
import useCheckPermission from '@/helper/useCheckPermission';
import { Add } from '@mui/icons-material';
import { CalendarFold } from 'lucide-react';
import { useForm } from 'react-hook-form';
function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        '!h-[37px] w-full rounded border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-200 px-2.5 text-base text-wwhite dark:text-black focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600',
        props.className
      )}
    />
  );
}
const CustomToolbar = ({
  contentPopover,
  isOpen,
  onClose,
  handleClick
}: {
  contentPopover?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { isLocked, toggleLock } = usePopoverLock();

  return (
    <>
      <GridToolbarContainer
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: theme.palette.background.paper,
          borderBottom: '1px solid #e0e0e0'
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100% !important',
            gap: '16px'
          }}
        >
          <QuickFilter
            render={(props, state) => (
              <div {...props} className='flex overflow-clip justify-start items-center'>
                <QuickFilterTrigger
                  className={state.expanded ? 'rounded-r-none border-r-0' : ''}
                  render={
                    <ToolbarButton
                      render={
                        <Button
                          aria-label='Search'
                          className='!px-4 !py-[18px] !border !border-neutral-200 !rounded-r-none'
                        >
                          <SearchIcon fontSize='small' className='!h-6 !w-6' />
                        </Button>
                      }
                    />
                  }
                />
                <div
                  className={clsx(
                    'flex overflow-clip transition-all duration-300 ease-in-out items-center justify-center',
                    state.expanded ? 'w-100' : 'w-0'
                  )}
                >
                  <QuickFilterControl
                    aria-label='Search'
                    placeholder='Search'
                    render={({ slotProps, size, ...controlProps }) => (
                      <TextInput
                        {...controlProps}
                        {...slotProps?.htmlInput}
                        placeholder={'Tìm kiếm'}
                        className={clsx(
                          'flex-1 rounded-l-none !bg-white ',
                          state.expanded && state.value !== '' && 'rounded-r-none'
                        )}
                      />
                    )}
                  />
                  {state.expanded && state.value !== '' && (
                    <QuickFilterClear
                      render={
                        <Button
                          aria-label='Clear'
                          className='!px-2 !py-[18px] !border !border-neutral-200 !rounded-l-none !ml-0 group'
                        >
                          <CancelIcon fontSize='small' className='!h-6 !w-6 group-hover:text-red-500' />
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
            )}
          />
          {contentPopover ? (
            <Box className='relative'>
              <Button className='!p-0 flex gap-2 !border !border-neutral-200 !px-3 !rounded-none' onClick={handleClick}>
                <FilterListIcon />
                <Typography className='!text-[16px] !leading-6 !font-semibold'>Lọc</Typography>
              </Button>
              {isOpen && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '300px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '16px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    backgroundColor: 'background.paper',
                    zIndex: 10
                  }}
                  className='flex flex-col gap-3 justify-center items-center'
                >
                  {contentPopover}
                  <Box className='w-full flex justify-end'>
                    <Button size='small' onClick={onClose}>
                      Tắt
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          ) : null}
        </Box>
      </GridToolbarContainer>
    </>
  );
};
const noRowsOverlay = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80%',
      width: '100%',
      color: '#888',
      background: '#f9fafb',
      mt: 2
    }}
  >
    <img
      src='https://cdn-icons-png.flaticon.com/512/4076/4076549.png'
      alt='No data'
      width={64}
      height={64}
      style={{ marginBottom: 16, opacity: 0.7 }}
    />
    <Typography variant='h6' sx={{ fontWeight: 500 }}>
      Không có dữ liệu
    </Typography>
    <Typography variant='body2' sx={{ color: '#aaa', mt: 1 }}>
      Không tìm thấy bản ghi nào phù hợp.
    </Typography>
  </Box>
);
interface ImportFileProps {
  LopHocPhanId: string;
  File: File | null;
}
interface ITableEditProps {
  isLoadingMutationCopy?: boolean;
  row: any[];
  columns: GridColDef[];
  apiRef?: any;
  isSaving?: boolean;
  isLoading?: boolean;
  setFilterModel?: (data: any) => void;
  setSortModel?: ({ field, sort }: { field: string; sort: string | null | undefined }) => void;
  handleSave?: (item: any) => void;
  setfilter: Dispatch<
    React.SetStateAction<{
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
    } | null>
  >;
  tuanDens?: any;
  isLoadingTuanDen?: boolean;
  setfilterWeek: Dispatch<
    React.SetStateAction<{
      tuanVao: string;
      tuanDen: string;
    } | null>
  >;
  tuans?: any;
  isLoadingTuan?: boolean;
  lophocs?: any;
  isLoadingLH?: boolean;
  contentPopover?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  handleNopDiem?: () => void;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  filter?: {
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
  } | null;
  queryKey: string;
  giangVien?: any;
  isLoadingGV?: boolean;
  filterWeek: {
    tuanVao: string;
    tuanDen: string;
  } | null;
  handleCopy?: () => void;
  handleOpenModal?: () => void;
}

interface IFormData {
  NamHoc: IOption | null;
  Tuan: IOption | null;
  HocKy: IOption | null;
  LopHoc: IOption | null;
}

const TableEdit = forwardRef(
  function TableEdit(
    {
      isLoadingMutationCopy,
      columns,
      row,
      isLoading,
      setFilterModel,
      setSortModel,
      isSaving,
      apiRef,
      handleSave,
      setfilter,
      contentPopover,
      isOpen,
      handleClick,
      onClose,
      setfilterWeek,
      lophocs,
      isLoadingLH,
      filter,
      queryKey,
      handleCopy,
      giangVien,
      isLoadingGV,
      handleNopDiem,
      isLoadingTuan,
      tuans,
      isLoadingTuanDen,
      tuanDens,
      handleOpenModal,
      filterWeek
    }: ITableEditProps,
    ref
  ){
    const [file, setFile] = useState<File | null>(null);
    const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
    const notification = useNotifications();
    const user = useUser();
    const { isAdmin, isQuanLyKhoaBoMon, isGiangVien } = useCheckPermission();
    const unsavedChangesRef = React.useRef<{
      unsavedRows: Record<GridRowId, GridValidRowModel>;
      rowsBeforeChange: Record<GridRowId, GridValidRowModel>;
    }>({
      unsavedRows: {},
      rowsBeforeChange: {}
    });
    const processRowUpdate = React.useCallback<NonNullable<DataGridProps['processRowUpdate']>>((newRow, oldRow) => {
      const rowId = newRow.id;
      unsavedChangesRef.current.unsavedRows[rowId] = newRow;
      if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
        unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
      }

      return newRow;
    }, []);
    const queryClient = useQueryClient();
    const handleCellClick = React.useCallback((params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }
      if ((event.target as any).nodeType === 1 && !event.currentTarget.contains(event.target as Element)) {
        return;
      }
      setCellModesModel((prevModel: any) => {
        return {
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View }
                }),
                {}
              )
            }),
            {}
          ),
          [params.id]: {
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit }
          }
        };
      });
    }, []);
    const handleCellModesModelChange = React.useCallback((newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    }, []);

    useEffect(() => {
      if (user) {
        setfilter((prev: any) => ({
          ...prev,
          boMon: {
            id: user?.boMon?.id,
            name: user?.boMon?.tenBoMon
          },
          giangVien: {
            id: user?.id,
            name: user?.hoTen
          }
        }));
      }
    }, [user]);
    const { setValue, control } = useForm<IFormData>({
      mode: 'onChange'
    });
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
        className='flex flex-col gap-4'
        style={{
          height: 'calc(100vh - 200px)',
          minHeight: '600px', // ✅ Add minimum height
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box className='flex w-full gap-4 '>
          <Box className='flex-1 gap-4 flex justify-center items-center p-4 border border-gray-200 rounded-lg shadow-sm light:bg-white'>
            <Box className='flex flex-col gap-4 w-full'>
              <Box className='flex gap-4 w-full'>
                <Grid container className='flex justify-center items-center gap-3 w-full'>
                  <Grid size={3}>
                    <Typography className='!text-[16px] !leading-6 !font-semibold'>Năm học</Typography>
                  </Grid>
                  <Grid size={9} className='flex-1'>
                    <InputSelect2
                      fullWidth
                      name={'NamHoc'}
                      control={control}
                      placeholder={'Chọn năm học'}
                      data={yearOptions ?? []}
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option: any) => option.name}
                      getOnChangeValue={(value) => {
                        setfilter((prev: any) => ({
                          ...prev,
                          namHoc: {
                            id: value?.id,
                            name: value?.name
                          }
                        }));
                        setfilter((prev: any) => ({
                          ...prev,
                          tuan: null
                        }));
                        setValue('Tuan', null);
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container className='flex justify-center items-center gap-3 w-full'>
                  <Grid size={3}>
                    <Typography className='!text-[16px] !leading-6 !font-semibold'>Tuần</Typography>
                  </Grid>
                  <Grid size={9}>
                    <InputSelect2
                      fullWidth
                      name={'Tuan'}
                      control={control}
                      placeholder={'Chọn tuần'}
                      data={tuans ?? []}
                      isLoading={isLoadingTuan}
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option: any) => option.name}
                      getOnChangeValue={(value) => {
                        setfilter((prev: any) => ({
                          ...prev,
                          tuan: {
                            id: value?.id,
                            name: value?.name
                          }
                        }));
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className='flex gap-4 w-full'>
                <Grid container className='flex justify-start items-center gap-3 w-full'>
                  <Grid size={3}>
                    <Typography className='!text-[16px] !leading-6 !font-semibold'>Học kỳ</Typography>
                  </Grid>
                  <Grid size={9} className='flex-1'>
                    <InputSelect2
                      fullWidth
                      control={control}
                      name={'HocKy'}
                      placeholder={'Chọn học kỳ'}
                      data={HocKyLopHocPhan ?? []}
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option: any) => option.name}
                      getOnChangeValue={(value) => {
                        setfilter((prev: any) => ({
                          ...prev,
                          hocKy: value?.id
                        }));
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container className='flex justify-center items-center gap-3 w-full'>
                  <Grid size={3}>
                    <Typography className='!text-[16px] !leading-6 !font-semibold'>Lớp học</Typography>
                  </Grid>
                  <Grid size={9}>
                    <InputSelect2
                      fullWidth
                      name={'LopHoc'}
                      control={control}
                      placeholder={'Chọn lớp học'}
                      data={lophocs ?? []}
                      isLoading={isLoadingLH}
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option: any) => option.name}
                      getOnChangeValue={(value) => {
                        setfilter((prev: any) => ({
                          ...prev,
                          lopHoc: {
                            id: value?.id,
                            name: value?.name
                          }
                        }));
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            {
              isAdmin && (<Box className='flex flex-col gap-4 items-center h-full justify-start py-3'>
              <LoadingButton
                disabled={false}
                loading={false}
                startIcon={<Add />}
                loadingPosition='start'
                onClick={() => handleOpenModal?.()}
                className='!bg-blue-500 !text-white !rounded-md !px-4 !py-2 hover:!bg-blue-600 transition-all !duration-200 !ease-in-out !shadow-sm !text-base !leading-6 hover:transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Typography className='!text-[16px] !leading-6 !font-semibold'>Thêm</Typography>
              </LoadingButton>
            </Box>)
            }
          </Box>

          <Box className='flex flex-col !max-w-[300px] w-full gap-4 p-4 border border-gray-200 rounded-lg shadow-sm light:bg-white justify-center items-center'>
            <Box className='flex w-full items-center justify-start gap-2'>
              <CalendarFold className='h-4 w-4 shadow' />
              <Typography className='!font-semibold '>Sao chép lịch</Typography>
            </Box>
            <Box className='flex flex-[3] items-center justify-start w-full gap-3'>
              <Box className='flex flex-col gap-2 flex-2 w-full'>
                <Grid container className='flex justify-center items-center gap-3 w-full'>
                  <Grid size={3}>
                    <Typography className='!text-[16px] !leading-6 !font-semibold'>Từ</Typography>
                  </Grid>
                  <Grid size={9} className='flex-1'>
                    <InputSelect2
                      fullWidth
                      name={'TuanVao'}
                      placeholder={'Chọn tuần vào'}
                      data={tuans ?? []}
                      isLoading={isLoadingTuan}
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option: any) => option.name}
                      getOnChangeValue={(value) => {
                        setfilterWeek((prev: any) => ({
                          ...prev,
                          tuanVao: value?.id
                        }));
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container className='flex justify-center items-center gap-3 w-full'>
                  <Grid size={3}>
                    <Typography className='!text-[16px] !leading-6 !font-semibold'>Đến</Typography>
                  </Grid>
                  <Grid size={9} className='flex-1'>
                    <InputSelect2
                      fullWidth
                      name={'TuanDen'}
                      placeholder={'Chọn tuần đến'}
                      data={tuanDens ?? []}
                      isLoading={isLoadingTuanDen}
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option: any) => option.name}
                      getOnChangeValue={(value) => {
                        setfilterWeek((prev: any) => ({
                          ...prev,
                          tuanDen: value?.id
                        }));
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className='flex-1 w-full min-md:flex'>
                <LoadingButton
                  loading={isLoadingMutationCopy}
                  onClick={() => handleCopy?.()}
                  className='!border !border-gray-300 !rounded-md !bg-blue-500 !text-white hover:!bg-blue-600 transition-all !duration-200 !ease-in-out !shadow-sm !leading-6 hover:transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Sao chép
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1, // ✅ Take remaining space
            minHeight: '400px', // ✅ Minimum height for DataGrid
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <DataGrid
            apiRef={apiRef}
            rows={row}
            columns={columns}
            hideFooterPagination
            hideFooterSelectedRowCount
            cellModesModel={cellModesModel}
            onCellClick={handleCellClick}
            onCellModesModelChange={handleCellModesModelChange}
            processRowUpdate={processRowUpdate}
            ignoreValueFormatterDuringExport
            filterDebounceMs={600}
            editMode='cell'
            virtualizeColumnsWithAutoRowHeight
            onFilterModelChange={setFilterModel}
            slots={{
              toolbar: () => CustomToolbar({ contentPopover, isOpen, onClose, handleClick }),
              noRowsOverlay: noRowsOverlay
            }}
            onSortModelChange={(model) => {
              if (model.length > 0) {
                return (
                  setSortModel &&
                  setSortModel({
                    field: model[0].field,
                    sort: model[0].sort || 'asc'
                  })
                );
              }
            }}
            getRowHeight={() => 'auto'}
            sortingMode='server'
            filterMode='server'
            showCellVerticalBorder
            showToolbar
            disableColumnResize
            autoHeight={false}
            disableColumnMenu
            hideFooter
            density='compact'
            slotProps={{
              loadingOverlay: {
                variant: 'linear-progress',
                noRowsVariant: 'linear-progress'
              }
            }}
            className='!border-gray-200 shadow-sm'
            sx={(theme) => ({
              height: '100%',
              flex: 1,
              minHeight: '400px',
              overflowY: 'auto',
              '& .MuiDataGrid-editInputCell': {
                margin: 0
              },
              '& .MuiDataGrid-cell.actions-cell': {
                backgroundColor: '#fafafa',
                '&:focus, &:focus-within': {
                  outline: 'none !important',
                  border: 'none !important',
                  backgroundColor: '#fafafa !important'
                },
                '&.Mui-selected': {
                  backgroundColor: '#fafafa !important',
                  border: 'none !important'
                }
              },
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.5',
                padding: '10px 8px',
                display: '-webkit-box', // Sử dụng flexbox webkit
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3, // Giới hạn tối đa 3 dòng
                overflow: 'hidden',
                alignItems: 'flex-start',
                '@media (min-width: 728px)': { fontSize: '14px' }
              },
              [`& .${gridClasses.columnHeaders}`]: {
                borderBottom: `1px solid ${theme.palette.grey[600]}`
              },
              [`& .${gridClasses.columnSeparator}`]: {
                borderColor: '#1976d2 !important'
              },
              [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
                outline: 'none !important',
                boxShadow: 'none !important'
              },
              [`& .${gridClasses.main}`]: {
                paddingY: '10px'
              },
              [`& .${gridClasses.cell}.Mui-selected, & .${gridClasses.cell}:focus, & .${gridClasses.cell}.MuiDataGrid-cell--editing`]:
                {
                  border: '2px solid #1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)', // xanh nhạt
                  zIndex: 1
                },
              [`& .${gridClasses.cell}.MuiDataGrid-cell--editing .MuiInputBase-root, 
                & .${gridClasses.cell}.MuiDataGrid-cell--editing select`]: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              },
              '& .MuiOutlinedInput-root': {
                margin: 0
              },
              [`& .${gridClasses.row}.row--removed`]: {
                backgroundColor: (theme) => {
                  if (theme.palette.mode === 'light') {
                    return 'rgba(255, 170, 170, 0.3)';
                  }
                  return darken('rgba(255, 170, 170, 1)', 0.7);
                }
              },
              [`& .${gridClasses.row}.row--edited`]: {
                backgroundColor: (theme) => {
                  if (theme.palette.mode === 'light') {
                    return 'rgba(255, 254, 176, 0.3)';
                  }
                  return darken('rgba(255, 254, 176, 1)', 0.6);
                }
              }
            })}
            loading={isSaving || isLoading}
          />
        </Box>
      </motion.div>
    );
  }
);

export default TableEdit;
