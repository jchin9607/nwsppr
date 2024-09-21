import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const UseProfileDataQuery = (user) => {
  const docRef = doc(db, "users", user);
  const { data, isLoading, error } = useQuery({
    queryFn: async () => await getDoc(docRef),
    queryKey: ["users", user],
  });
  return { data, isLoading, error };
};

export default UseProfileDataQuery;
