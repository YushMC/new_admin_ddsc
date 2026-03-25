const fetchAllStats = async () =>
  await getFetchWithToken<StatsResponse[]>("STATISTICS", "my-statistics");

const fetchCreateStats = async (mod_id: number) =>
  await postFetchWithToken<StatsResponse>("STATISTICS", "", { mod_id });

const useStats = () => {
  return {
    fetchAllStats,
    fetchCreateStats,
  };
};

export default useStats;
