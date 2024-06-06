import { useMemo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// import { getArchivedAgents } from '../../../services/api';
const useListServersArchived = ({
  archivedServers = {
    // listArchivedAPI: '',
    // archiveAPI: '',
    // unarchiveAPI: '',
    // keyArchivistList: '',
    // keyList: '',
    // title: '',
    // project_id: '',
  },
}) => {
  const queryClient = useQueryClient();

  const {
    listArchivedAPI,
    archiveAPI,
    unarchiveAPI,
    keyList,
    keyArchivistList,
    title,
    project_id,
  } = archivedServers;

  const [search, setSearch] = useState('');

  const parseData = useCallback((data) => {
    return data.map((item) => {
      return {
        id: item?.id,
        name: item?.ip,
        archiver: item?.archived_by,
        archivedAt: item?.archived_at,
      };
    });
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [keyArchivistList],
    queryFn: () => {
      return listArchivedAPI(project_id);
    },
    select: (data) => parseData(data.data.data),
  });

  const dataFiltered = useMemo(() => {
    if (!data) return [];
    const dataFiltered = data.filter((item) =>
      item?.name.toLowerCase().includes(search.toLowerCase()),
    );
    return dataFiltered;
  }, [data, search]);

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const unarchiveMutation = useMutation(
    async (id) => {
      return unarchiveAPI(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [keyList],
        });
        queryClient.invalidateQueries({
          queryKey: [keyArchivistList],
        });
        toast.success(`${title} unarchived successfully`);
      },
    },
  );
  const [isArchivedSuccess, setIsArchivedSuccess] = useState(false);
  const archiveMutation = useMutation(
    (id) => {
      return archiveAPI(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [keyList],
        });
        queryClient.invalidateQueries({
          queryKey: [keyArchivistList],
        });
        setIsArchivedSuccess(true);
        toast.success(`${title} archived successfully`);
      },
      onError: (error) => {
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      },
    },
  );

  return {
    archivedList: dataFiltered,
    isSuccess,
    isLoading,
    search,
    handleSearch,
    archiveMutation,
    isArchivedSuccess,
    unarchiveMutation,
  };
};

export default useListServersArchived;
