import React from 'react'
import AddTuan from './components/AddTuan'
import { Box } from '@mui/material'

const page = () => {
  return (
    <Box className="flex flex-col gap-3">
        <AddTuan/>
    </Box>
  )
}

export default page