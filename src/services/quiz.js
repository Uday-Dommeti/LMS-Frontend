import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const quizApi = createApi({
    reducerPath: "quizApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500/" }),
    endpoints: (builder) => ({
        addQuiz: builder.mutation({
            query: (quiz) => {
                return {
                    url: "/addQuiz",
                    method: "POST",
                    body: quiz
                }
            }
        }),
        getAllQuizzes: builder.query({
            query: () => "/getAllQuizzes"
        }),
        getQuizById: builder.query({
            query: (Id) => {
                return {
                    url: `/getQuizById/${Id}`,
                    headers: {
                        token: window.localStorage.getItem("token")
                    }
                }
            }

        }),
        editQuizById: builder.mutation({
            query: (editedQuiz) => {
                // console.log("Edited quiz Id",editedQuiz._id);
                return {
                    url: `/editQuizById/${editedQuiz._id}`,
                    method: "PUT",
                    body: editedQuiz
                }
            }
        }),
        deleteQuizById: builder.mutation({
            query: (Id) => {
                return {
                    url: `/deleteQuizById/${Id}`,
                    method: "DELETE"
                }
            }
        }),
        saveResults: builder.mutation({
            query: (responses) => {
                console.log("RTK::", responses)
                return {
                    url: "/submitQuiz",
                    method: "POST",
                    headers: {
                        token: window.localStorage.getItem("token")
                    },
                    body: responses
                }
            }
        }),
        getStudentResults: builder.query({
            query: () => {
                return {
                    url: `/getStudentResults`,
                    headers: {
                        token: localStorage.getItem("token")
                    }
                }
            }
        }),
        getQuizResultsById: builder.query({
            query: (Id) => {
                return {
                    url: `/getResultsByQuizId/${Id}`,
                    headers:{
                        token : localStorage.getItem("token")
                    }
                }
            }
        }),
    })
})

export const {
    useAddQuizMutation,
    useGetAllQuizzesQuery,
    useGetQuizByIdQuery,
    useEditQuizByIdMutation,
    useDeleteQuizByIdMutation,
    useLazyGetAllQuizzesQuery,
    useLazyGetQuizByIdQuery,
    useSaveResultsMutation,
    useGetStudentResultsQuery,
    useLazyGetStudentResultsQuery,
    useGetQuizResultsByIdQuery } = quizApi;