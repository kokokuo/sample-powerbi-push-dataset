import axios, { AxiosRequestConfig } from "axios";

const groupsUrl = "https://api.powerbi.com/v1.0/myorg/groups";


export type GroupResult = {
  id: string;
  isReadOnly: boolean;
  isOnDedicatedCapacity: boolean;
  name: string;
}

export const getGroups = async (accessToken: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      ContentType: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await axios.get(groupsUrl, config);
  return {
    code: response.status,
    message: response.statusText,
    data: response.data.value as Array<GroupResult>,
  };
};
