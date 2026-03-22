const fetchAllStats = async () =>
  await getFetchWithToken<StatsResponse[]>("STATISTICS", "my-statistics");

const fetchAllStatsWithSkipAndLimit = async (skip: number, limit: number) =>
  await getFetchWithToken<StatsResponse[]>(
    "STATISTICS",
    `my-statistics?skip=${skip}&limit=${limit}`,
  );

const fetchCreateStats = async (mod_id: number) =>
  await postFetchWithToken<StatsResponse>("STATISTICS", "", { mod_id });

const useStats = () => {
  return {
    fetchAllStats,
    fetchCreateStats,
    fetchAllStatsWithSkipAndLimit,
  };
};

export default useStats;
