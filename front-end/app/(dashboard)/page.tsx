"use client"
import React from 'react';
import {Typography} from "@mui/material";
import Button from '@/components/buttons/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
const Page = () => {
  return (
    <div>
      <Typography>
        <Button title='Create' className={'bg-blue-500 border-b-blue-200 hover:bg-blue-700 rounded py-2 px-4 font-bold text-white cursor-pointer'} icon={<AddCircleOutlineIcon />}/>
      </Typography>
    </div>
  );
};

export default Page;