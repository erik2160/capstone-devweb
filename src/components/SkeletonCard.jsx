import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function SkeletonCard() {
    return (
        <Box>
            <Skeleton
                variant="rectangular"
                height={240}
                sx={{ borderRadius: 2, mb: 1 }}
            />
            <Skeleton variant="text" height={28} />
            <Skeleton variant="text" height={20} width="70%" />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Skeleton variant="rounded" width={64} height={24} />
                <Skeleton variant="rounded" width={64} height={24} />
                <Skeleton variant="rounded" width={64} height={24} />
            </Box>
        </Box>
    );
}
