const fetchAllNotifications = async (): Promise<
  ReturnDataFromFetch<NotificationsData[]>
> => {
  try {
    return await getFetchWithToken<NotificationsData[]>("NOTIFICATIONS", "");
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchReadAllNotifications = async (): Promise<ReturnDataFromFetch> => {
  try {
    return await putFetchWithToken("NOTIFICATIONS", "read-all");
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchReadNotifications = async (
  id: number,
): Promise<ReturnDataFromFetch> => {
  try {
    return await putFetchWithToken("NOTIFICATIONS", `${id}/read`);
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchUnReadCount = async (): Promise<
  ReturnDataFromFetch<{ unread_count: number }>
> => {
  try {
    return await getFetchWithToken<{ unread_count: number }>(
      "NOTIFICATIONS",
      "unread/count",
    );
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchDeleteNotification = async (id: number) => {
  try {
    return await deleteFetchWithToken("NOTIFICATIONS", String(id));
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const useNotifications = () => {
  return {
    fetchAllNotifications,
    fetchUnReadCount,
    fetchReadAllNotifications,
    fetchReadNotifications,
    fetchDeleteNotification,
  };
};
