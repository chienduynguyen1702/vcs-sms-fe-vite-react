import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveAs } from 'file-saver';

import useQueryString from '../../useQueryString';
import {
  addParameter,
  editParameter,
  getListParameter,
  getStages,
  getEnvironments,
  getVersions,
  getProjectOverview,
  downloadListParameter,
} from '../../../services/api';
// import { PARAMETERS } from '../../mocks/parameters';
import moment from 'moment';
import { toast } from 'react-toastify';
import { number } from 'yup';

const DEFAULT_QUERY_STRING = {
  page: 1,
  limit: 10,
};

const useListParameters = (project_id) => {
  const { id } = useParams();
  if (!project_id) {
    project_id = id;
  }
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
    const parameters = data?.parameters?.map((item) => {
      return {
        id: item.ID,
        name: item.name,
        value: item.value,
        stage: {
          name: item.stage.name,
          color: item.stage.color,
        },
        environment: {
          name: item.environment.name,
          color: item.environment.color,
        },
        createdAt: item.CreatedAt, //moment(item.CreatedAt).format('YYYY/MM/DD HH:MM:SS'),
        updatedAt: moment(item.edited_at).format('YYYY/MM/DD HH:MM:SS'),
        isApplied: item.is_applied,
        description: item.description,
      };
    });
    const pagination = {
      total: parameters?.length || 0,
      currentPage: queryString.page,
      totalPage: Math.ceil((parameters?.length || 0) / limit),
    };
    return { pagination, parameters };
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['parameters', queryString],
    queryFn: () => getListParameter(project_id, queryString),
    staleTime: 10 * 1000,
    select: (data) => parseData(data.data, page, limit),
    enabled: true,
  });

  const addParameterMutation = useMutation(
    (data) => {
      return addParameter(data.project_id, data.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['parameters'],
        });
        toast.success(
          'Add parameter successfully! Start rerun cicd to apply changes.',
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

  const editParameterMutation = useMutation(
    (data) => {
      return editParameter(data.project_id, data.parameter_id, data.data);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: ['parameters'],
        });
        console.log('editParameterMutation response:', response);
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
  ////////////////////////// Get stages //////////////////////////
  const parseStages = useCallback((data) => {
    const stages = data?.map((stage) => {
      // console.log("stage:", stage)
      return {
        id: stage.ID,
        name: stage.name,
        description: stage.description,
        color: stage.color,
      };
    });
    return stages;
  }, []);

  const { data: stages } = useQuery({
    queryKey: ['stages'],
    queryFn: () => getStages(),
    select: (data) => parseStages(data.data.stages),
    staleTime: 10 * 1000,
    enabled: true,
  });

  ////////////////////////// Get environments //////////////////////////
  const parseEnvironments = useCallback((data) => {
    const environments = data?.map((env) => {
      // console.log("env:", env)
      return {
        id: env.ID,
        name: env.name,
        description: env.description,
        color: env.color,
      };
    });
    return environments;
  }, []);

  const { data: environments } = useQuery({
    queryKey: ['environments'],
    queryFn: () => getEnvironments(),
    select: (data) => parseEnvironments(data.data.environments),
    staleTime: 10 * 1000,
    enabled: true,
  });
  ////////////////////////// Get versions //////////////////////////
  const parseVersions = useCallback((data) => {
    const versions = data?.map((version) => {
      // console.log("version:", version)
      return {
        id: version.ID,
        name: version.name,
        number: version.number,
        description: version.description,
        color: version.color,
      };
    });
    return versions;
  }, []);

  const { data: versions } = useQuery({
    queryKey: ['versions'],
    queryFn: () => getVersions(project_id),
    select: (data) => parseVersions(data.data.versions),
    staleTime: 10 * 1000,
    enabled: true,
  });
  // Hàm tải xuống danh sách tham số
  const downloadParameters = async (queryString) => {
    console.log('downloadParameters queryString:', queryString);
    try {
      // get project name
      const responseProject = await getProjectOverview(project_id);
      const projectName = responseProject.data.overview.name;
      const response = await downloadListParameter(project_id, queryString);
      const blob = new Blob([response.data], { type: 'text/csv' });
      saveAs(
        blob,
        `Parameters_${projectName}_Ver_${
          queryString.version ? queryString.version : 'Latest'
        }${queryString.stages ? queryString.stages : ''}${
          queryString.environments ? queryString.environments : ''
        }.txt`,
      );
      toast.success('Download successfully!');
    } catch (error) {
      toast.error('Download failed!');
    }
  };
  return {
    listParameters: data?.parameters,
    pagination: data?.pagination,
    stages,
    environments,
    versions,
    isSuccess,
    isLoading,
    addParameterMutation,
    editParameterMutation,
    downloadParameters,
  };
};

export default useListParameters;
