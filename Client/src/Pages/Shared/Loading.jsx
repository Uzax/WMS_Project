import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';


const Loading = () => {
    return (
              <CircularProgress sx={{width: '100%' , height: '100px' , color: '#ffffff'}} />
          );
}


export default Loading;