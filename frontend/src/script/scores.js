import axios from "axios";

export const scores = async () => {
  const result = axios.get("https://scrapeme.live/shop/");
  const d = await result.data;
  console.log(d);
};
