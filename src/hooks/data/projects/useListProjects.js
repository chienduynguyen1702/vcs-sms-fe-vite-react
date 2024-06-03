import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useQueryString from '../../useQueryString';
import {
  addProject,
  editProject,
  getListProjects,
  applyParameters,
  releaseVersionParameters,
} from '../../../services/api';
import { toast } from 'react-toastify';

const DEFAULT_QUERY_STRING = {
  page: 1,
  limit: 10,
};

const useListProjects = () => {
  const queryClient = useQueryClient();
  const { queryString, setQueryString } = useQueryString();

  const { page, limit } = queryString;

  useEffect(() => {
    if (!page || !limit) {
      setQueryString(DEFAULT_QUERY_STRING);
    }
  }, [limit, page, queryString, setQueryString]);

  const parseData = useCallback((data, page, limit) => {
    const projects = data?.projects?.map((project) => {
      return {
        id: project?.id,
        createdAt: project?.CreatedAt,
        name: project?.name,
        color: project?.color,
        usersCount: project?.users_count,
        repoUrl: project?.RepoURL,
        description: project?.description,
        address: project?.address,
        currentSprint: project?.CurrentSprint,
        startDate: project?.startDate,
        status: project?.status,
        autoUpdate: project?.auto_update,
      };
    });
    const pagination = {
      total: projects?.length || 0,
      currentPage: page,
      limit: limit,
      totalPage: Math.ceil((projects?.length || 0) / limit),
    };
    // console.log('pagination', pagination);

    return { pagination, projects };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['projects', queryString],
    queryFn: () => getListProjects(queryString),
    staleTime: 10 * 1000,
    select: (data) => parseData(data.data, page, limit),
    enabled: true,
  });

  const addProjectMutation = useMutation(
    (data) => {
      return addProject(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['projects'],
        });
        // console.log('add project success:',data);
        toast.success('Add project successfully');
      },
      onError: (error) => {
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      },
    },
  );

  const editProjectMutation = useMutation(
    (data) => {
      return editProject(data.id, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['projects'],
        });
        toast.success('Edit project successfully');
      },
      onError: (error) => {
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      },
    },
  );

  const applyParametersMutation = useMutation(
    (data) => {
      return applyParameters(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['projects'],
        });
        toast.success('Apply parameters successfully, waiting for agent pull');
      },
      onError: (error) => {
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      },
    },
  );
  const releaseVersionParametersMutation = useMutation(
    (data) => {
      return releaseVersionParameters(data.project_id, data.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['projects', 'releaseVersion'],
        });
        toast.success('Release version successfully');
      },
      onError: (error) => {
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      },
    },
  );
  return {
    listProjects: data?.projects,
    pagination: data?.pagination,
    isSuccess,
    isLoading,
    addProjectMutation,
    editProjectMutation,
    applyParametersMutation,
    releaseVersionParametersMutation,
  };
};

export default useListProjects;
