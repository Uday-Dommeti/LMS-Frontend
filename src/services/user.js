import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:3500/user/"}),
    endpoints: (builder) => ({
        createAccount : builder.mutation({
            query : (accountDetails) => {
                return {
                    url:"/signup",
                    method: "POST",
                    body: accountDetails
                }
            }
        }),
        login : builder.mutation({
            query: (loginCredentials) => {
                return {
                    url : "/login",
                    method:"POST",
                    body: loginCredentials
                }
            }
        })
    })
})

export const {useCreateAccountMutation,useLoginMutation} = userApi;