'use client';
import {
  Box,
  Button,
  Toolbar,
  TextField,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import React, {
  forwardRef,
  Fragment,
  memo,
  ReactNode,
  use,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { motion } from 'motion/react';
import {
  DataGrid,
  GridActionsCellItem,
  gridClasses,
  GridColDef,
  GridDataSource,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  ToolbarButton
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { GiangVienService } from '@/services/GiangVienService';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import clsx from 'clsx';
import { TextFields } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import theme from '@/theme';
import { useRouter } from 'next/navigation';
import { Eye, EyeClosed } from 'lucide-react';




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
      mt: 'auto'
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

interface TableProps {
  rows: any[] | GridRowsProp;
  columns: GridColDef[];
  editMode?: 'row' | 'cell';
  isLoading?: boolean;
  isFetching?: boolean;
  setPaginationModel?: ({ page, pageSize }: { page: number; pageSize: number }) => void;
  setFilterModel?: (data: any) => void;
  setSortModel?: ({ field, sort }: { field: string; sort: string | null | undefined }) => void;
  totalRow?: number;
  apiRefDataGrid?: React.RefObject<GridApiCommunity | null> | undefined;
  paginationModel?: { page: number; pageSize: number };
  customToolBar?: boolean;
  placeholderSearch?: string;
  handleChooseRow?: (id: string | number, row: any) => void;
  handleDeleteCallBack?: (id: string | number | null) => void;
  moreActions?: (id: string | number | null, row: any) => ReactNode;
  urlNavigate?: string;
  isDisableEdit?: boolean;
  isOpenOption?: () => void;
  isMoreCellAction?: boolean;
  [key: string]: any;
}

const Table = React.forwardRef<any, TableProps>(function table(
  {
    rows,
    columns,
    isFetching,
    isLoading,
    setFilterModel,
    setPaginationModel,
    setSortModel,
    totalRow,
    apiRefDataGrid,
    paginationModel,
    customToolBar,
    placeholderSearch = 'Search...',
    handleChooseRow,
    handleDeleteCallBack,
    moreActions,
    urlNavigate,
    isOpenOption,
    isMoreCellAction,
    isDisableEdit,
    editMode = 'row',
    ...rest
  },
  ref
) {
  const [item, setItem] = useState<{ id: string | number | null; row: any | null }>({ id: null, row: null });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElConfirmDelete, setAnchorElConfirmDelete] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseDelete = () => {
    setAnchorElConfirmDelete(false);
  };
  const handleOpenDelete = () => {
    setAnchorElConfirmDelete(true);
  };
  useImperativeHandle(
    ref,
    () => ({
      handleClose: () => {
        handleClose();
      },
      handleOpenDelete: () => {
        handleOpenDelete();
      },
      handleCloseDelete: () => {
        handleCloseDelete();
      }
    }),
    []
  );
  const handleMoreAction = useCallback(
    (id: string | number | null, row: any) => {
      if (moreActions) {
        return moreActions(id, row);
      }
      return null;
    },
    [moreActions]
  );
  const columnsMemo = useMemo((): GridColDef[] => {
    return [
      ...columns,
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Thao tác',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id, row }) => {
          return isMoreCellAction
            ? [
                <GridActionsCellItem
                  key={id}
                  icon={
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        position: 'relative',
                        width: 24,
                        height: 24
                      }}
                      className='group'
                    >
                      <Eye
                        className='!transition-opacity !duration-200 group-hover:!opacity-0'
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          opacity: 1,
                          transition: 'opacity 0.2s',
                          color: '#00bcd4' // teal/cyan, more vibrant
                        }}
                      />
                      <EyeClosed
                        className='!transition-opacity !duration-200 group-hover:!opacity-100 opacity-0'
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          color: '#26c6da' // lighter cyan
                        }}
                      />
                    </span>
                  }
                  label='More'
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    handleChooseRow?.(id, row);
                    isOpenOption?.();
                    setItem({
                      id: id,
                      row: row
                    });
                  }}
                  color='inherit'
                />,
                <GridActionsCellItem
                  key={id}
                  icon={<MoreVertIcon />}
                  label='Edit'
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    handleChooseRow?.(id, row);
                    handleClick(event);
                    setItem({
                      id: id,
                      row: row
                    });
                  }}
                  color='inherit'
                />
              ]
            : [
                <GridActionsCellItem
                  key={id}
                  icon={<MoreVertIcon />}
                  label='Edit'
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    handleChooseRow?.(id, row);
                    handleClick(event);
                    setItem({
                      id: id,
                      row: row
                    });
                  }}
                  color='inherit'
                />
              ];
        }
      }
    ];
  }, [columns]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1] // cubic-bezier for smoothness
      }}
      style={{
        display: 'flex',
        flexDirection: 'column', // ✅ Fix height calculation
        overflow: 'hidden',
      }}
    >
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
        sx={(theme) => ({})}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {isDisableEdit ? null : (
          <MenuItem
            disabled={!!item?.row?.deletedAt}
            onClick={() => router.push(`${urlNavigate}/${item.id}`)}
            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <EditIcon sx={{ color: 'blue' }} />
            <Typography
              className={'!text-[14px] !font-[500] !leading-6 group-hover:!text-blue-800 group-hover:!font-semibold'}
              variant={'body1'}
              sx={{ width: '100%' }}
            >
              Chỉnh sửa
            </Typography>
          </MenuItem>
        )}
        <MenuItem
          disabled={!!item?.row?.deletedAt}
          onClick={handleOpenDelete}
          sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <DeleteIcon sx={{ color: 'red' }} />
          <Typography
            className={'!text-[14px] !font-[500] !leading-6 group-hover:!text-red-700 group-hover:!font-semibold'}
            variant={'body1'}
            sx={{ width: '100%' }}
          >
            Xóa
          </Typography>
        </MenuItem>
        {handleMoreAction(item.id, item.row)}
      </Menu>
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
              handleDeleteCallBack?.(item.id);
              handleCloseDelete();
              handleClose();
            }}
            autoFocus
          >
            Đồng ý
          </motion.button>
        </DialogActions>
      </Dialog>
      <DataGrid
        {...rest}
        rowSelection={false}
        slots={{
          noRowsOverlay: noRowsOverlay
        }}
        autosizeOnMount={false}
        autoPageSize={false}
        disableColumnMenu
        apiRef={apiRefDataGrid}
        rows={rows ?? []}
        columns={columnsMemo ?? []}
        editMode={editMode}
        disableRowSelectionOnClick={true}
        columnHeaderHeight={70}
        hideFooter
        getRowHeight={() => 'auto'}
        disableColumnResize
        density='compact'
        loading={isFetching || isLoading}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'linear-progress'
          },
          filterPanel: {
            disableAddFilterButton: false,
            disableRemoveAllButton: false,
            sx: {
              '& .MuiDataGrid-filterForm': {
                gap: '6px'
              }
            },
            filterFormProps: {
              deleteIconProps: {
                sx: {
                  '& .MuiButtonBase-root': { border: 'none' },
                  '& .MuiSvgIcon-root': { color: '#d32f2f' }
                }
              },
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small'
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' }
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' }
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small'
                }
              }
            }
          }
        }}
        className='!border-gray-200 shadow-sm'
        sx={(theme) => ({
        flex: 1, // ✅ Take remaining space
          '& .MuiDataGrid-actionsCell .MuiButtonBase-root': {
            background: '#f5f5f5',
            color: '#1976d2',
            border: 'none',
            borderRadius: '8px',
            padding: '4px',
            transition: 'background-color 0.3s, color 0.3s',
            '&:active': {
              background: '#e3f2fd',
              color: '#1565c0'
            },
            '&:hover': {
              background: '#e3f2fd',
              color: '#1565c0'
            }
          },
          [`& .${gridClasses.columnHeaders}`]: {
            color: theme.palette.text.primary,
                        borderBottom: `1px solid ${theme.palette.grey[600]}`
                      },
          '& .MuiDataGrid-footerContainer ': {
            borderTop: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200]}`
          },
          '& .MuiButtonBase-root': {
            borderRadius: '4px',
            padding: '0 !important',
            width: '24px',
            height: '24px',
            marginLeft: '4px'
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important',
            '&.deleted': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.2)'
              }
            }
          },
          '& .MuiDataGrid-main': {
            overflow: 'auto', // ✅ Enable scrolling
          flex: 1
          },
          '& .MuiDataGrid-virtualScroller': {
          minHeight: '300px', // ✅ Minimum content height
          flex: 1
        },
          borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
          '& .MuiDataGrid-cell': {
            whiteSpace: 'break-spaces',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: '1.5',
            padding: '10px 8px',
            display: 'flex',
            alignItems: 'center',
            '@media (min-width: 728px)': { fontSize: '14px' },
            borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200]
          },
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none'
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
            outline: 'none'
          }
        })}
      />
    </motion.div>
  );
});

export default memo(Table);
