'use client';
import React, { Dispatch, forwardRef, RefObject, useState } from 'react';
import {
  DataGrid,
  GridRowId,
  GridValidRowModel,
  DataGridProps,
  useGridApiRef,
  GridActionsCellItem,
  GridColDef,
  gridClasses,
  GridCellModes,
  GridCellModesModel,
  GridCellParams
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { darken } from '@mui/material/styles';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { motion } from 'motion/react';
import { Box, Typography } from '@mui/material';
import InputSelect2 from '../selects/InputSelect2';
import { HocKyLopHocPhan, LoaiChuongTrinhDaoTao, yearOptions } from '@/types/options';
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
  truongTrinhDaoTao?: any;
  isLoadingCtdt?: boolean;
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
      truongTrinhDaoTao
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
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
        className='flex flex-col gap-4'
      >
        <Box className='flex w-full gap-4 items-center'>
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
                data={truongTrinhDaoTao ?? []}
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
          <Box className='flex justify-end w-full'>
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
          filterDebounceMs={1000}
          editMode='cell'
          onFilterModelChange={setFilterModel}
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
          sortingMode='client'
          filterMode='client'
          showColumnVerticalBorder
          showCellVerticalBorder
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
          sx={(theme) => ({
            height: 'calc(100% - 300px) !important',
            borderColor: theme.palette.grey[600],
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
