// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const technologyApi = createApi({
  reducerPath: "technologyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3500/",
  }),
  endpoints: (builder) => ({
    getAlltechnologies: builder.query({
      query: () => `/technologies`,
    }),
    gettechnology: builder.query({
      query: (tid) => `/gettechnology/${tid}`,
    }),
    getQuestions:builder.query({
      query:()=> "/getQuestions"
    }),
    addQuestion: builder.mutation({
      query: (question) => {
        return {
          url:"/addQuestion",
          method:"POST",
          body: question
        }
      }
    }),
    addtechnology: builder.mutation({
      query: (technology) => {
        return {
          url: "/addtechnology",
          method: "POST",
          body: technology,
        };
      },
    }),
    updatetechnology: builder.mutation({
      query: ({ tid, updtech }) => {
        return {
          url: `/updatetechnology/${tid}`,
          method: "PUT",
          body: updtech,
        };
      },
    }),
    deletetechnology: builder.mutation({
      query: (tid) => {
        return {
          url: `/deletetechnology/${tid}`,
          method: "DELETE",
        };
      },
    }),
    addconcept: builder.mutation({
      query: ({ concept, id }) => {
        return {
          url: `/addconcept/${id}`,
          method: "PUT",
          body: concept,
        };
      },
    }),
    updateconcept: builder.mutation({
      query: ({ concept, tid, cid }) => {
        return {
          url: `/updateconceptname/${tid}/${cid}`,
          method: "PUT",
          body: concept,
        };
      },
    }),
    deleteconcept: builder.mutation({
      query: ({ tid, cid }) => {
        return {
          url: `/deleteconcept/${tid}/${cid}`,
          method: "DELETE",
        };
      },
    }),
    addtopic: builder.mutation({
      query: ({ topicInfo, tid, cid }) => {
        return {
          url: `/addtopic/${tid}/${cid}`,
          method: "PUT",
          body: topicInfo,
        };
      },
    }),
    edittopic: builder.mutation({
      query: ({ topicInfo, tid, cid, topicid }) => {
        return {
          url: `/edittopic/${tid}/${cid}/${topicid}`,
          method: "PUT",
          body: topicInfo,
        };
      },
    }),
    addcontent: builder.mutation({
      query: ({ formData, tid, cid, topicId }) => {
        return {
          url: `/addcontent/${tid}/${cid}/${topicId}`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    topicdetails: builder.query({
      query: ({ tid, cid }) => `/topicdetails/${tid}/${cid}`,
    }),
    gettopicdetails: builder.query({
      query: ({ tid, cid, topicId, contentId }) =>
        `/gettopicdetails/${tid}/${cid}/${topicId}/${contentId}`,
    }),
    updatetopic: builder.mutation({
      query: ({ topicInfo, tid, cid, topicId, contentId }) => {
        return {
          url: `/updatetopic/${tid}/${cid}/${topicId}/${contentId}`,
          method: "PUT",
          body: topicInfo,
        };
      },
    }),
    deletecontent: builder.mutation({
      query: ({ tid, cid, topicId, contentId }) => ({
        url: `/deletecontent/${tid}/${cid}/${topicId}/${contentId}`,
        method: "DELETE",
      }),
    }),
    deletetopic: builder.mutation({
      query: ({ tid, cid, toid }) => {
        return {
          url: `/deletetopic/${tid}/${cid}/${toid}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAlltechnologiesQuery,

  useGettechnologyQuery,
  useLazyGettechnologyQuery,
  //FOR TECHNOLOGY

  useAddQuestionMutation,
  useGetQuestionsQuery,
  //FOR QUIZ

  useAddtechnologyMutation,
  useUpdatetechnologyMutation,
  useDeletetechnologyMutation,
  //FOR CONCEPT

  useAddconceptMutation,
  useUpdateconceptMutation,
  useDeleteconceptMutation,

  //
  useTopicdetailsQuery,
  useLazyTopicdetailsQuery,
  useGettopicdetailsQuery,

  //FOR TOPIC
  useAddtopicMutation,
  useDeletetopicMutation,
  useEdittopicMutation,

  //FOR CONTENT
  useAddcontentMutation,
  useUpdatetopicMutation,
  useDeletecontentMutation,
} = technologyApi;
