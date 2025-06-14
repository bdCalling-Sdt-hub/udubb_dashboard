import baseApis from '../../baseApis/baseApis';

export const userApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: ({ page, role, searchTerm, limit }) => ({
        url: '/user/get-all-user',
        method: 'GET',
        params: { page, role, searchTerm, limit },
      }),
      providesTags: ['user'],
    }),
    getAllEmployee: builder.query({
      query: ({ page, role, searchTerm, limit }) => ({
        url: '/user/get-all-employee',
        method: 'GET',
        params: { page, role, searchTerm, limit },
      }),
      providesTags: ['user'],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/user/delete-account/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['user'],
    }),
    createUser: builder.mutation({
      query: ({ data }) => ({
        url: `/user/register-user`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useGetAllEmployeeQuery,
} = userApis;
