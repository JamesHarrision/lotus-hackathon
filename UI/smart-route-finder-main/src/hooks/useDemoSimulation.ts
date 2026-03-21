import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useDemoSimulation = (active: boolean = true) => {
  const { branches, updateBranchLoad } = useAppStore();

  useEffect(() => {
    if (!active) return;
    
    // Periodically fluctuate loads to simulate real-world activity
    const interval = setInterval(() => {
      const branchKeys = Object.keys(branches);
      if (branchKeys.length === 0) return;

      // Pick 1-3 random branches to update
      const numToUpdate = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numToUpdate; i++) {
        const randomKey = branchKeys[Math.floor(Math.random() * branchKeys.length)];
        const branch = branches[Number(randomKey)];
        
        if (branch) {
          // Generate a realistic fluctuation (-5 to +5 people, bounded by 0 and maxCapacity)
          const fluctuation = Math.floor(Math.random() * 11) - 5; 
          
          let newLoad = branch.currentLoad + fluctuation;
          if (newLoad < 0) newLoad = 0;
          if (newLoad > branch.maxCapacity) newLoad = branch.maxCapacity;

          updateBranchLoad({
            ...branch,
            currentLoad: newLoad,
            loadPercentage: Math.round((newLoad / branch.maxCapacity) * 10000) / 100
          });
        }
      }
    }, 2000); // run every 2 seconds

    return () => clearInterval(interval);
  }, [active, branches, updateBranchLoad]);
};
