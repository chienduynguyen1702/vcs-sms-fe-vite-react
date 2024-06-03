import { useQuery } from '@tanstack/react-query';
import { getProjectOverview } from '../../../services/api';

const useProjectOverviewAndUserList = (id) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['projects', 'overview', id],
    queryFn: () => {
      return getProjectOverview(id);
      // return true;
    },
    select: (data) => data.data,
  });
  const overview = {
    id: data?.overview.ID,
    name: data?.overview.name,
    description: data?.overview.description,
    status: data?.overview.status,
    start_at: data?.overview.start_at,
    address: data?.overview.address,
    current_sprint: data?.overview.current_sprint,
    repo_url: data?.overview.repo_url,
    member_count: data?.users?.length,
    auto_update: data?.overview.auto_update,
  };
  const usersList = data?.users;
  // console.log(data);
  // map to get stages
  const stages = data?.overview?.stages.map((stage) => ({
    id: stage?.ID,
    name: stage?.name,
    description: stage?.description,
    color: stage?.color,
  }));
  // console.log("stages: ", stages);
  // map to get environments
  const environments = data?.overview?.environments.map((environment) => ({
    id: environment?.ID,
    name: environment?.name,
    description: environment?.description,
    color: environment?.color,
  }));
  // console.log("environments: ", environments);

  const listWorkflows = data?.overview?.workflows?.map((workflow) => ({
    id: workflow?.workflow_id,
    workflow_name: workflow?.name,
    path: workflow?.path,
    state: workflow?.state,
    url_path: `https://${data?.overview.repo_url}/blob/main/${workflow?.path}`,
  }));
  return {
    // // overview tab
    overview: overview,
    stages: stages,
    environments: environments,
    usersList: usersList,
    isSuccess,
    listWorkflows,

    // listUsersAndRoles,
    // updateProject,
    // addUserAndRole,
    // editUserAndRole,

    // // parameters tab
    // listParameters,
    // addParameter,
    // editParameter,
    // deleteParameter,
    // // parameters/stages
    // listStages,         addStage,
    // // parameters/environments
    // listEnvironments,   addEnvironment,
    // // parameters/versions
    // listVersions,       addVersion,

    // // agents tab
    // listAgents,
    // addAgent,
    // editAgent,
    // deleteAgent,

    // // tracking tab
    // getTracking,
  };
};

export default useProjectOverviewAndUserList;
