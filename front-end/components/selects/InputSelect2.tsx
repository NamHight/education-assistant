'use client';
import React, { memo } from 'react';
import { Autocomplete, Box, FormControl, TextField, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { alpha } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import { clsx } from 'clsx';
import MessageError from '../texts/MessageError';

interface InputSelectProps {
  title?: string;
  name: string;
  error?: string | any;
  control?: any;
  fullWidth?: boolean;
  setValueSelect?: (data: any) => void;
  getKeyValueSelect?: any;
  data?: any[];
  limitShow?: number;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  freeSolo?: boolean;
  getOptionLabel?: (option: any) => string;
  getOptionKey?: (option: any) => string | number;
  getOnChangeValue?: (value: any) => void;
  disablePortal?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  [key: string]: any;
}

const InputSelect2 = (props: InputSelectProps) => {
  const {
    title,
    error,
    name,
    control,
    fullWidth,
    data,
    limitShow,
    placeholder,
    className,
    multiple,
    isDisabled,
    isLoading,
    freeSolo,
    getOptionKey,
    getOptionLabel,
    setValueSelect,
    getKeyValueSelect,
    getOnChangeValue,
    disablePortal,
    onOpen,
    onClose,
    ...rest
  } = props;

  return (
    <FormControl
      sx={{
        '& [class*="-control"]': { zIndex: '0 !important' },
        '& [class^="mui-"]:not([class*="-menu"]) + [class^="mui-"]': {
          zIndex: 10
        },
        width: fullWidth ? '100%' : 'auto',
        '& .MuiOutlinedInput-input': {
          padding: '0 !important',
          paddingY: '5px !important',
          margin: '0 !important',
          borderRadius: '8px !important'
        },
        '& .MuiIconButton-root': {
          border: 'none !important',
          padding: '0 !important',
          width: '32px !important',
          height: '32px !important',
          '& .MuiSvgIcon-root': {
            fontSize: '24px !important',
            '&:hover': {
              color: '#dd1313'
            }
          }
        }
      }}
    >
      {title && (
        <Box className={'flex justify-start items-center gap-1'}>
          <Typography
            className={clsx('!text-[16px] !font-[500] !leading-6', {
              '!text-gray-500': !error,
              '!text-red-600': !!error
            })}
          >
            {title}
          </Typography>
        </Box>
      )}
      {control ? (
        <>
          <Controller
            name={name || ''}
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...rest}
                value={field.value || (multiple ? [] : null)}
                onChange={(event, newValue) => {
                  getOnChangeValue?.(newValue);
                  setValueSelect?.(newValue ? newValue[getKeyValueSelect] : null);
                  field.onChange(newValue);
                }}
                freeSolo={freeSolo}
                clearIcon={<ClearIcon className={'w-4 h-4'} />}
                slotProps={{
                  clearIndicator: {
                    sx: {
                      padding: '8px !important',
                      color: (theme) => theme.palette.text.secondary,
                      border: 'none !important',
                      backgroundColor: 'transparent !important',

                      '&:hover': {
                        color: (theme) => theme.palette.error.main,
                        backgroundColor: (theme) => `${alpha(theme.palette.error.main, 0.08)} !important`
                      },

                      '& svg': {
                        fontSize: '1.125rem !important'
                      }
                    }
                  },
                  popupIndicator: {
                    sx: {
                      padding: '8px !important',
                      color: (theme) => theme.palette.text.secondary,
                      border: 'none !important',
                      backgroundColor: 'transparent !important',

                      '&:hover': {
                        color: (theme) => theme.palette.primary.main,
                        backgroundColor: (theme) => `${alpha(theme.palette.primary.main, 0.08)} !important`
                      },

                      // Target icon SVG
                      '& svg': {
                        fontSize: '1.25rem !important',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }
                  },

                  chip: {
                    className: 'mr-1',
                    sx: {
                      '& .MuiSvgIcon-root': {
                        color: alpha('#dd1313', 0.7),
                        '&:hover': {
                          color: '#dd1313'
                        }
                      }
                    }
                  }
                }}
                multiple={multiple}
                fullWidth={fullWidth}
                loading={isLoading}
                disabled={isDisabled}
                limitTags={limitShow}
                id={`multiple-limit-${name}`}
                options={data ?? []}
                getOptionLabel={getOptionLabel}
                getOptionKey={getOptionKey}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => {
                  return <TextField {...params} placeholder={placeholder} />;
                }}
                className={clsx(``, className)}
                sx={(theme) => ({
                  mb: '3px',
                  '& .MuiOutlinedInput-root': {
                    height: 'unset',
                    padding: '4.573px 10px',
                    borderRadius: '8px !important',
                    borderColor: error ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.grey[600], 0.5),
                    '& fieldset': {
                      borderColor: alpha(theme.palette.divider, 0.5)
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.5)
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.5)
                    }
                  },

                  '& .MuiAutocomplete-endAdornment': {
                    '& .MuiIconButton-root': {
                      padding: '8px !important',
                      border: 'none !important',
                      backgroundColor: 'transparent !important',

                      '&[title="Open"]': {
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: `${theme.palette.primary.main} !important`,
                          backgroundColor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
                          transform: 'rotate(180deg)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      },
                      '&[title="Clear"]': {
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: `${theme.palette.error.main} !important`,
                          backgroundColor: `${alpha(theme.palette.error.main, 0.08)} !important`,
                          transform: 'scale(1.1)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      },

                      '& svg': {
                        fontSize: '1.25rem !important',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }
                  }
                })}
              />
            )}
          />
        </>
      ) : (
        <>
          <Autocomplete
            {...rest}
            disablePortal={disablePortal}
            onOpen={onOpen}
            onClose={onClose}
            freeSolo={freeSolo}
            multiple={multiple}
            fullWidth={fullWidth}
            disabled={isDisabled}
            limitTags={limitShow}
            loading={isLoading}
            id={`multiple-limit-${name}`}
            options={data ?? []}
            onChange={(event, newValue) => {
              getOnChangeValue?.(newValue);
              setValueSelect?.(newValue ? newValue[getKeyValueSelect] : null);
            }}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
            slotProps={{
              clearIndicator: {
                sx: {
                  padding: '8px !important',
                  color: (theme) => theme.palette.text.secondary,
                  border: 'none !important',
                  backgroundColor: 'transparent !important',

                  '&:hover': {
                    color: (theme) => theme.palette.error.main,
                    backgroundColor: (theme) => `${alpha(theme.palette.error.main, 0.08)} !important`,
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease-in-out'
                  },

                  '& svg': {
                    fontSize: '1.125rem !important'
                  }
                }
              },
              popupIndicator: {
                sx: {
                  padding: '8px !important',
                  color: (theme) => theme.palette.text.secondary,
                  border: 'none !important',
                  backgroundColor: 'transparent !important',

                  '&:hover': {
                    color: (theme) => theme.palette.primary.main,
                    backgroundColor: (theme) => `${alpha(theme.palette.primary.main, 0.08)} !important`,
                    transform: 'rotate(180deg)',
                    transition: 'all 0.2s ease-in-out'
                  },

                  // Target icon SVG
                  '& svg': {
                    fontSize: '1.25rem !important',
                    transition: 'all 0.2s ease-in-out'
                  }
                }
              },

              chip: {
                className: 'mr-1',
                sx: {
                  '& .MuiSvgIcon-root': {
                    color: alpha('#dd1313', 0.7),
                    '&:hover': {
                      color: '#dd1313'
                    }
                  }
                }
              }
            }}
            className={className}
            sx={(theme) => ({
              '& .MuiOutlinedInput-root': {
                height: 'unset',
                margin: '0 !important',
                padding: '4.573px 13px',
                borderRadius: '8px !important',
                borderColor: error ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.grey[600], 0.5),
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.5)
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.5)
                },
                '&.Mui-focused fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.5)
                }
              },

              '& .MuiAutocomplete-endAdornment': {
                '& .MuiIconButton-root': {
                  padding: '8px !important',
                  border: 'none !important',
                  backgroundColor: 'transparent !important',

                  '&[title="Open"]': {
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: `${theme.palette.primary.main} !important`,
                      backgroundColor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
                      transform: 'rotate(180deg)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  },
                  '&[title="Clear"]': {
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: `${theme.palette.error.main} !important`,
                      backgroundColor: `${alpha(theme.palette.error.main, 0.08)} !important`,
                      transform: 'scale(1.1)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  },

                  '& svg': {
                    fontSize: '1.25rem !important',
                    transition: 'all 0.2s ease-in-out'
                  }
                }
              }
            })}
          />
        </>
      )}
      {error && <MessageError message={error} />}
    </FormControl>
  );
};
export default memo(InputSelect2);
