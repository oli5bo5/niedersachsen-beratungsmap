import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getSupabaseCompanies, 
  getSupabaseSpecializations,
  createSupabaseCompany,
  deleteSupabaseCompany,
  getSupabaseStats
} from '@/app/actions/supabase-companies'

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: getSupabaseCompanies,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSpecializations() {
  return useQuery({
    queryKey: ['specializations'],
    queryFn: getSupabaseSpecializations,
    staleTime: 10 * 60 * 1000, // Spezialisierungen ändern sich selten
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getSupabaseStats,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createSupabaseCompany,
    onSuccess: () => {
      // Invalidate und refetch relevante Queries
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteSupabaseCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}



