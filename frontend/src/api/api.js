import axios from "axios";

const api = async () => {
  try {
    const results = await axios.get("http://localhost:4000/");
    const data = await results.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default api;
