import baseApis from '../../baseApis/baseApis';

export const projectApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: ({ searchTerm, page }) => ({
        url: `/project/get-all-project`,
        method: 'GET',
        params: { searchTerm, page },
      }),
      providesTags: ['project'],
    }),
    getSingleProject: builder.query({
      query: ({ id }) => ({
        url: `/project/get-single-project/${id}`,
        method: 'GET',
      }),
      providesTags: ['project'],
    }),
    createProjects: builder.mutation({
      query: ({ data }) => {
        return {
          url: '/project/create-project',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['project'],
    }),

    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/project/update-project/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['project'],
    }),
    getProjectsImags: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/project-image/get-project-images/${id}`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['project'],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetSingleProjectQuery,
  useCreateProjectsMutation,
  useUpdateProjectMutation,
  useGetProjectsImagsQuery,
} = projectApis;
