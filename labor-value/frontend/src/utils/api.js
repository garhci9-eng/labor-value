import axios from 'axios'

const api = axios.create({ baseURL: '/api', timeout: 15000 })

export const fetchSectors  = ()       => api.get('/sectors')
export const fetchPresets  = ()       => api.get('/presets')
export const fetchPreset   = (id)     => api.get(`/presets/${id}`)
export const calculate     = (data)   => api.post('/calculate', data)
export const compareWorkers= (workers)=> api.post('/compare', { workers })
export const healthCheck   = ()       => api.get('/health')

export default api
