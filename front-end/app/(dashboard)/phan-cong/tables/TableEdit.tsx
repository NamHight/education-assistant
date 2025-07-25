'use client';
import React, { Dispatch, forwardRef } from 'react';
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
import SaveIcon from '@mui/icons-material/Save';
import { darken } from '@mui/material/styles';
import { motion } from 'motion/react';
import { Box, Typography } from '@mui/material';
import InputSelect2 from '../../../../components/selects/InputSelect2';
import { HocKyLopHocPhan, LoaiChuongTrinhDaoTao, yearOptions } from '@/types/options';
import { ToolbarButton } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import { usePopoverLock } from '@/hooks/context/PopoverLock';
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
      height: 200,
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
interface ITableEditProps {
  row: any[];
  columns: GridColDef[];
  apiRef?: any;
  isSaving?: boolean;
  isLoading?: boolean;
  setFilterModel?: (data: any) => void;
  setSortModel?: ({ field, sort }: { field: string; sort: string | null | undefined }) => void;
  handleSave: (item: any) => void;
  setfilter: Dispatch<
    React.SetStateAction<{
      hocKy: number;
      loaiChuongTrinh: number;
      chuongTrinh: string;
      khoa: number;
    } | null>
  >;
  chuongTrinhDaotao?: any;
  isLoadingCtdt?: boolean;
  contentPopover?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TableEdit = forwardRef(
  (
    {
      columns,
      row,
      isLoading,
      setFilterModel,
      setSortModel,
      isSaving,
      apiRef,
      handleSave,
      setfilter,
      isLoadingCtdt,
      chuongTrinhDaotao,
      contentPopover,
      isOpen,
      handleClick,
      onClose
    }: ITableEditProps,
    ref
  ) => {
    const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});

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

    const handleCellClick = React.useCallback((params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) return;
      setCellModesModel({
        [params.id]: { [params.field]: { mode: GridCellModes.Edit } }
      });
    }, []);
    const handleCellModesModelChange = React.useCallback((newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    }, []);
    const saveChanges = React.useCallback(async () => {
      const updatedRows = Object.values(unsavedChangesRef.current.unsavedRows);
      handleSave(updatedRows);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {}
      };
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut'
        }}
        className='flex flex-col gap-4'
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <Box className='flex w-full gap-4 p-4 border border-gray-200 rounded-lg shadow-sm light:bg-white'>
          <Box className='flex w-full justify-center items-center gap-3 flex-1'>
            <Box className='flex justify-center items-center gap-3 w-full'>
              <Typography className='!text-[16px] !leading-6 !font-semibold'>Bậc</Typography>
              <Box className='flex-1'>
                <InputSelect2
                  fullWidth
                  name={'bac'}
                  placeholder={'Chọn bậc'}
                  data={LoaiChuongTrinhDaoTao ?? []}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option: any) => option.name}
                  getOnChangeValue={(value) => {
                    setfilter((prev: any) => ({
                      ...prev,
                      loaiChuongTrinh: value?.id
                    }));
                  }}
                />
              </Box>
            </Box>
            <Box className='flex justify-center items-center gap-3 w-full'>
              <Typography className='!text-[16px] !leading-6 !font-semibold'>Khóa</Typography>
              <Box className='flex-1'>
                <InputSelect2
                  fullWidth
                  name={'khoa'}
                  placeholder={'Chọn Khoa'}
                  data={yearOptions ?? []}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option: any) => option.name}
                  getOnChangeValue={(value) => {
                    setfilter((prev: any) => ({
                      ...prev,
                      khoa: value?.id
                    }));
                  }}
                />
              </Box>
            </Box>
            <Box className='flex justify-center items-center gap-3 w-full'>
              <Typography className='!text-[16px] !leading-6 !font-semibold'>Loại</Typography>
              <Box className='flex-1'>
                <InputSelect2
                  fullWidth
                  name={'daoTao'}
                  placeholder={'Chọn đào tạo'}
                  data={chuongTrinhDaotao ?? []}
                  isLoading={isLoadingCtdt}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option: any) => option.name}
                  getOnChangeValue={(value) => {
                    setfilter((prev: any) => ({
                      ...prev,
                      chuongTrinh: value?.id
                    }));
                  }}
                />
              </Box>
            </Box>
            <Box className='flex justify-center items-center gap-3 w-full'>
              <Typography className='!text-[16px] !leading-6 !font-semibold'>Học kỳ</Typography>
              <Box className='flex-1'>
                <InputSelect2
                  fullWidth
                  name={'hocKy'}
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
              </Box>
            </Box>
          </Box>
          <Box className='flex justify-end'>
            <LoadingButton
              disabled={false}
              loading={false}
              startIcon={<SaveIcon />}
              loadingPosition='start'
              onClick={() => saveChanges()}
              className='!bg-blue-500 !text-white !rounded-md !px-4 !py-2 hover:!bg-blue-600 transition-all !duration-200 !ease-in-out !shadow-sm !text-base !leading-6 hover:transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Typography className='!text-[16px] !leading-6 !font-semibold'>Lưu</Typography>
            </LoadingButton>
          </Box>
        </Box>

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
            minHeight: '400px',
            overflowY: 'auto',
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
      </motion.div>
    );
  }
);

export default TableEdit;
