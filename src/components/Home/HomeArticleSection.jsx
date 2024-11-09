import React from "react";
import Loading from "../Loading";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getDocs,
  query,
  collection,
  limit,
  where,
  orderBy,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import SuggestedPost from "../SuggestedPost";
import UsePopularityAlgorithm from "../../hooks/UsePopularityAlgorithm";
import UseProfileDataQuery from "../../hooks/UseProfileDataQuery";
const HomeArticleSection = ({ filter, userId, sort, sortAll }) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 * 2);
  let userData;
  if (userId) {
    const { data: temp } = UseProfileDataQuery(userId);
    userData = temp;
  } else {
    userData = null;
  }
  // const { data: userData } = UseProfileDataQuery(userId ? userId : null);
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["articles", filter, sort, sortAll],
    queryFn: async ({ pageParam }) => {
      let q;
      if (!filter) {
        q = query(
          collection(db, "articles"),
          where("draft", "==", false),
          // where("date", ">", sevenDaysAgo),
          ...(sort
            ? [orderBy("likeCount", "desc")]
            : [orderBy("date", "desc")]),
          ...(sortAll
            ? []
            : [where("author", "in", userData?.data().following)]),
          limit(10),
          ...(pageParam ? [startAfter(pageParam)] : [])
        );
      } else {
        q = query(
          collection(db, "articles"),
          where("draft", "==", false),
          // where("date", ">", sevenDaysAgo),
          where("tags", "array-contains", filter),
          ...(sort
            ? [orderBy("likeCount", "desc")]
            : [orderBy("date", "desc")]),
          ...(sortAll
            ? []
            : [where("author", "in", userData?.data().following)]),
          limit(10),
          ...(pageParam ? [startAfter(pageParam)] : [])
        );
      }
      const res = await getDocs(q);

      const sortedArticles = sort
        ? res.docs?.sort(
            (a, b) =>
              UsePopularityAlgorithm(
                b.data().likeCount,
                b.data().date.seconds
              ) -
              UsePopularityAlgorithm(a.data().likeCount, a.data().date.seconds)
          )
        : res.docs;

      return {
        data: sortedArticles,
        firstVisible: sortedArticles[0],
        lastVisible: sortedArticles[sortedArticles.length - 1],
      };
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.lastVisible;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.firstVisible;
    },
  });

  return (
    <div className="w-full">
      {isLoading && (
        <>
          <Loading />
          <Loading />
          <Loading />
        </>
      )}

      {!isLoading && (
        <div>
          {data?.pages?.map((page) => {
            return (
              <div key={page?.firstVisible?.id}>
                {page?.data?.map((doc) => (
                  <SuggestedPost
                    article={doc.id}
                    articleData={doc.data()}
                    key={doc.id}
                    userId={userId}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {isError && (
        <>
          <h1>Something went wrong</h1>
        </>
      )}

      {!isLoading && data.pages[data.pages.length - 1].data.length >= 10 && (
        <button
          className="btn"
          onClick={() => fetchNextPage()}
          disabled={isFetching}
        >
          {isFetching ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default HomeArticleSection;
