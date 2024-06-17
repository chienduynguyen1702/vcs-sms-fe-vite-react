import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveAs } from 'file-saver';

import useQueryString from '../../useQueryString';
import {
  addServer,
  editServer,
  getListServers,
  deleteServer,
  getProjectOverview,
  downloadListServer,
  sendServerReportToEmail,
} from '../../../services/api';
// import { PARAMETERS } from '../../mocks/servers';
import { toast } from 'react-toastify';

const DEFAULT_QUERY_STRING = {
  page: 1,
  limit: 10,
};

const useListServers = () => {
  const queryClient = useQueryClient();
  const { queryString, setQueryString } = useQueryString();

  const { page, limit } = queryString;

  useEffect(() => {
    if (!page || !limit) {
      setQueryString(DEFAULT_QUERY_STRING);
    }
  }, [limit, page, queryString, setQueryString]);

  const parseData = useCallback((data, page, limit) => {
    // console.log('data:', data);
    const servers = data?.data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        ip: item.ip,
        description: item.description,
        is_online: item.is_online,
        ping_at: item.ping_at,
      };
    });
    const pagination = {
      total: data?.total || 0,
      currentPage: queryString.page,
      totalPage: Math.ceil((data?.total || 0) / limit),
    };
    return { pagination, servers };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['servers', queryString],
    queryFn: () => getListServers(queryString),
    staleTime: 10 * 1000,
    select: (data) => parseData(data.data.data, page, limit),
    enabled: true,
  });

  const addServerMutation = useMutation(
    (data) => {
      return addServer(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['servers'],
        });
        toast.success(
          'Add server successfully! Start rerun cicd to apply changes.',
        );
      },
      onError: (error) => {
        // if 500 internal server error
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      },
    },
  );

  const editServerMutation = useMutation(
    (data) => {
      return editServer(data.server_id, data.data);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: ['servers'],
        });
        console.log('editServerMutation response:', response);
        const successMessage = response.data.message;
        toast.success(successMessage, {
          autoClose: 10000,
        });
      },
      onError: (error) => {
        toast.error(error.response.data.message, {
          autoClose: 10000,
        });
      },
    },
  );

  const deleteServerMutation = useMutation(
    (server_id) => {
      return deleteServer(server_id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['servers'],
        });
        toast.success('Delete server successfully!');
      },
      onError: (error) => {
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      },
    },
  );

  const sendServerReportToEmailMutation = useMutation(
    (data) => {
      console.log('sendServerReportToEmailMutation data:', data);
      return sendServerReportToEmail(data);
    },
    {
      onSuccess: (response) => {
        console.log('sendServerReportToEmailMutation response:', response);
        const successMessage = response.data.message;
        toast.success(successMessage, {
          autoClose: 10000,
        });
      },
      onError: (error) => {
        toast.error(error.response.data.message, {
          autoClose: 10000,
        });
      },
    },
  );
  // Hàm tải xuống danh sách tham số
  // const downloadServers = async (queryString) => {
  //   console.log('downloadServers queryString:', queryString);
  //   try {
  //     // get project name
  //     const responseProject = await getProjectOverview(project_id);
  //     const projectName = responseProject.data.overview.name;
  //     const response = await downloadListServer(project_id, queryString);
  //     const blob = new Blob([response.data], { type: 'text/csv' });
  //     saveAs(
  //       blob,
  //       `Servers_${projectName}_Ver_${
  //         queryString.version ? queryString.version : 'Latest'
  //       }.txt`,
  //     );
  //     toast.success('Download successfully!');
  //   } catch (error) {
  //     toast.error('Download failed!');
  //   }
  // };

  return {
    listServers: data?.servers,
    pagination: data?.pagination,
    isSuccess,
    isLoading,
    addServerMutation,
    editServerMutation,
    deleteServerMutation,
    // downloadServers,
    sendServerReportToEmailMutation,
  };
};

export default useListServers;
