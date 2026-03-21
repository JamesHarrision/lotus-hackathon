import { useEffect } from 'react';
import { initSocket, disconnectSocket } from '../lib/socket';
import { useAppStore, BranchLoadData } from '../store/useAppStore';

export const useSocketIntegration = () => {
  const { updateBranchLoad, token } = useAppStore();

  useEffect(() => {
    // We only connect the socket if the user is authenticated (has token)
    // Adjust this block if socket should be public
    if (!token) return;

    const socket = initSocket();
    
    // Connect explicitly
    socket.connect();

    // Event handlers
    socket.on('connect', () => {
      console.log('[Socket] Connected to server.');
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from server.');
    });

    socket.on('branch_load_changed', (data: BranchLoadData) => {
      // Dispatch updating the Zustand store
      // Thus, any UI using the Zustand store (App, Dashboard) will auto-update without reload
      updateBranchLoad(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('branch_load_changed');
      disconnectSocket();
    };
  }, [token, updateBranchLoad]);
};
