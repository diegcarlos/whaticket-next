import api from "../../services/api";

const useQueues = () => {
  const findAll = async () => {
    const { data } = await api.get("/queue");
    console.log("log aqui", data);
    return data;
  };

  return { findAll };
};

export default useQueues;
