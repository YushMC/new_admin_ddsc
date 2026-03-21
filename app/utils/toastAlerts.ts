const useToastAlerts = () => {
  const toast = useToast();

  const showToast = (data: { success: boolean; message: string }) => {
    toast.add({
      title: data.success ? "Correcto" : "Error",
      description: data.message,
      color: data.success ? "success" : "error",
    });
  };

  return {
    showToast,
  };
};

export default useToastAlerts;
